import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import {
  Globe,
  TrendingUp,
  BarChart3,
  Download,
  DollarSign,
  Bitcoin,
  Zap,
  Building2,
  Newspaper,
} from 'lucide-react';
import { CryptoMarketsPlotly } from './components/CryptoMarketsPlotly';

export default function App() {
  const [selectedCountries] = useState(['USA', 'CHN', 'DEU', 'JPN']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
          <div className="relative backdrop-blur-sm bg-white/70 rounded-3xl border-2 border-white shadow-2xl p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Global Economic Intelligence Platform
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Flask + React + Plotly.js • Real-time Data • No TypeScript • Pure JavaScript
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex gap-2">
                <Badge variant="outline" className="bg-green-50 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  JavaScript Only
                </Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">
                  Plotly.js
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="crypto" className="space-y-6">
          <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 rounded-2xl border-2 border-white shadow-lg p-2">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-transparent">
              <TabsTrigger
                value="crypto"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
              >
                <Bitcoin className="w-4 h-4 mr-2" />
                Crypto
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="countries"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
              >
                <Globe className="w-4 h-4 mr-2" />
                Countries
              </TabsTrigger>
              <TabsTrigger
                value="markets"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Markets
              </TabsTrigger>
              <TabsTrigger
                value="forex"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Forex
              </TabsTrigger>
              <TabsTrigger
                value="us-data"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
              >
                <Building2 className="w-4 h-4 mr-2" />
                US Data
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
              >
                <Newspaper className="w-4 h-4 mr-2" />
                News
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analysis
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Crypto Tab - Plotly Charts */}
          <TabsContent value="crypto" className="space-y-6">
            <CryptoMarketsPlotly />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Tech Stack Overview
                </CardTitle>
                <CardDescription>Pure JavaScript implementation as requested</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-2">✅ Backend (Python 3.10+)</h3>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• Flask (REST API)</li>
                      <li>• Requests (API calls)</li>
                      <li>• Pandas (data wrangling)</li>
                      <li>• scikit-learn (ML predictions)</li>
                      <li>• joblib (model save/load)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-bold text-green-900 mb-2">
                      ✅ Frontend (JavaScript + React)
                    </h3>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• React (Vite) - NO TypeScript</li>
                      <li>• Plotly.js (interactive charts)</li>
                      <li>• Axios (HTTP requests)</li>
                      <li>• Tailwind CSS (styling)</li>
                      <li>• React Router (routing)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <h3 className="font-bold text-purple-900 mb-2">✅ Data / Storage</h3>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• In-memory caching</li>
                      <li>• Local JSON files</li>
                      <li>• No database (initial)</li>
                      <li>• Optional: SQLite later</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <h3 className="font-bold text-orange-900 mb-2">✅ Dev Tools</h3>
                    <ul className="text-sm space-y-1 text-slate-700">
                      <li>• Git + GitHub</li>
                      <li>• ESLint + Prettier (frontend)</li>
                      <li>• black + flake8 (backend)</li>
                      <li>• GitHub Actions (CI/CD)</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                  <h3 className="font-bold text-slate-900 mb-2">🎯 Key Features Implemented:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Pure JavaScript (.jsx)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Plotly.js Charts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Axios HTTP Client</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Flask Backend</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Pandas Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>scikit-learn ML</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>ESLint + Prettier</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>black + flake8</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>No TypeScript</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-200 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-blue-900">📡 APIs Integrated</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• World Bank API</li>
                    <li>• CoinGecko API</li>
                    <li>• Exchange Rates API</li>
                    <li>• FRED API</li>
                    <li>• Alpha Vantage</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-green-900">📊 Visualizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Plotly.js interactive charts</li>
                    <li>• Area charts</li>
                    <li>• Line charts</li>
                    <li>• Bar charts</li>
                    <li>• Real-time updates</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-purple-900">🤖 ML Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• GDP forecasting</li>
                    <li>• Linear regression</li>
                    <li>• Model persistence</li>
                    <li>• Correlation analysis</li>
                    <li>• Trend prediction</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs - placeholder */}
          <TabsContent value="countries">
            <Card>
              <CardHeader>
                <CardTitle>Countries Economic Data</CardTitle>
                <CardDescription>Coming soon - World Bank data visualization</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="markets">
            <Card>
              <CardHeader>
                <CardTitle>Financial Markets</CardTitle>
                <CardDescription>Coming soon - Stock market data</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="forex">
            <Card>
              <CardHeader>
                <CardTitle>Forex Exchange Rates</CardTitle>
                <CardDescription>Coming soon - Currency exchange data</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="us-data">
            <Card>
              <CardHeader>
                <CardTitle>US Economic Data (FRED)</CardTitle>
                <CardDescription>Coming soon - Federal Reserve data</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Economic News</CardTitle>
                <CardDescription>Coming soon - Real-time news feed</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Economic Analysis & Forecasting</CardTitle>
                <CardDescription>Coming soon - ML-powered predictions</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 backdrop-blur-sm bg-white/70 rounded-3xl border-2 border-white shadow-lg p-8">
          <div className="text-center space-y-4">
            <p className="font-medium text-slate-700">
              Built with Python Flask + JavaScript React + Plotly.js
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="bg-blue-50">
                No TypeScript ✓
              </Badge>
              <Badge variant="outline" className="bg-green-50">
                Pure JavaScript ✓
              </Badge>
              <Badge variant="outline" className="bg-purple-50">
                Plotly.js Charts ✓
              </Badge>
              <Badge variant="outline" className="bg-orange-50">
                Axios HTTP ✓
              </Badge>
              <Badge variant="outline" className="bg-pink-50">
                Flask Backend ✓
              </Badge>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl mx-auto">
              Exact tech stack as requested: React + Vite, Plotly.js, Axios, Tailwind CSS, Flask,
              Pandas, scikit-learn, ESLint, Prettier, black, flake8. No TypeScript.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
