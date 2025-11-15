import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Loader2, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { fetchWorldBankData, getCountryName } from '../lib/worldbank';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

interface EconomicHealthScoreProps {
  countries: string[];
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function EconomicHealthScore({ countries }: EconomicHealthScoreProps) {
  const [healthScores, setHealthScores] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (countries.length === 0) {
        setHealthScores([]);
        setRadarData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const scores: any[] = [];
        const radarMetrics = [
          'GDP Growth',
          'Low Inflation',
          'Employment',
          'Trade Balance',
          'Fiscal Health',
          'Savings Rate'
        ];
        
        const radarDataPoints: any = {};
        radarMetrics.forEach(metric => {
          radarDataPoints[metric] = { metric };
        });

        for (const country of countries) {
          // Fetch all necessary indicators
          const gdpGrowth = await fetchWorldBankData(country, 'NY.GDP.MKTP.KD.ZG', '2015:2023');
          const inflation = await fetchWorldBankData(country, 'FP.CPI.TOTL.ZG', '2015:2023');
          const unemployment = await fetchWorldBankData(country, 'SL.UEM.TOTL.ZS', '2015:2023');
          const exports = await fetchWorldBankData(country, 'NE.EXP.GNFS.ZS', '2015:2023');
          const imports = await fetchWorldBankData(country, 'NE.IMP.GNFS.ZS', '2015:2023');
          const debt = await fetchWorldBankData(country, 'GC.DOD.TOTL.GD.ZS', '2015:2023');
          const savings = await fetchWorldBankData(country, 'NY.GDS.TOTL.ZS', '2015:2023');

          // Get latest values
          const latestGrowth = gdpGrowth.find(d => d.value !== null);
          const latestInflation = inflation.find(d => d.value !== null);
          const latestUnemployment = unemployment.find(d => d.value !== null);
          const latestExports = exports.find(d => d.value !== null);
          const latestImports = imports.find(d => d.value !== null);
          const latestDebt = debt.find(d => d.value !== null);
          const latestSavings = savings.find(d => d.value !== null);

          // Calculate individual scores (0-100 scale)
          const growthScore = latestGrowth 
            ? Math.min(100, Math.max(0, (latestGrowth.value + 5) * 10)) 
            : 50;

          const inflationScore = latestInflation
            ? Math.min(100, Math.max(0, 100 - Math.abs(latestInflation.value - 2) * 10))
            : 50;

          const employmentScore = latestUnemployment
            ? Math.min(100, Math.max(0, 100 - latestUnemployment.value * 5))
            : 50;

          const tradeBalance = (latestExports?.value || 0) - (latestImports?.value || 0);
          const tradeScore = Math.min(100, Math.max(0, 50 + tradeBalance * 2));

          const fiscalScore = latestDebt
            ? Math.min(100, Math.max(0, 100 - latestDebt.value * 0.8))
            : 50;

          const savingsScore = latestSavings
            ? Math.min(100, Math.max(0, latestSavings.value * 3))
            : 50;

          // Overall health score (weighted average)
          const overallScore = (
            growthScore * 0.25 +
            inflationScore * 0.20 +
            employmentScore * 0.20 +
            tradeScore * 0.15 +
            fiscalScore * 0.10 +
            savingsScore * 0.10
          );

          scores.push({
            country: getCountryName(country),
            countryCode: country,
            overallScore: overallScore,
            growthScore,
            inflationScore,
            employmentScore,
            tradeScore,
            fiscalScore,
            savingsScore,
            rawValues: {
              growth: latestGrowth?.value,
              inflation: latestInflation?.value,
              unemployment: latestUnemployment?.value,
              exports: latestExports?.value,
              imports: latestImports?.value,
              debt: latestDebt?.value,
              savings: latestSavings?.value,
            }
          });

          // Add to radar data
          radarDataPoints['GDP Growth'][country] = growthScore;
          radarDataPoints['Low Inflation'][country] = inflationScore;
          radarDataPoints['Employment'][country] = employmentScore;
          radarDataPoints['Trade Balance'][country] = tradeScore;
          radarDataPoints['Fiscal Health'][country] = fiscalScore;
          radarDataPoints['Savings Rate'][country] = savingsScore;
        }

        setHealthScores(scores);
        setRadarData(Object.values(radarDataPoints));
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [countries]);

  const getHealthRating = (score: number): { rating: string; color: string } => {
    if (score >= 80) return { rating: 'Excellent', color: 'text-green-600' };
    if (score >= 70) return { rating: 'Good', color: 'text-blue-600' };
    if (score >= 60) return { rating: 'Fair', color: 'text-yellow-600' };
    if (score >= 50) return { rating: 'Moderate', color: 'text-orange-600' };
    return { rating: 'Needs Attention', color: 'text-red-600' };
  };

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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Economic Health Score is a composite metric based on GDP growth, inflation control, employment, 
          trade balance, fiscal health, and savings rate. Scores are normalized to a 0-100 scale.
        </AlertDescription>
      </Alert>

      {/* Overall Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Economic Health Scores
          </CardTitle>
          <CardDescription>Composite health indicators for selected countries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {healthScores.map((score, index) => {
              const { rating, color } = getHealthRating(score.overallScore);
              return (
                <div key={score.countryCode} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{score.country}</p>
                      <p className={`text-sm ${color}`}>{rating}</p>
                    </div>
                    <p className="text-2xl" style={{ color: COLORS[index % COLORS.length] }}>
                      {score.overallScore.toFixed(1)}
                    </p>
                  </div>
                  <Progress 
                    value={score.overallScore} 
                    className="h-2"
                  />
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs text-slate-600">
                    <div>
                      <p>Growth: {score.growthScore.toFixed(0)}</p>
                      <p className="text-slate-500">({score.rawValues.growth?.toFixed(1)}%)</p>
                    </div>
                    <div>
                      <p>Inflation: {score.inflationScore.toFixed(0)}</p>
                      <p className="text-slate-500">({score.rawValues.inflation?.toFixed(1)}%)</p>
                    </div>
                    <div>
                      <p>Employment: {score.employmentScore.toFixed(0)}</p>
                      <p className="text-slate-500">({score.rawValues.unemployment?.toFixed(1)}%)</p>
                    </div>
                    <div>
                      <p>Trade: {score.tradeScore.toFixed(0)}</p>
                    </div>
                    <div>
                      <p>Fiscal: {score.fiscalScore.toFixed(0)}</p>
                      <p className="text-slate-500">({score.rawValues.debt?.toFixed(1)}%)</p>
                    </div>
                    <div>
                      <p>Savings: {score.savingsScore.toFixed(0)}</p>
                      <p className="text-slate-500">({score.rawValues.savings?.toFixed(1)}%)</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Dimensional Comparison</CardTitle>
          <CardDescription>Radar chart showing strength across different economic dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" stroke="#64748b" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" />
              {countries.map((country, index) => (
                <Radar
                  key={country}
                  name={getCountryName(country)}
                  dataKey={country}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={healthScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="country" stroke="#64748b" />
              <YAxis domain={[0, 100]} stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="overallScore" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
