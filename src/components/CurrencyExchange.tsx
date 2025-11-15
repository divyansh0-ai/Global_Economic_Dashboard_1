import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { fetchExchangeRates, convertCurrency, getHistoricalRates, MAJOR_CURRENCIES, ExchangeRateResponse, CurrencyConversion } from '../lib/apis/exchangerates';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

export function CurrencyExchange() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');
  const [rates, setRates] = useState<ExchangeRateResponse | null>(null);
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [historicalData, setHistoricalData] = useState<Array<{ date: string; rate: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRates = async () => {
      setLoading(true);
      setError(null);

      try {
        const ratesData = await fetchExchangeRates(baseCurrency);
        setRates(ratesData);
      } catch (err) {
        setError('Failed to load exchange rates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRates();
  }, [baseCurrency]);

  useEffect(() => {
    const performConversion = async () => {
      try {
        const numAmount = parseFloat(amount) || 0;
        const result = await convertCurrency(baseCurrency, targetCurrency, numAmount);
        setConversion(result);
      } catch (err) {
        console.error('Error converting currency:', err);
      }
    };

    performConversion();
  }, [baseCurrency, targetCurrency, amount]);

  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        const data = await getHistoricalRates(baseCurrency, targetCurrency, 30);
        setHistoricalData(data);
      } catch (err) {
        console.error('Error loading historical data:', err);
      }
    };

    loadHistoricalData();
  }, [baseCurrency, targetCurrency]);

  const getCurrencySymbol = (code: string): string => {
    const currency = MAJOR_CURRENCIES.find(c => c.code === code);
    return currency?.symbol || code;
  };

  const swapCurrencies = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
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
      {/* Currency Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Currency Converter
          </CardTitle>
          <CardDescription>Convert between major world currencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label>From</Label>
                <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MAJOR_CURRENCIES.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={swapCurrencies}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-2">
                <Label>To</Label>
                <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MAJOR_CURRENCIES.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {conversion && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-2xl text-blue-900">
                      {getCurrencySymbol(targetCurrency)}{conversion.result.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {conversion && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  1 {baseCurrency} = {conversion.rate.toFixed(6)} {targetCurrency}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historical Exchange Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            30-Day Exchange Rate History
          </CardTitle>
          <CardDescription>
            {baseCurrency}/{targetCurrency} trend over the past month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#64748b" domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any) => [value.toFixed(6), 'Rate']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Live Exchange Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Live Exchange Rates</CardTitle>
          <CardDescription>Current rates from {baseCurrency}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rates && Object.entries(rates.rates)
              .filter(([currency]) => MAJOR_CURRENCIES.some(c => c.code === currency))
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([currency, rate]) => {
                const currencyInfo = MAJOR_CURRENCIES.find(c => c.code === currency);
                return (
                  <div key={currency} className="p-3 rounded-lg border bg-gradient-to-br from-slate-50 to-slate-100">
                    <p className="text-sm text-slate-600">{currency}</p>
                    <p className="text-lg">{rate.toFixed(4)}</p>
                    {currencyInfo && (
                      <p className="text-xs text-slate-500">{currencyInfo.name}</p>
                    )}
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
