import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Users, Activity, Package, Calendar, Info } from 'lucide-react';
import { fetchWorldBankData, getCountryName, INDICATORS } from '../lib/worldbank';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface MultiIndicatorDashboardProps {
  countries: string[];
}

export function MultiIndicatorDashboard({ countries }: MultiIndicatorDashboardProps) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      if (countries.length === 0) {
        setData({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const allCountryData: any = {};

        for (const country of countries) {
          const countryData: any = { country };

          // Fetch latest data for each indicator (last 5 years to ensure we get recent data)
          const currentYear = new Date().getFullYear();
          const indicators = [
            'NY.GDP.MKTP.CD',
            'NY.GDP.PCAP.CD',
            'NY.GDP.MKTP.KD.ZG',
            'FP.CPI.TOTL.ZG',
            'SL.UEM.TOTL.ZS',
            'SP.POP.TOTL',
            'NE.EXP.GNFS.ZS',
            'NE.IMP.GNFS.ZS',
            'GC.DOD.TOTL.GD.ZS',
          ];

          for (const indicator of indicators) {
            try {
              const indicatorData = await fetchWorldBankData(country, indicator, `${currentYear - 5}:${currentYear}`);
              // Get the most recent non-null value
              const latestData = indicatorData.reverse().find(d => d.value !== null && d.value !== undefined);
              
              if (latestData) {
                countryData[indicator] = {
                  value: latestData.value,
                  year: latestData.year,
                };
              }
            } catch (err) {
              console.warn(`Failed to fetch ${indicator} for ${country}:`, err);
            }
          }

          allCountryData[country] = countryData;
        }

        setData(allCountryData);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [countries]);

  const formatValue = (value: number, type: string) => {
    if (!value && value !== 0) return 'N/A';
    
    if (type === 'currency') {
      if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
      return `$${value.toFixed(0)}`;
    }
    
    if (type === 'population') {
      if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
      return value.toFixed(0);
    }
    
    if (type === 'percentage') {
      return `${value.toFixed(2)}%`;
    }
    
    return value.toFixed(2);
  };

  const getIndicatorIcon = (indicator: string) => {
    switch (indicator) {
      case 'NY.GDP.MKTP.CD':
      case 'NY.GDP.PCAP.CD':
        return <DollarSign className="w-4 h-4" />;
      case 'SP.POP.TOTL':
        return <Users className="w-4 h-4" />;
      case 'NE.EXP.GNFS.ZS':
      case 'NE.IMP.GNFS.ZS':
        return <Package className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
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
      {countries.map((country) => {
        const countryData = data[country];
        if (!countryData) return null;

        return (
          <Card key={country}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{getCountryName(country)}</span>
                <Badge variant="outline">{country}</Badge>
              </CardTitle>
              <CardDescription>Latest Economic Indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* GDP */}
                {countryData['NY.GDP.MKTP.CD'] && (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-slate-600">GDP</span>
                    </div>
                    <p className="text-2xl text-blue-900">
                      {formatValue(countryData['NY.GDP.MKTP.CD'].value, 'currency')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {countryData['NY.GDP.MKTP.CD'].year}
                    </p>
                  </div>
                )}

                {/* GDP Per Capita */}
                {countryData['NY.GDP.PCAP.CD'] && (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-green-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-600">GDP Per Capita</span>
                    </div>
                    <p className="text-2xl text-green-900">
                      {formatValue(countryData['NY.GDP.PCAP.CD'].value, 'currency')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {countryData['NY.GDP.PCAP.CD'].year}
                    </p>
                  </div>
                )}

                {/* GDP Growth */}
                {countryData['NY.GDP.MKTP.KD.ZG'] && (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      {countryData['NY.GDP.MKTP.KD.ZG'].value >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-purple-600" />
                      )}
                      <span className="text-sm text-slate-600">GDP Growth</span>
                    </div>
                    <p className="text-2xl text-purple-900">
                      {formatValue(countryData['NY.GDP.MKTP.KD.ZG'].value, 'percentage')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {countryData['NY.GDP.MKTP.KD.ZG'].year}
                    </p>
                  </div>
                )}

                {/* Inflation */}
                {countryData['FP.CPI.TOTL.ZG'] && (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-amber-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-slate-600">Inflation Rate</span>
                    </div>
                    <p className="text-2xl text-amber-900">
                      {formatValue(countryData['FP.CPI.TOTL.ZG'].value, 'percentage')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {countryData['FP.CPI.TOTL.ZG'].year}
                    </p>
                  </div>
                )}

                {/* Unemployment */}
                {countryData['SL.UEM.TOTL.ZS'] && (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-red-50 to-red-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-slate-600">Unemployment</span>
                    </div>
                    <p className="text-2xl text-red-900">
                      {formatValue(countryData['SL.UEM.TOTL.ZS'].value, 'percentage')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {countryData['SL.UEM.TOTL.ZS'].year}
                    </p>
                  </div>
                )}

                {/* Population */}
                {countryData['SP.POP.TOTL'] && (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-indigo-50 to-indigo-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-slate-600">Population</span>
                    </div>
                    <p className="text-2xl text-indigo-900">
                      {formatValue(countryData['SP.POP.TOTL'].value, 'population')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {countryData['SP.POP.TOTL'].year}
                    </p>
                  </div>
                )}

                {/* Exports */}
                {countryData['NE.EXP.GNFS.ZS'] && (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-teal-50 to-teal-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-teal-600" />
                      <span className="text-sm text-slate-600">Exports (% GDP)</span>
                    </div>
                    <p className="text-2xl text-teal-900">
                      {formatValue(countryData['NE.EXP.GNFS.ZS'].value, 'percentage')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {countryData['NE.EXP.GNFS.ZS'].year}
                    </p>
                  </div>
                )}

                {/* Imports */}
                {countryData['NE.IMP.GNFS.ZS'] && (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-cyan-50 to-cyan-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm text-slate-600">Imports (% GDP)</span>
                    </div>
                    <p className="text-2xl text-cyan-900">
                      {formatValue(countryData['NE.IMP.GNFS.ZS'].value, 'percentage')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {countryData['NE.IMP.GNFS.ZS'].year}
                    </p>
                  </div>
                )}

                {/* Government Debt */}
                {countryData['GC.DOD.TOTL.GD.ZS'] && (
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-orange-50 to-orange-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-slate-600">Gov. Debt (% GDP)</span>
                    </div>
                    <p className="text-2xl text-orange-900">
                      {formatValue(countryData['GC.DOD.TOTL.GD.ZS'].value, 'percentage')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {countryData['GC.DOD.TOTL.GD.ZS'].year}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>Data last updated: {lastUpdated}</AlertDescription>
      </Alert>
    </div>
  );
}