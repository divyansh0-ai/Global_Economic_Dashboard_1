import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { fetchWorldBankData, getCountryName } from '../lib/worldbank';

interface ComparisonChartProps {
  countries: string[];
  indicators: Array<{ code: string; name: string }>;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function ComparisonChart({ countries, indicators }: ComparisonChartProps) {
  const [selectedYear, setSelectedYear] = useState('2022');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (countries.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const chartData: any[] = [];
        const yearsSet = new Set<string>();

        // Fetch data for each country
        for (const country of countries) {
          const countryDataPoint: any = {
            country: getCountryName(country),
            countryCode: country
          };

          for (const indicator of indicators) {
            const indicatorData = await fetchWorldBankData(country, indicator.code);
            
            // Collect all years
            indicatorData.forEach((item: any) => {
              if (item.value !== null) {
                yearsSet.add(item.year.toString());
              }
            });

            // Get value for selected year
            const yearData = indicatorData.find((item: any) => item.year.toString() === selectedYear);
            if (yearData) {
              countryDataPoint[indicator.name] = yearData.value;
            }
          }

          chartData.push(countryDataPoint);
        }

        // Set available years and update selected year if needed
        const sortedYears = Array.from(yearsSet).sort((a, b) => parseInt(b) - parseInt(a));
        setAvailableYears(sortedYears);
        
        if (!sortedYears.includes(selectedYear) && sortedYears.length > 0) {
          setSelectedYear(sortedYears[0]);
        }

        setData(chartData);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [countries, selectedYear]);

  const formatValue = (value: number, indicatorName: string) => {
    if (indicatorName === 'GDP') {
      if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      return `$${value.toFixed(0)}`;
    }
    return value?.toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Country Comparison</CardTitle>
            <CardDescription>Compare economic indicators across selected countries</CardDescription>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {indicators.map((indicator, index) => (
              <div key={indicator.code}>
                <h4 className="mb-4 text-slate-700">{indicator.name} - {selectedYear}</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="country" 
                      stroke="#64748b"
                    />
                    <YAxis 
                      stroke="#64748b"
                      tickFormatter={(value) => formatValue(value, indicator.name)}
                    />
                    <Tooltip
                      formatter={(value: any) => formatValue(value, indicator.name)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey={indicator.name} 
                      fill={COLORS[index % COLORS.length]}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
