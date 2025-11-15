import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, FileJson, FileText, Loader2 } from 'lucide-react';
import { fetchWorldBankData, getCountryName } from '../lib/worldbank';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface DataExportProps {
  countries: string[];
}

const INDICATORS = [
  { code: 'NY.GDP.MKTP.CD', name: 'GDP (Current US$)' },
  { code: 'NY.GDP.PCAP.CD', name: 'GDP Per Capita' },
  { code: 'NY.GDP.MKTP.KD.ZG', name: 'GDP Growth Rate' },
  { code: 'FP.CPI.TOTL.ZG', name: 'Inflation Rate' },
  { code: 'SL.UEM.TOTL.ZS', name: 'Unemployment Rate' },
  { code: 'SP.POP.TOTL', name: 'Population' },
  { code: 'NE.EXP.GNFS.ZS', name: 'Exports (% GDP)' },
  { code: 'NE.IMP.GNFS.ZS', name: 'Imports (% GDP)' },
  { code: 'GC.DOD.TOTL.GD.ZS', name: 'Government Debt (% GDP)' },
  { code: 'NY.GDS.TOTL.ZS', name: 'Gross Savings (% GDP)' },
];

export function DataExport({ countries }: DataExportProps) {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([
    'NY.GDP.MKTP.CD',
    'FP.CPI.TOTL.ZG',
    'SL.UEM.TOTL.ZS'
  ]);
  const [dateRange, setDateRange] = useState('2010:2023');
  const [loading, setLoading] = useState(false);
  const [exportedData, setExportedData] = useState<any>(null);

  const toggleIndicator = (code: string) => {
    if (selectedIndicators.includes(code)) {
      setSelectedIndicators(selectedIndicators.filter(c => c !== code));
    } else {
      setSelectedIndicators([...selectedIndicators, code]);
    }
  };

  const fetchAllData = async () => {
    if (countries.length === 0 || selectedIndicators.length === 0) {
      return;
    }

    setLoading(true);

    try {
      const allData: any = {};

      for (const country of countries) {
        allData[country] = {
          countryName: getCountryName(country),
          countryCode: country,
          indicators: {},
        };

        for (const indicator of selectedIndicators) {
          const data = await fetchWorldBankData(country, indicator, dateRange);
          const indicatorName = INDICATORS.find(i => i.code === indicator)?.name || indicator;
          
          allData[country].indicators[indicatorName] = data.map(item => ({
            year: item.year,
            value: item.value,
          }));
        }
      }

      setExportedData(allData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    if (!exportedData) return;

    const dataStr = JSON.stringify(exportedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `economic-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!exportedData) return;

    // Create CSV header
    let csv = 'Country,Country Code,Indicator,Year,Value\n';

    // Add data rows
    for (const countryCode in exportedData) {
      const countryData = exportedData[countryCode];
      
      for (const indicator in countryData.indicators) {
        const indicatorData = countryData.indicators[indicator];
        
        indicatorData.forEach((item: any) => {
          csv += `"${countryData.countryName}","${countryData.countryCode}","${indicator}",${item.year},${item.value ?? ''}\n`;
        });
      }
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `economic-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getDataSummary = () => {
    if (!exportedData) return null;

    let totalRecords = 0;
    for (const countryCode in exportedData) {
      for (const indicator in exportedData[countryCode].indicators) {
        totalRecords += exportedData[countryCode].indicators[indicator].length;
      }
    }

    return {
      countries: Object.keys(exportedData).length,
      indicators: selectedIndicators.length,
      records: totalRecords,
    };
  };

  const summary = getDataSummary();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Economic Data
          </CardTitle>
          <CardDescription>
            Download selected indicators for analysis in external tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Date Range Selection */}
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2020:2023">2020-2023 (Recent)</SelectItem>
                  <SelectItem value="2015:2023">2015-2023 (5 years)</SelectItem>
                  <SelectItem value="2010:2023">2010-2023 (10 years)</SelectItem>
                  <SelectItem value="2000:2023">2000-2023 (20 years)</SelectItem>
                  <SelectItem value="1990:2023">1990-2023 (All available)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Indicator Selection */}
            <div>
              <label className="text-sm text-slate-600 mb-3 block">Select Indicators</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {INDICATORS.map(indicator => (
                  <div key={indicator.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={indicator.code}
                      checked={selectedIndicators.includes(indicator.code)}
                      onCheckedChange={() => toggleIndicator(indicator.code)}
                    />
                    <Label
                      htmlFor={indicator.code}
                      className="text-sm cursor-pointer"
                    >
                      {indicator.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Countries */}
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Selected Countries</label>
              <div className="flex flex-wrap gap-2">
                {countries.length > 0 ? (
                  countries.map(country => (
                    <Badge key={country} variant="secondary">
                      {getCountryName(country)}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No countries selected</p>
                )}
              </div>
            </div>

            {/* Fetch Data Button */}
            <Button
              onClick={fetchAllData}
              disabled={loading || countries.length === 0 || selectedIndicators.length === 0}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching Data...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Fetch Data from World Bank API
                </>
              )}
            </Button>

            {/* Export Buttons */}
            {exportedData && summary && (
              <div className="space-y-4 pt-4 border-t">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-900 mb-2">
                    Data fetched successfully!
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-green-600">Countries</p>
                      <p className="text-lg text-green-900">{summary.countries}</p>
                    </div>
                    <div>
                      <p className="text-green-600">Indicators</p>
                      <p className="text-lg text-green-900">{summary.indicators}</p>
                    </div>
                    <div>
                      <p className="text-green-600">Total Records</p>
                      <p className="text-lg text-green-900">{summary.records}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={exportToJSON}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <FileJson className="w-4 h-4 mr-2" />
                    Export as JSON
                  </Button>
                  <Button
                    onClick={exportToCSV}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Data exports are suitable for analysis in Python (Pandas), R, Excel, and other data science tools
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
