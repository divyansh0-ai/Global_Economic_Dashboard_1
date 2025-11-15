import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { fetchWorldBankData, getCountryName } from '../lib/worldbank';

interface IndicatorChartProps {
  countries: string[];
  indicator: string;
  title: string;
  description: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function IndicatorChart({ countries, indicator, title, description }: IndicatorChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const allData: any = {};
        
        // Fetch data for all countries
        for (const country of countries) {
          const countryData = await fetchWorldBankData(country, indicator);
          countryData.forEach((item: any) => {
            if (!allData[item.year]) {
              allData[item.year] = { year: item.year };
            }
            allData[item.year][country] = item.value;
          });
        }

        // Convert to array and sort by year
        const chartData = Object.values(allData)
          .sort((a: any, b: any) => a.year - b.year);

        setData(chartData);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [countries, indicator]);

  const formatValue = (value: number) => {
    if (indicator === 'NY.GDP.MKTP.CD') {
      // Format GDP in trillions/billions
      if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      return `$${value.toFixed(0)}`;
    }
    return value?.toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                stroke="#64748b"
              />
              <YAxis 
                stroke="#64748b"
                tickFormatter={formatValue}
              />
              <Tooltip
                formatter={(value: any) => formatValue(value)}
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
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
