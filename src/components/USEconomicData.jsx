import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, Building2, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { fetchFREDSeries, FRED_SERIES } from '../lib/apis/fred';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';

const INDICATOR_CATEGORIES = {
  'Economic Output': [
    { id: FRED_SERIES.GDP, name: 'GDP', icon: DollarSign, color: '#3b82f6' },
    { id: FRED_SERIES.GDP_REAL, name: 'Real GDP', icon: DollarSign, color: '#2563eb' },
    { id: FRED_SERIES.GDP_PER_CAPITA, name: 'GDP Per Capita', icon: Users, color: '#1d4ed8' },
  ],
  'Employment & Labor': [
    { id: FRED_SERIES.UNEMPLOYMENT_RATE, name: 'Unemployment Rate', icon: Users, color: '#ef4444' },
    { id: FRED_SERIES.NONFARM_PAYROLL, name: 'Nonfarm Payroll', icon: Building2, color: '#dc2626' },
    { id: FRED_SERIES.LABOR_FORCE_PARTICIPATION, name: 'Labor Force Participation', icon: Users, color: '#b91c1c' },
  ],
  'Prices & Inflation': [
    { id: FRED_SERIES.INFLATION_RATE, name: 'Inflation Rate', icon: TrendingUp, color: '#f59e0b' },
    { id: FRED_SERIES.CPI, name: 'Consumer Price Index', icon: TrendingUp, color: '#d97706' },
    { id: FRED_SERIES.CORE_CPI, name: 'Core CPI', icon: TrendingUp, color: '#b45309' },
  ],
  'Interest Rates': [
    { id: FRED_SERIES.FEDERAL_FUNDS_RATE, name: 'Federal Funds Rate', icon: DollarSign, color: '#10b981' },
    { id: FRED_SERIES.TREASURY_10Y, name: '10-Year Treasury', icon: DollarSign, color: '#059669' },
    { id: FRED_SERIES.TREASURY_2Y, name: '2-Year Treasury', icon: DollarSign, color: '#047857' },
  ],
};

export function USEconomicData() {
  const [selectedCategory, setSelectedCategory] = useState('Economic Output');
  const [selectedIndicators, setSelectedIndicators] = useState([FRED_SERIES.GDP]);
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (selectedIndicators.length === 0) {
        setChartData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = {};
        let allMockData = true;

        // Fetch data for each selected indicator
        for (const seriesId of selectedIndicators) {
          try {
            const seriesData = await fetchFREDSeries(seriesId);
            results[seriesId] = seriesData;
            
            // Check if it's real data (has proper observations with realistic values)
            if (seriesData.observations && seriesData.observations.length > 5) {
              allMockData = false;
            }
          } catch (err) {
            console.error(`Failed to fetch ${seriesId}:`, err);
            // Continue with other indicators
          }
        }

        setUsingMockData(allMockData);
        setData(results);

        // Merge data for chart
        const mergedData = {};
        
        Object.entries(results).forEach(([seriesId, seriesData]) => {
          if (seriesData.observations) {
            seriesData.observations.forEach((obs) => {
              if (!mergedData[obs.date]) {
                mergedData[obs.date] = { date: obs.date };
              }
              mergedData[obs.date][seriesId] = obs.value;
            });
          }
        });

        const chartArray = Object.values(mergedData).sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });

        setChartData(chartArray);
      } catch (err) {
        setError('Failed to load FRED data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedIndicators]);

  useEffect(() => {
    // Update selected indicators when category changes
    const categoryIndicators = INDICATOR_CATEGORIES[selectedCategory];
    if (categoryIndicators && categoryIndicators.length > 0) {
      setSelectedIndicators([categoryIndicators[0].id]);
    }
  }, [selectedCategory]);

  const getSeriesName = (seriesId) => {
    for (const category of Object.values(INDICATOR_CATEGORIES)) {
      const indicator = category.find(ind => ind.id === seriesId);
      if (indicator) return indicator.name;
    }
    return seriesId;
  };

  const getSeriesColor = (seriesId) => {
    for (const category of Object.values(INDICATOR_CATEGORIES)) {
      const indicator = category.find(ind => ind.id === seriesId);
      if (indicator) return indicator.color;
    }
    return '#6366f1';
  };

  const toggleIndicator = (indicatorId) => {
    if (selectedIndicators.includes(indicatorId)) {
      if (selectedIndicators.length > 1) {
        setSelectedIndicators(selectedIndicators.filter(id => id !== indicatorId));
      }
    } else {
      if (selectedIndicators.length < 4) {
        setSelectedIndicators([...selectedIndicators, indicatorId]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {usingMockData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Using mock data for demonstration. To access real FRED data, set up the Flask backend with your FRED API key.
            See <code>/backend/README.md</code> for setup instructions.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            US Economic Data (FRED)
          </CardTitle>
          <CardDescription>
            Federal Reserve Economic Data - Real-time US economic indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              {Object.keys(INDICATOR_CATEGORIES).map(category => (
                <TabsTrigger key={category} value={category}>
                  {category.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(INDICATOR_CATEGORIES).map(([category, indicators]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {/* Indicator Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {indicators.map(indicator => {
                    const Icon = indicator.icon;
                    const isSelected = selectedIndicators.includes(indicator.id);
                    const seriesData = data[indicator.id];
                    const latestValue = seriesData?.observations?.[seriesData.observations.length - 1]?.value;
                    
                    return (
                      <button
                        key={indicator.id}
                        onClick={() => toggleIndicator(indicator.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                        }`}
                        style={{
                          borderColor: isSelected ? indicator.color : undefined,
                          backgroundColor: isSelected ? `${indicator.color}10` : undefined,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4" style={{ color: indicator.color }} />
                          <span className="text-sm font-medium">{indicator.name}</span>
                        </div>
                        {latestValue !== undefined && (
                          <p className="text-lg font-bold" style={{ color: indicator.color }}>
                            {latestValue.toFixed(2)}
                          </p>
                        )}
                        {isSelected && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Selected
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedIndicators.length >= 4 && (
                  <p className="text-sm text-amber-600">
                    Maximum 4 indicators can be displayed at once
                  </p>
                )}

                {loading ? (
                  <div className="h-96 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : error ? (
                  <div className="h-96 flex items-center justify-center">
                    <p className="text-destructive">{error}</p>
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b"
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                        }}
                      />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Legend />
                      {selectedIndicators.map((seriesId) => (
                        <Line
                          key={seriesId}
                          type="monotone"
                          dataKey={seriesId}
                          name={getSeriesName(seriesId)}
                          stroke={getSeriesColor(seriesId)}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    <p className="text-muted-foreground">Select an indicator to view data</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
