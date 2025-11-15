import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';
import { fetchWorldBankData, getCountryName } from '../lib/worldbank';
import { calculateGrowthRate, calculateCAGR } from '../lib/analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface GrowthRateAnalysisProps {
  countries: string[];
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function GrowthRateAnalysis({ countries }: GrowthRateAnalysisProps) {
  const [gdpGrowthData, setGdpGrowthData] = useState<any[]>([]);
  const [yoyData, setYoyData] = useState<any[]>([]);
  const [cagrData, setCAGRData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (countries.length === 0) {
        setGdpGrowthData([]);
        setYoyData([]);
        setCAGRData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch GDP growth rate data
        const growthDataMap: any = {};
        const yoyDataMap: any = {};
        const cagrResults: any[] = [];

        for (const country of countries) {
          // Fetch official GDP growth rate
          const growthData = await fetchWorldBankData(country, 'NY.GDP.MKTP.KD.ZG');
          growthData.forEach((item: any) => {
            if (!growthDataMap[item.year]) {
              growthDataMap[item.year] = { year: item.year };
            }
            growthDataMap[item.year][country] = item.value;
          });

          // Fetch GDP for YoY calculation
          const gdpData = await fetchWorldBankData(country, 'NY.GDP.MKTP.CD');
          const sortedGDP = gdpData.sort((a, b) => a.year - b.year);
          
          // Calculate year-over-year percentage change
          for (let i = 1; i < sortedGDP.length; i++) {
            const year = sortedGDP[i].year;
            const currentValue = sortedGDP[i].value;
            const previousValue = sortedGDP[i - 1].value;
            
            if (currentValue && previousValue) {
              const yoyGrowth = calculateGrowthRate(previousValue, currentValue);
              
              if (!yoyDataMap[year]) {
                yoyDataMap[year] = { year };
              }
              yoyDataMap[year][country] = yoyGrowth;
            }
          }

          // Calculate CAGR for different periods
          if (sortedGDP.length > 0) {
            const latestYear = sortedGDP[sortedGDP.length - 1].year;
            const latestValue = sortedGDP[sortedGDP.length - 1].value;

            // 5-year CAGR
            const fiveYearAgo = sortedGDP.find(d => d.year === latestYear - 5);
            const cagr5 = fiveYearAgo && latestValue 
              ? calculateCAGR(fiveYearAgo.value, latestValue, 5) 
              : null;

            // 10-year CAGR
            const tenYearAgo = sortedGDP.find(d => d.year === latestYear - 10);
            const cagr10 = tenYearAgo && latestValue
              ? calculateCAGR(tenYearAgo.value, latestValue, 10)
              : null;

            cagrResults.push({
              country: getCountryName(country),
              countryCode: country,
              cagr5,
              cagr10,
              latestYear
            });
          }
        }

        const growthChartData = Object.values(growthDataMap).sort((a: any, b: any) => a.year - b.year);
        const yoyChartData = Object.values(yoyDataMap).sort((a: any, b: any) => a.year - b.year);

        setGdpGrowthData(growthChartData);
        setYoyData(yoyChartData);
        setCAGRData(cagrResults);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [countries]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-96 flex items-center justify-center">
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            GDP Growth Rate Analysis
          </CardTitle>
          <CardDescription>
            Annual GDP growth rates and compound annual growth rates (CAGR)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="annual" className="space-y-4">
            <TabsList>
              <TabsTrigger value="annual">Annual Growth</TabsTrigger>
              <TabsTrigger value="yoy">Year-over-Year</TabsTrigger>
              <TabsTrigger value="cagr">CAGR Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="annual">
              {gdpGrowthData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={gdpGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(val) => `${val}%`} />
                    <Tooltip
                      formatter={(value: any) => `${value?.toFixed(2)}%`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    {countries.map((country, index) => (
                      <Line
                        key={country}
                        type="monotone"
                        dataKey={country}
                        name={getCountryName(country)}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="yoy">
              {yoyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={yoyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(val) => `${val}%`} />
                    <Tooltip
                      formatter={(value: any) => `${value?.toFixed(2)}%`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    {countries.map((country, index) => (
                      <Bar
                        key={country}
                        dataKey={country}
                        name={getCountryName(country)}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cagr">
              {cagrData.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cagrData.map((item, index) => (
                      <div 
                        key={item.countryCode}
                        className="p-6 rounded-lg border-2"
                        style={{ borderColor: COLORS[index % COLORS.length] }}
                      >
                        <h4 className="mb-4" style={{ color: COLORS[index % COLORS.length] }}>
                          {item.country}
                        </h4>
                        <div className="space-y-3">
                          {item.cagr5 !== null && (
                            <div>
                              <p className="text-sm text-slate-600">5-Year CAGR</p>
                              <p className="text-2xl" style={{ color: COLORS[index % COLORS.length] }}>
                                {item.cagr5.toFixed(2)}%
                              </p>
                            </div>
                          )}
                          {item.cagr10 !== null && (
                            <div>
                              <p className="text-sm text-slate-600">10-Year CAGR</p>
                              <p className="text-2xl" style={{ color: COLORS[index % COLORS.length] }}>
                                {item.cagr10.toFixed(2)}%
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-slate-500 pt-2 border-t">
                            As of {item.latestYear}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>CAGR (Compound Annual Growth Rate)</strong> represents the mean annual growth rate 
                      over a specified period, providing a smoothed annual rate that accounts for compounding.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
