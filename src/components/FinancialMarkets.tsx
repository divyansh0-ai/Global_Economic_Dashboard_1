import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { fetchStockQuote, fetchTimeSeries, MARKET_INDICES, StockQuote, TimeSeriesData } from '../lib/apis/alphavantage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

export function FinancialMarkets() {
  const [quotes, setQuotes] = useState<{ [symbol: string]: StockQuote }>({});
  const [selectedIndex, setSelectedIndex] = useState('SPY');
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch quotes for major indices
        const symbols = Object.values(MARKET_INDICES);
        const quotePromises = symbols.map(symbol => fetchStockQuote(symbol));
        const quoteResults = await Promise.all(quotePromises);
        
        const quotesMap: { [symbol: string]: StockQuote } = {};
        quoteResults.forEach(quote => {
          quotesMap[quote.symbol] = quote;
        });
        
        setQuotes(quotesMap);
      } catch (err) {
        setError('Failed to load market data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, []);

  useEffect(() => {
    const loadTimeSeries = async () => {
      try {
        const data = await fetchTimeSeries(selectedIndex, 'daily');
        setTimeSeries(data);
      } catch (err) {
        console.error('Error loading time series:', err);
      }
    };

    loadTimeSeries();
  }, [selectedIndex]);

  const getIndexName = (symbol: string): string => {
    const names: { [key: string]: string } = {
      'SPY': 'S&P 500',
      'QQQ': 'NASDAQ',
      'DIA': 'Dow Jones',
      'IWM': 'Russell 2000',
      'VXX': 'VIX',
    };
    return names[symbol] || symbol;
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
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.values(MARKET_INDICES).map((symbol) => {
          const quote = quotes[symbol];
          if (!quote) return null;

          const isPositive = quote.change >= 0;

          return (
            <Card 
              key={symbol}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedIndex === symbol ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedIndex(symbol)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">{getIndexName(symbol)}</p>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-2xl">${quote.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={isPositive ? 'default' : 'destructive'}>
                      {isPositive ? '+' : ''}{quote.change.toFixed(2)}
                    </Badge>
                    <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {getIndexName(selectedIndex)} - 1 Year Performance
          </CardTitle>
          <CardDescription>Daily price movements over the past year</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="area" className="space-y-4">
            <TabsList>
              <TabsTrigger value="area">Area Chart</TabsTrigger>
              <TabsTrigger value="candlestick">Price Range</TabsTrigger>
            </TabsList>

            <TabsContent value="area">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={timeSeries}>
                  <defs>
                    <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorClose)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="candlestick">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                  />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="high" stroke="#10b981" name="High" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="low" stroke="#ef4444" name="Low" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="close" stroke="#3b82f6" name="Close" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
