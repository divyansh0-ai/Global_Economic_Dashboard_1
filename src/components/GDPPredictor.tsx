import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Loader2, TrendingUp, Brain } from 'lucide-react';
import { fetchWorldBankData, getCountryName } from '../lib/worldbank';
import { linearRegression, predictNextYear } from '../lib/regression';
import { Alert, AlertDescription } from './ui/alert';

interface GDPPredictorProps {
  countries: string[];
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function GDPPredictor({ countries }: GDPPredictorProps) {
  const [data, setData] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDataAndPredict = async () => {
      if (countries.length === 0) {
        setData([]);
        setPredictions({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const allData: any = {};
        const countryPredictions: any = {};
        
        // Fetch GDP data for all countries
        for (const country of countries) {
          const gdpData = await fetchWorldBankData(country, 'NY.GDP.MKTP.CD');
          
          // Filter out null values and prepare for regression
          const validData = gdpData.filter((item: any) => item.value !== null);
          
          if (validData.length > 0) {
            // Prepare data for linear regression
            const years = validData.map((item: any) => item.year);
            const values = validData.map((item: any) => item.value);
            
            // Perform linear regression
            const regression = linearRegression(years, values);
            const lastYear = Math.max(...years);
            const nextYearPrediction = predictNextYear(regression, lastYear + 1);
            
            countryPredictions[country] = {
              nextYear: lastYear + 1,
              prediction: nextYearPrediction,
              r2: regression.r2,
              slope: regression.slope
            };

            // Add historical data to chart
            validData.forEach((item: any) => {
              if (!allData[item.year]) {
                allData[item.year] = { year: item.year };
              }
              allData[item.year][country] = item.value;
            });

            // Add prediction to chart
            const nextYear = lastYear + 1;
            if (!allData[nextYear]) {
              allData[nextYear] = { year: nextYear };
            }
            allData[nextYear][`${country}_predicted`] = nextYearPrediction;
          }
        }

        // Convert to array and sort by year
        const chartData = Object.values(allData)
          .sort((a: any, b: any) => a.year - b.year);

        setData(chartData);
        setPredictions(countryPredictions);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDataAndPredict();
  }, [countries]);

  const formatValue = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    return `$${value.toFixed(0)}`;
  };

  const formatGrowth = (slope: number) => {
    if (slope >= 1e9) return `$${(slope / 1e9).toFixed(2)}B/year`;
    if (slope >= 1e6) return `$${(slope / 1e6).toFixed(2)}M/year`;
    return `$${slope.toFixed(0)}/year`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          GDP Prediction with Linear Regression
        </CardTitle>
        <CardDescription>
          Predicting next year's GDP based on historical trends using simple linear regression
        </CardDescription>
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
            {/* Predictions Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map((country, index) => {
                const pred = predictions[country];
                if (!pred) return null;
                
                const growthDirection = pred.slope > 0 ? 'up' : 'down';
                const confidenceLevel = pred.r2 > 0.9 ? 'High' : pred.r2 > 0.7 ? 'Medium' : 'Low';
                
                return (
                  <div 
                    key={country}
                    className="p-4 rounded-lg border-2"
                    style={{ borderColor: COLORS[index % COLORS.length] }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700">{getCountryName(country)}</span>
                      <TrendingUp 
                        className={`w-4 h-4 ${pred.slope > 0 ? 'text-green-600' : 'text-red-600'}`}
                        style={{ transform: pred.slope < 0 ? 'rotate(180deg)' : 'none' }}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl" style={{ color: COLORS[index % COLORS.length] }}>
                        {formatValue(pred.prediction)}
                      </p>
                      <p className="text-xs text-slate-500">Predicted GDP for {pred.nextYear}</p>
                      <div className="pt-2 mt-2 border-t space-y-1 text-xs text-slate-600">
                        <p>Growth: {formatGrowth(pred.slope)}</p>
                        <p>R² Score: {pred.r2.toFixed(3)} ({confidenceLevel})</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alert */}
            <Alert>
              <AlertDescription>
                The predictions use simple linear regression on historical GDP data. 
                R² scores indicate model fit (closer to 1.0 means better fit). 
                These are simplified projections and should not be used for actual economic forecasting.
              </AlertDescription>
            </Alert>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={450}>
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
                
                {/* Historical data lines */}
                {countries.map((country, index) => (
                  <Line
                    key={country}
                    type="monotone"
                    dataKey={country}
                    name={`${getCountryName(country)} (Historical)`}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
                
                {/* Prediction lines */}
                {countries.map((country, index) => (
                  <Line
                    key={`${country}_predicted`}
                    type="monotone"
                    dataKey={`${country}_predicted`}
                    name={`${getCountryName(country)} (Predicted)`}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 5, fill: COLORS[index % COLORS.length] }}
                  />
                ))}
                
                {/* Reference line for current year */}
                {predictions[countries[0]] && (
                  <ReferenceLine 
                    x={predictions[countries[0]].nextYear - 1} 
                    stroke="#94a3b8" 
                    strokeDasharray="3 3"
                    label="Now"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
