import { useState, useEffect } from 'react';
import { CountrySelector } from './components/CountrySelector';
import { IndicatorChart } from './components/IndicatorChart';
import { ComparisonChart } from './components/ComparisonChart';
import { GDPPredictor } from './components/GDPPredictor';
import { CorrelationAnalysis } from './components/CorrelationAnalysis';
import { GrowthRateAnalysis } from './components/GrowthRateAnalysis';
import { EconomicHealthScore } from './components/EconomicHealthScore';
import { AdvancedForecasting } from './components/AdvancedForecasting';
import { MultiIndicatorDashboard } from './components/MultiIndicatorDashboard';
import { DataExport } from './components/DataExport';
import { FinancialMarkets } from './components/FinancialMarkets';
import { CurrencyExchange } from './components/CurrencyExchange';
import { CommoditiesTracker } from './components/CommoditiesTracker';
import { USEconomicData } from './components/USEconomicData';
import { EconomicNews } from './components/EconomicNews';
import { CryptoMarkets } from './components/CryptoMarkets';
import { APIStatus } from './components/APIStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { TrendingUp, BarChart3, Globe, Activity, Brain, GitCompare, Download, LineChart, DollarSign, Fuel, Building2, Newspaper, Bitcoin, Zap } from 'lucide-react';
import { Badge } from './components/ui/badge';

