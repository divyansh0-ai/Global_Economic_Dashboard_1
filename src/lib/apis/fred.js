// Federal Reserve Economic Data (FRED) API
// API Documentation: https://fred.stlouisfed.org/docs/api/fred/

const FRED_API_KEY = 'YOUR_FRED_API_KEY'; // Users should replace with their key
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

// Common FRED Series IDs
export const FRED_SERIES = {
  // US Economic Indicators
  GDP: 'GDP',
  GDP_REAL: 'GDPC1',
  GDP_PER_CAPITA: 'A939RX0Q048SBEA',
  UNEMPLOYMENT_RATE: 'UNRATE',
  INFLATION_RATE: 'FPCPITOTLZGUSA',
  CPI: 'CPIAUCSL',
  CORE_CPI: 'CPILFESL',
  
  // Interest Rates
  FEDERAL_FUNDS_RATE: 'DFF',
  PRIME_RATE: 'DPRIME',
  TREASURY_10Y: 'DGS10',
  TREASURY_2Y: 'DGS2',
  
  // Market Indicators
  SP500: 'SP500',
  NASDAQ: 'NASDAQCOM',
  DOW_JONES: 'DJIA',
  VIX: 'VIXCLS',
  
  // Trade and Commerce
  EXPORTS: 'EXPGS',
  IMPORTS: 'IMPGS',
  TRADE_BALANCE: 'BOPGTB',
  
  // Money Supply
  M1: 'M1SL',
  M2: 'M2SL',
  
  // Housing
  HOUSING_STARTS: 'HOUST',
  HOME_SALES: 'HSN1F',
  CASE_SHILLER: 'CSUSHPISA',
  
  // Labor Market
  NONFARM_PAYROLL: 'PAYEMS',
  LABOR_FORCE_PARTICIPATION: 'CIVPART',
  INITIAL_CLAIMS: 'ICSA',
  
  // Consumer
  RETAIL_SALES: 'RSXFS',
  CONSUMER_SENTIMENT: 'UMCSENT',
  PERSONAL_CONSUMPTION: 'PCE',
};

export async function fetchFREDSeries(seriesId, startDate, endDate) {
  try {
    // For demo purposes, return mock data
    // In production, users would use: const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_start=${startDate || '2000-01-01'}&observation_end=${endDate || '2024-12-31'}`;
    
    const mockData = generateMockFREDData(seriesId, startDate, endDate);
    return mockData;
  } catch (error) {
    console.error('Error fetching FRED data:', error);
    throw error;
  }
}

export async function fetchMultipleFREDSeries(seriesIds) {
  const results = {};
  
  await Promise.all(
    seriesIds.map(async (seriesId) => {
      try {
        results[seriesId] = await fetchFREDSeries(seriesId);
      } catch (error) {
        console.error(`Error fetching series ${seriesId}:`, error);
      }
    })
  );
  
  return results;
}

// Mock data generator for demonstration
function generateMockFREDData(seriesId, startDate, endDate) {
  const start = startDate ? new Date(startDate) : new Date('2010-01-01');
  const end = endDate ? new Date(endDate) : new Date('2023-12-31');
  
  const observations = [];
  const currentDate = new Date(start);
  
  // Generate quarterly data
  while (currentDate <= end) {
    let value = null;
    
    // Generate realistic mock values based on series type
    switch (seriesId) {
      case FRED_SERIES.GDP:
        value = 15000 + Math.random() * 10000 + (currentDate.getFullYear() - 2010) * 500;
        break;
      case FRED_SERIES.UNEMPLOYMENT_RATE:
        value = 4 + Math.random() * 3 + Math.sin(currentDate.getTime() / 1000000000) * 2;
        break;
      case FRED_SERIES.INFLATION_RATE:
        value = 2 + Math.random() * 2;
        break;
      case FRED_SERIES.FEDERAL_FUNDS_RATE:
        value = 0.5 + Math.random() * 4;
        break;
      case FRED_SERIES.SP500:
        value = 2000 + (currentDate.getFullYear() - 2010) * 200 + Math.random() * 500;
        break;
      default:
        value = Math.random() * 100;
    }
    
    observations.push({
      date: currentDate.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
    });
    
    // Increment by quarter
    currentDate.setMonth(currentDate.getMonth() + 3);
  }
  
  return {
    observations,
    units: getSeriesUnits(seriesId),
    title: getSeriesTitle(seriesId),
  };
}

function getSeriesUnits(seriesId) {
  if (seriesId.includes('RATE') || seriesId.includes('PERCENT')) return 'Percent';
  if (seriesId.includes('GDP') || seriesId.includes('SALES')) return 'Billions of Dollars';
  if (seriesId.includes('INDEX') || seriesId === FRED_SERIES.SP500) return 'Index';
  return 'Units';
}

function getSeriesTitle(seriesId) {
  const titles = {
    [FRED_SERIES.GDP]: 'Gross Domestic Product',
    [FRED_SERIES.UNEMPLOYMENT_RATE]: 'Unemployment Rate',
    [FRED_SERIES.INFLATION_RATE]: 'Inflation Rate',
    [FRED_SERIES.FEDERAL_FUNDS_RATE]: 'Federal Funds Effective Rate',
    [FRED_SERIES.SP500]: 'S&P 500 Index',
  };
  return titles[seriesId] || seriesId;
}
