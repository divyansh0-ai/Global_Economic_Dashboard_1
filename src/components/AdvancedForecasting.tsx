import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Loader2, Brain, TrendingUp } from 'lucide-react';
import { fetchWorldBankData, getCountryName } from '../lib/worldbank';
import { linearRegression, polynomialRegression, exponentialRegression, predictNextYears } from '../lib/regression';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface AdvancedForecastingProps {
  countries: string[];
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

type ModelType = 'linear' | 'polynomial' | 'exponential';

export function AdvancedForecasting({ countries }: AdvancedForecastingProps) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0] || '');
  const [modelType, setModelType] = useState<ModelType>('linear');
  const [forecastYears, setForecastYears] = useState(5);
  const [data, setData] = useState<any[]>([]);
  const [modelMetrics, setModelMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countries.length > 0 && !countries.includes(selectedCountry)) {
      setSelectedCountry(countries[0]);
    }
  }, [countries]);

  useEffect(() => {
    const loadDataAndForecast = async () => {
      if (!selectedCountry) {
        setData([]);
        setModelMetrics(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch GDP data
        const gdpData = await fetchWorldBankData(selectedCountry, 'NY.GDP.MKTP.CD');
        const validData = gdpData.filter(item => item.value !== null).sort((a, b) => a.year - b.year);

        if (validData.length === 0) {
          setError('No data available for this country');
          setLoading(false);
          return;
        }

        const years = validData.map(item => item.year);
        const values = validData.map(item => item.value);
        const lastYear = Math.max(...years);

        // Perform regression based on selected model
        let regression: any;
        let predictions: number[] = [];

        if (modelType === 'linear') {
          regression = linearRegression(years, values);
          predictions = predictNextYears(regression, lastYear + 1, forecastYears, 'linear');
        } else if (modelType === 'polynomial') {
          regression = polynomialRegression(years, values, 2);
          predictions = predictNextYears(regression, lastYear + 1, forecastYears, 'polynomial');
        } else {
          regression = exponentialRegression(years, values);
          predictions = predictNextYears(regression, lastYear + 1, forecastYears, 'exponential');
        }

        // Prepare chart data
        const chartData = validData.map(item => ({
          year: item.year,
          actual: item.value,
          predicted: null,
        }));

        // Add predictions
        predictions.forEach((value, index) => {
          chartData.push({
            year: lastYear + 1 + index,
            actual: null,
            predicted: value,
          });
        });

        setData(chartData);
        setModelMetrics({
          r2: regression.r2,
          mae: regression.mae,
          rmse: regression.rmse,
          lastYear,
          modelType,
        });
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDataAndForecast();
  }, [selectedCountry, modelType, forecastYears]);

  const formatValue = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    return `$${value.toFixed(0)}`;
  };

  const getModelColor = (type: ModelType) => {
    switch (type) {
      case 'linear': return '#3b82f6';
      case 'polynomial': return '#10b981';
      case 'exponential': return '#8b5cf6';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Advanced GDP Forecasting
          </CardTitle>
          <CardDescription>
            Compare different regression models for GDP prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-600 mb-2 block">Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>
                        {getCountryName(country)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-2 block">Model Type</label>
                <Select value={modelType} onValueChange={(v) => setModelType(v as ModelType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear Regression</SelectItem>
                    <SelectItem value="polynomial">Polynomial Regression</SelectItem>
                    <SelectItem value="exponential">Exponential Regression</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-2 block">Forecast Years</label>
                <Select value={forecastYears.toString()} onValueChange={(v) => setForecastYears(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
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
            ) : (
              <>
                {/* Model Metrics */}
                {modelMetrics && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border-2" style={{ borderColor: getModelColor(modelType) }}>
                      <p className="text-sm text-slate-600">R² Score</p>
                      <p className="text-2xl" style={{ color: getModelColor(modelType) }}>
                        {modelMetrics.r2.toFixed(4)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {modelMetrics.r2 > 0.9 ? 'Excellent fit' : modelMetrics.r2 > 0.7 ? 'Good fit' : 'Fair fit'}
                      </p>
                    </div>
                    {modelMetrics.mae && (
                      <div className="p-4 rounded-lg border-2" style={{ borderColor: getModelColor(modelType) }}>
                        <p className="text-sm text-slate-600">Mean Absolute Error</p>
                        <p className="text-2xl" style={{ color: getModelColor(modelType) }}>
                          {formatValue(modelMetrics.mae)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Average prediction error</p>
                      </div>
                    )}
                    {modelMetrics.rmse && (
                      <div className="p-4 rounded-lg border-2" style={{ borderColor: getModelColor(modelType) }}>
                        <p className="text-sm text-slate-600">Root Mean Square Error</p>
                        <p className="text-2xl" style={{ color: getModelColor(modelType) }}>
                          {formatValue(modelMetrics.rmse)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Error standard deviation</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Chart */}
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={formatValue} />
                    <Tooltip
                      formatter={(value: any) => formatValue(value)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="Historical GDP"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      name={`Predicted GDP (${modelType})`}
                      stroke={getModelColor(modelType)}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: getModelColor(modelType) }}
                    />
                    {modelMetrics && (
                      <ReferenceLine
                        x={modelMetrics.lastYear}
                        stroke="#94a3b8"
                        strokeDasharray="3 3"
                        label="Now"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>

                {/* Model Information */}
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{modelType.charAt(0).toUpperCase() + modelType.slice(1)} Regression</Badge>
                      <span className="text-sm text-slate-600">
                        Forecasting {forecastYears} years ahead
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">
                      {modelType === 'linear' && 
                        'Linear regression assumes a constant rate of change over time. Best for steady, linear trends.'}
                      {modelType === 'polynomial' && 
                        'Polynomial regression (degree 2) can capture curved trends and turning points in the data.'}
                      {modelType === 'exponential' && 
                        'Exponential regression models compound growth or decay. Best for rapidly growing economies.'}
                    </p>
                    {data.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-slate-600 mb-2">Predictions Summary:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {data.filter(d => d.predicted !== null).map(d => (
                            <div key={d.year}>
                              <span className="text-slate-500">{d.year}:</span>{' '}
                              <span className="font-medium">{formatValue(d.predicted)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