export default function App() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['USA', 'CHN', 'DEU', 'JPN']);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Modern Header with Glassmorphism */}
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
                    Real-time data from 10+ sources • News • Markets • Analytics • AI Forecasting
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex gap-2">
                <Badge variant="outline" className="bg-green-50 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Data
                </Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">
                  10+ APIs
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="news" className="space-y-6">
          <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 rounded-2xl border-2 border-white shadow-lg p-2">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-2 bg-transparent">
              <TabsTrigger value="news" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                <Newspaper className="w-4 h-4 mr-2" />
                News
              </TabsTrigger>
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                <Zap className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="crypto" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Bitcoin className="w-4 h-4 mr-2" />
                Crypto
              </TabsTrigger>
              <TabsTrigger value="countries" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                <Globe className="w-4 h-4 mr-2" />
                Countries
              </TabsTrigger>
              <TabsTrigger value="markets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Markets
              </TabsTrigger>
              <TabsTrigger value="forex" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Forex
              </TabsTrigger>
              <TabsTrigger value="commodities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                <Fuel className="w-4 h-4 mr-2" />
                Commodities
              </TabsTrigger>
              <TabsTrigger value="us-data" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                <Building2 className="w-4 h-4 mr-2" />
                US Data
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="export" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-slate-800 data-[state=active]:text-white">
                <Download className="w-4 h-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>
          </div>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <EconomicNews />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* API Status Dashboard */}
            <APIStatus />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Globe className="w-5 h-5" />
                    World Bank
                  </CardTitle>
                  <CardDescription>200+ countries</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    GDP, inflation, unemployment, trade data
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Building2 className="w-5 h-5" />
                    FRED API
                  </CardTitle>
                  <CardDescription>Federal Reserve</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Interest rates, employment, housing
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <LineChart className="w-5 h-5" />
                    Alpha Vantage
                  </CardTitle>
                  <CardDescription>Financial markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Stocks, forex, commodities
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-900">
                    <Newspaper className="w-5 h-5" />
                    News API
                  </CardTitle>
                  <CardDescription>Real-time news</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Breaking news, market analysis
                  </p>
                </CardContent>
              </Card>
            </div>

            <FinancialMarkets />
          </TabsContent>

          {/* Crypto Tab */}
          <TabsContent value="crypto" className="space-y-6">
            <CryptoMarkets />
          </TabsContent>

          <TabsContent value="countries" className="space-y-6">
            {/* Country Selection */}
            <Card className="border-2 border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Select Countries
                </CardTitle>
                <CardDescription>Choose countries to compare economic indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <CountrySelector
                  selectedCountries={selectedCountries}
                  onCountriesChange={setSelectedCountries}
                />
              </CardContent>
            </Card>

            <MultiIndicatorDashboard countries={selectedCountries} />

            <Tabs defaultValue="gdp" className="space-y-4">
              <TabsList>
                <TabsTrigger value="gdp">GDP</TabsTrigger>
                <TabsTrigger value="inflation">Inflation</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="trade">Trade</TabsTrigger>
              </TabsList>

              <TabsContent value="gdp" className="space-y-6">
                <IndicatorChart
                  countries={selectedCountries}
                  indicator="NY.GDP.MKTP.CD"
                  title="GDP (Current US$)"
                  description="Gross Domestic Product at market prices"
                />
                <IndicatorChart
                  countries={selectedCountries}
                  indicator="NY.GDP.PCAP.CD"
                  title="GDP Per Capita (Current US$)"
                  description="GDP divided by midyear population"
                />
              </TabsContent>

              <TabsContent value="inflation" className="space-y-6">
                <IndicatorChart
                  countries={selectedCountries}
                  indicator="FP.CPI.TOTL.ZG"
                  title="Inflation Rate (%)"
                  description="Consumer price index annual percentage change"
                />
              </TabsContent>

              <TabsContent value="employment" className="space-y-6">
                <IndicatorChart
                  countries={selectedCountries}
                  indicator="SL.UEM.TOTL.ZS"
                  title="Unemployment Rate (%)"
                  description="Percentage of total labor force"
                />
              </TabsContent>

              <TabsContent value="trade" className="space-y-6">
                <IndicatorChart
                  countries={selectedCountries}
                  indicator="NE.EXP.GNFS.ZS"
                  title="Exports of Goods and Services (% of GDP)"
                  description="Value of all goods and services provided to the rest of the world"
                />
                <IndicatorChart
                  countries={selectedCountries}
                  indicator="NE.IMP.GNFS.ZS"
                  title="Imports of Goods and Services (% of GDP)"
                  description="Value of all goods and services received from the rest of the world"
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="markets" className="space-y-6">
            <FinancialMarkets />
          </TabsContent>

          <TabsContent value="forex" className="space-y-6">
            <CurrencyExchange />
          </TabsContent>

          <TabsContent value="commodities" className="space-y-6">
            <CommoditiesTracker />
          </TabsContent>

          <TabsContent value="us-data" className="space-y-6">
            <USEconomicData />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Tabs defaultValue="growth" className="space-y-4">
              <TabsList>
                <TabsTrigger value="growth">Growth Rates</TabsTrigger>
                <TabsTrigger value="correlation">Correlation</TabsTrigger>
                <TabsTrigger value="health">Health Score</TabsTrigger>
                <TabsTrigger value="forecasting">AI Forecasting</TabsTrigger>
              </TabsList>

              <TabsContent value="growth">
                <GrowthRateAnalysis countries={selectedCountries} />
              </TabsContent>

              <TabsContent value="correlation">
                <CorrelationAnalysis countries={selectedCountries} />
              </TabsContent>

              <TabsContent value="health">
                <EconomicHealthScore countries={selectedCountries} />
              </TabsContent>

              <TabsContent value="forecasting">
                <AdvancedForecasting countries={selectedCountries} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <DataExport countries={selectedCountries} />
          </TabsContent>
        </Tabs>

        {/* Modern Footer */}
        <div className="mt-12 backdrop-blur-sm bg-white/70 rounded-3xl border-2 border-white shadow-lg p-8">
          <div className="text-center space-y-4">
            <p className="font-medium text-slate-700">Powered by Multiple Data Sources</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                World Bank API
              </a>
              <a
                href="https://fred.stlouisfed.org/docs/api/fred/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                FRED API
              </a>
              <a
                href="https://www.alphavantage.co/documentation/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                Alpha Vantage
              </a>
              <a
                href="https://newsapi.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
              >
                News API
              </a>
              <a
                href="https://www.coingecko.com/en/api"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors text-sm"
              >
                CoinGecko API
              </a>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl mx-auto">
              This platform aggregates data from multiple trusted sources. Some APIs use demo data for showcase purposes. 
              Replace API keys with your own for live production data. Built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}