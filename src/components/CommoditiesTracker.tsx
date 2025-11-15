import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Fuel, Coins, Zap } from 'lucide-react';
import { fetchCommodityPrice, CommodityPrice } from '../lib/apis/alphavantage';
import { Badge } from './ui/badge';

const COMMODITIES = [
  { id: 'CRUDE_OIL', name: 'Crude Oil', icon: Fuel, color: '#1f2937' },
  { id: 'GOLD', name: 'Gold', icon: Coins, color: '#eab308' },
  { id: 'SILVER', name: 'Silver', icon: Coins, color: '#94a3b8' },
  { id: 'NATURAL_GAS', name: 'Natural Gas', icon: Zap, color: '#3b82f6' },
  { id: 'COPPER', name: 'Copper', icon: Coins, color: '#ea580c' },
];

export function CommoditiesTracker() {
  const [commodities, setCommodities] = useState<{ [key: string]: CommodityPrice }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCommodities = async () => {
      setLoading(true);
      setError(null);

      try {
        const commodityPromises = COMMODITIES.map(c => fetchCommodityPrice(c.id));
        const results = await Promise.all(commodityPromises);
        
        const commoditiesMap: { [key: string]: CommodityPrice } = {};
        results.forEach(result => {
          commoditiesMap[result.commodity] = result;
        });
        
        setCommodities(commoditiesMap);
      } catch (err) {
        setError('Failed to load commodity data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCommodities();
  }, []);

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

  const chartData = COMMODITIES.map(c => ({
    name: c.name,
    price: commodities[c.id]?.price || 0,
    color: c.color,
  }));

  return (
    <div className="space-y-6">
      {/* Commodity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {COMMODITIES.map((commodity) => {
          const data = commodities[commodity.id];
          if (!data) return null;

          const Icon = commodity.icon;

          return (
            <Card key={commodity.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">{commodity.name}</p>
                    <Icon className="w-4 h-4" style={{ color: commodity.color }} />
                  </div>
                  <p className="text-2xl">${data.price.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">{data.unit}</p>
                  <Badge variant="outline" className="text-xs">
                    Live
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Price Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Commodity Prices Comparison</CardTitle>
          <CardDescription>Current market prices (normalized for comparison)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: any, name, props) => {
                  const commodity = COMMODITIES.find(c => c.name === props.payload.name);
                  const unit = commodities[commodity?.id || '']?.unit || 'USD';
                  return [`$${value.toFixed(2)} (${unit})`, 'Price'];
                }}
              />
              <Bar
                dataKey="price"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Commodity Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm text-slate-600">Commodity</th>
                  <th className="text-right p-3 text-sm text-slate-600">Price</th>
                  <th className="text-right p-3 text-sm text-slate-600">Unit</th>
                  <th className="text-right p-3 text-sm text-slate-600">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {COMMODITIES.map((commodity) => {
                  const data = commodities[commodity.id];
                  if (!data) return null;

                  return (
                    <tr key={commodity.id} className="border-b hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: commodity.color }}
                          />
                          <span>{commodity.name}</span>
                        </div>
                      </td>
                      <td className="text-right p-3">${data.price.toFixed(2)}</td>
                      <td className="text-right p-3 text-sm text-slate-600">{data.unit}</td>
                      <td className="text-right p-3 text-sm text-slate-500">
                        {new Date(data.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
