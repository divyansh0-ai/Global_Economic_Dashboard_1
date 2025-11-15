import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { fetchWorldBankData } from '../lib/worldbank';
import { fetchExchangeRates } from '../lib/apis/exchangerates';
import { fetchTopCryptos } from '../lib/apis/crypto';

interface APIStatus {
  name: string;
  status: 'working' | 'mock' | 'error' | 'checking';
  message: string;
  requiresKey: boolean;
}

export function APIStatus() {
  const [apis, setApis] = useState<APIStatus[]>([
    { name: 'World Bank API', status: 'checking', message: 'Testing...', requiresKey: false },
    { name: 'Exchange Rates API', status: 'checking', message: 'Testing...', requiresKey: false },
    { name: 'CoinGecko (Crypto)', status: 'checking', message: 'Testing...', requiresKey: false },
    { name: 'FRED API', status: 'mock', message: 'Requires API key', requiresKey: true },
    { name: 'Alpha Vantage', status: 'mock', message: 'Requires API key', requiresKey: true },
    { name: 'News API', status: 'mock', message: 'Requires API key', requiresKey: true },
    { name: 'OECD API', status: 'mock', message: 'Using mock data', requiresKey: false },
  ]);

  useEffect(() => {
    const testAPIs = async () => {
      const results = [...apis];

      // Test World Bank API
      try {
        await fetchWorldBankData('USA', 'NY.GDP.MKTP.CD', '2020:2023');
        results[0] = {
          ...results[0],
          status: 'working',
          message: 'Connected successfully - Real data',
        };
      } catch (error) {
        results[0] = {
          ...results[0],
          status: 'error',
          message: 'Connection failed',
        };
      }

      // Test Exchange Rates API
      try {
        const rates = await fetchExchangeRates('USD');
        if (rates && rates.rates) {
          results[1] = {
            ...results[1],
            status: 'working',
            message: 'Connected successfully - Real data',
          };
        } else {
          results[1] = {
            ...results[1],
            status: 'mock',
            message: 'Using fallback data',
          };
        }
      } catch (error) {
        results[1] = {
          ...results[1],
          status: 'mock',
          message: 'Using mock data',
        };
      }

      // Test CoinGecko API
      try {
        const cryptos = await fetchTopCryptos(1);
        if (cryptos && cryptos.length > 0 && cryptos[0].currentPrice > 0) {
          results[2] = {
            ...results[2],
            status: 'working',
            message: 'Connected successfully - Real data',
          };
        } else {
          results[2] = {
            ...results[2],
            status: 'mock',
            message: 'Using fallback data',
          };
        }
      } catch (error) {
        results[2] = {
          ...results[2],
          status: 'mock',
          message: 'Using mock data',
        };
      }

      setApis(results);
    };

    testAPIs();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'mock':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'checking':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>;
      case 'mock':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Mock</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      case 'checking':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Testing</Badge>;
      default:
        return null;
    }
  };

  const workingCount = apis.filter(api => api.status === 'working').length;
  const mockCount = apis.filter(api => api.status === 'mock').length;

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Connection Status</CardTitle>
            <CardDescription>Real-time status of data source connections</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 border-green-200">
              {workingCount} Live
            </Badge>
            <Badge variant="outline" className="bg-amber-50 border-amber-200">
              {mockCount} Mock
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {apis.map((api, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border-2 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(api.status)}
                <div>
                  <p className="font-medium">{api.name}</p>
                  <p className="text-sm text-slate-500">{api.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {api.requiresKey && (
                  <Badge variant="outline" className="text-xs">
                    API Key Required
                  </Badge>
                )}
                {getStatusBadge(api.status)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> APIs marked as "Mock" are using simulated data for demonstration.
            To enable real data, add your API keys to the respective files in <code>/lib/apis/</code>.
            See <code>/lib/apis/README.md</code> for detailed setup instructions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
