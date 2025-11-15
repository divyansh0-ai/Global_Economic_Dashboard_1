import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, Bitcoin, DollarSign, BarChart3, AlertCircle } from 'lucide-react';
import { fetchTopCryptos, fetchCryptoPriceHistory, fetchGlobalCryptoStats } from '../lib/apis/crypto';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

export function CryptoMarkets() {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const loadCryptoData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [cryptoData, stats] = await Promise.all([
          fetchTopCryptos(10),
          fetchGlobalCryptoStats(),
        ]);

        setCryptos(cryptoData);
        setGlobalStats(stats);
        
        if (cryptoData.length > 0) {
          setSelectedCrypto(cryptoData[0]);
        }
        
        // Check if we're using mock data (prices are too predictable)
        if (cryptoData.length > 0 && cryptoData[0].currentPrice % 1000 === 0) {
          setUsingMockData(true);
        }
      } catch (err) {
        setError('Failed to load crypto data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCryptoData();
  }, []);

  useEffect(() => {
    const loadPriceHistory = async () => {
      if (selectedCrypto) {
        try {
          const history = await fetchCryptoPriceHistory(selectedCrypto.id, 30);
          const chartData = history.map(h => ({
            date: new Date(h.timestamp).toLocaleDateString(),
            price: h.price,
            volume: h.volume,
          }));
          setPriceHistory(chartData);
        } catch (err) {
          console.error('Error loading price history:', err);
          // Don't show error to user, just use whatever data we have
        }
      }
    };

    loadPriceHistory();
  }, [selectedCrypto]);

  if (loading) {
    return (
      <Card>
        <CardContent className="h-96 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="h-96 flex items-center justify-center">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercent = (num) => {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {usingMockData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Using demo data for demonstration. CoinGecko API may be rate-limited. 
            For production use, set up the Flask backend or wait a few minutes and refresh.
          </AlertDescription>
        </Alert>
      )}

      {/* Global Market Stats */}
      {globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Total Market Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-700">
                {formatNumber(globalStats.totalMarketCap)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatPercent(globalStats.marketCapChangePercentage24h)} 24h
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                24h Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700">
                {formatNumber(globalStats.total24hVolume)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {globalStats.activeCryptocurrencies} cryptocurrencies
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader>
              <CardTitle className="text-orange-900 flex items-center gap-2">
                <Bitcoin className="w-5 h-5" />
                BTC Dominance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-700">
                {globalStats.btcDominance.toFixed(2)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Bitcoin market share
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Crypto Dashboard */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bitcoin className="w-6 h-6" />
            Cryptocurrency Markets
          </CardTitle>
          <CardDescription>Real-time cryptocurrency prices and market data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">Top Cryptocurrencies</TabsTrigger>
              <TabsTrigger value="chart">Price Chart</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="space-y-3">
                {cryptos.map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      selectedCrypto?.id === crypto.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{crypto.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {crypto.symbol}
                            </Badge>
                          </div>
                          <p className="text-2xl font-bold mt-1">
                            {formatNumber(crypto.currentPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 ${
                          crypto.priceChangePercentage24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {crypto.priceChangePercentage24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-semibold">
                            {formatPercent(crypto.priceChangePercentage24h)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Vol: {formatNumber(crypto.volume24h)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          MCap: {formatNumber(crypto.marketCap)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chart">
              {selectedCrypto && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-12 h-12" />
                    <div>
                      <h3 className="text-xl font-bold">{selectedCrypto.name}</h3>
                      <p className="text-2xl font-bold text-purple-700">
                        {formatNumber(selectedCrypto.currentPrice)}
                      </p>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={priceHistory}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => formatNumber(value)}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">24h High</p>
                      <p className="text-lg font-bold">{formatNumber(selectedCrypto.high24h)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">24h Low</p>
                      <p className="text-lg font-bold">{formatNumber(selectedCrypto.low24h)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="text-lg font-bold">{formatNumber(selectedCrypto.marketCap)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Volume 24h</p>
                      <p className="text-lg font-bold">{formatNumber(selectedCrypto.volume24h)}</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
