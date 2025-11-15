import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { Loader2, GitCompare } from 'lucide-react';
import { fetchWorldBankData, getCountryName } from '../lib/worldbank';
import { calculateCorrelation } from '../lib/analytics';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CorrelationAnalysisProps {
  countries: string[];
}

const INDICATORS = [
  { code: 'NY.GDP.PCAP.CD', name: 'GDP Per Capita' },
  { code: 'FP.CPI.TOTL.ZG', name: 'Inflation Rate' },
  { code: 'SL.UEM.TOTL.ZS', name: 'Unemployment Rate' },
  { code: 'NE.EXP.GNFS.ZS', name: 'Exports (% GDP)' },
  { code: 'NE.IMP.GNFS.ZS', name: 'Imports (% GDP)' },
  { code: 'GC.DOD.TOTL.GD.ZS', name: 'Government Debt (% GDP)' },
  { code: 'NY.GDS.TOTL.ZS', name: 'Gross Savings (% GDP)' },
  { code: 'NY.GDP.MKTP.KD.ZG', name: 'GDP Growth Rate' },
];

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function CorrelationAnalysis({ countries }: CorrelationAnalysisProps) {
  const [xIndicator, setXIndicator] = useState('NY.GDP.PCAP.CD');
  const [yIndicator, setYIndicator] = useState('SL.UEM.TOTL.ZS');
  const [scatterData, setScatterData] = useState<any[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (countries.length === 0) {
        setScatterData([]);
        setCorrelationMatrix({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const scatterPoints: any[] = [];
        const countryCorrelations: any = {};

        for (const country of countries) {
          // Fetch data for scatter plot
          const xData = await fetchWorldBankData(country, xIndicator);
          const yData = await fetchWorldBankData(country, yIndicator);

          // Match data by year
          const xMap = new Map(xData.map(d => [d.year, d.value]));
          
          yData.forEach(item => {
            const xValue = xMap.get(item.year);
            if (xValue && item.value) {
              scatterPoints.push({
                x: xValue,
                y: item.value,
                year: item.year,
                country: getCountryName(country),
                countryCode: country,
              });
            }
          });

          // Calculate correlation for this country
          const xValues: number[] = [];
          const yValues: number[] = [];
          
          yData.forEach(item => {
            const xValue = xMap.get(item.year);
            if (xValue && item.value) {
              xValues.push(xValue);
              yValues.push(item.value);
            }
          });

          if (xValues.length > 2) {
            countryCorrelations[country] = calculateCorrelation(xValues, yValues);
          }
        }

        setScatterData(scatterPoints);
        setCorrelationMatrix(countryCorrelations);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [countries, xIndicator, yIndicator]);

  const getCorrelationStrength = (r: number): string => {
    const abs = Math.abs(r);
    if (abs >= 0.8) return 'Very Strong';
    if (abs >= 0.6) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    if (abs >= 0.2) return 'Weak';
    return 'Very Weak';
  };

  const getCorrelationColor = (r: number): string => {
    if (r > 0.6) return 'text-green-600';
    if (r > 0.3) return 'text-blue-600';
    if (r > -0.3) return 'text-slate-600';
    if (r > -0.6) return 'text-orange-600';
    return 'text-red-600';
  };

  const xIndicatorName = INDICATORS.find(i => i.code === xIndicator)?.name || '';
  const yIndicatorName = INDICATORS.find(i => i.code === yIndicator)?.name || '';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            Correlation Analysis
          </CardTitle>
          <CardDescription>
            Analyze relationships between economic indicators using Pearson correlation coefficient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Indicator Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-2 block">X-Axis Indicator</label>
                <Select value={xIndicator} onValueChange={setXIndicator}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDICATORS.map(indicator => (
                      <SelectItem key={indicator.code} value={indicator.code}>
                        {indicator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-2 block">Y-Axis Indicator</label>
                <Select value={yIndicator} onValueChange={setYIndicator}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDICATORS.map(indicator => (
                      <SelectItem key={indicator.code} value={indicator.code}>
                        {indicator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="h-96 flex items-center justify-center">
                <p className="text-destructive">{error}</p>
              </div>
            ) : scatterData.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <>
                {/* Correlation Coefficients */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countries.map((country, index) => {
                    const correlation = correlationMatrix[country];
                    if (correlation === undefined) return null;

                    return (
                      <div
                        key={country}
                        className="p-4 rounded-lg border-2"
                        style={{ borderColor: COLORS[index % COLORS.length] }}
                      >
                        <p className="text-sm text-slate-600 mb-2">{getCountryName(country)}</p>
                        <p className={`text-3xl ${getCorrelationColor(correlation)}`}>
                          {correlation.toFixed(3)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {getCorrelationStrength(correlation)} {correlation > 0 ? 'positive' : 'negative'}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Scatter Plot */}
                <ResponsiveContainer width="100%" height={500}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="x"
                      name={xIndicatorName}
                      stroke="#64748b"
                      label={{ value: xIndicatorName, position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      dataKey="y"
                      name={yIndicatorName}
                      stroke="#64748b"
                      label={{ value: yIndicatorName, angle: -90, position: 'insideLeft' }}
                    />
                    <ZAxis range={[50, 200]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-lg border shadow-lg">
                              <p className="font-medium">{data.country}</p>
                              <p className="text-sm text-slate-600">Year: {data.year}</p>
                              <p className="text-sm">{xIndicatorName}: {data.x?.toFixed(2)}</p>
                              <p className="text-sm">{yIndicatorName}: {data.y?.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {countries.map((country, index) => {
                      const countryData = scatterData.filter(d => d.countryCode === country);
                      return (
                        <Scatter
                          key={country}
                          name={getCountryName(country)}
                          data={countryData}
                          fill={COLORS[index % COLORS.length]}
                        />
                      );
                    })}
                  </ScatterChart>
                </ResponsiveContainer>

                {/* Info Box */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Pearson Correlation Coefficient (r)</strong> measures the linear relationship 
                    between two variables. Values range from -1 (perfect negative correlation) to +1 (perfect 
                    positive correlation). A value near 0 indicates no linear relationship.
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
