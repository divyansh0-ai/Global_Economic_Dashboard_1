// World Bank API utilities
const BASE_URL = 'https://api.worldbank.org/v2';
const DATE_RANGE = '2000:2023';

const COUNTRY_NAMES = {
  'USA': 'United States',
  'CHN': 'China',
  'JPN': 'Japan',
  'DEU': 'Germany',
  'GBR': 'United Kingdom',
  'FRA': 'France',
  'IND': 'India',
  'BRA': 'Brazil',
  'CAN': 'Canada',
  'ITA': 'Italy',
  'KOR': 'South Korea',
  'AUS': 'Australia',
  'ESP': 'Spain',
  'MEX': 'Mexico',
  'IDN': 'Indonesia',
  'NLD': 'Netherlands',
  'SAU': 'Saudi Arabia',
  'TUR': 'Turkey',
  'CHE': 'Switzerland',
  'POL': 'Poland',
};

export const INDICATORS = {
  // GDP Indicators
  'NY.GDP.MKTP.CD': 'GDP (current US$)',
  'NY.GDP.PCAP.CD': 'GDP per capita (current US$)',
  'NY.GDP.MKTP.KD.ZG': 'GDP growth (annual %)',
  'NY.GDP.MKTP.PP.CD': 'GDP, PPP (current international $)',
  
  // Prices and Inflation
  'FP.CPI.TOTL.ZG': 'Inflation, consumer prices (annual %)',
  'FP.CPI.TOTL': 'Consumer price index',
  
  // Employment
  'SL.UEM.TOTL.ZS': 'Unemployment, total (% of total labor force)',
  'SL.TLF.TOTL.IN': 'Labor force, total',
  
  // Trade
  'NE.EXP.GNFS.ZS': 'Exports of goods and services (% of GDP)',
  'NE.IMP.GNFS.ZS': 'Imports of goods and services (% of GDP)',
  'NE.TRD.GNFS.ZS': 'Trade (% of GDP)',
  'BX.KLT.DINV.CD.WD': 'Foreign direct investment, net inflows (BoP, current US$)',
  
  // Government Finance
  'GC.DOD.TOTL.GD.ZS': 'Central government debt, total (% of GDP)',
  'GC.REV.XGRT.GD.ZS': 'Revenue, excluding grants (% of GDP)',
  'GC.XPN.TOTL.GD.ZS': 'Expense (% of GDP)',
  
  // Savings and Investment
  'NY.GDS.TOTL.ZS': 'Gross savings (% of GDP)',
  'NY.GNS.ICTR.ZS': 'Gross savings (% of GNI)',
  'NE.GDI.TOTL.ZS': 'Gross capital formation (% of GDP)',
  
  // Population
  'SP.POP.TOTL': 'Population, total',
  'SP.POP.GROW': 'Population growth (annual %)',
  'SP.URB.TOTL.IN.ZS': 'Urban population (% of total population)',
  
  // Development Indicators
  'SE.XPD.TOTL.GD.ZS': 'Government expenditure on education, total (% of GDP)',
  'SH.XPD.CHEX.GD.ZS': 'Current health expenditure (% of GDP)',
  'NY.ADJ.NNTY.PC.CD': 'Adjusted net national income per capita (current US$)',
  
  // Energy and Environment
  'EG.USE.PCAP.KG.OE': 'Energy use (kg of oil equivalent per capita)',
  'EN.ATM.CO2E.PC': 'CO2 emissions (metric tons per capita)',
};

export function getCountryName(code) {
  return COUNTRY_NAMES[code] || code;
}

export async function fetchWorldBankData(
  countryCode,
  indicator,
  dateRange = DATE_RANGE
) {
  try {
    const url = `${BASE_URL}/country/${countryCode}/indicator/${indicator}?date=${dateRange}&format=json&per_page=1000`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // World Bank API returns array with metadata as first element and data as second
    if (Array.isArray(data) && data.length > 1) {
      const records = data[1];
      
      // Transform the data
      return records
        .map((record) => ({
          year: parseInt(record.date),
          value: record.value,
          country: record.country.value,
          countryCode: record.countryiso3code,
        }))
        .filter((item) => item.value !== null)
        .sort((a, b) => a.year - b.year);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching World Bank data:', error);
    throw error;
  }
}

export async function fetchMultipleIndicators(
  countryCode,
  indicators
) {
  const results = {};
  
  await Promise.all(
    indicators.map(async (indicator) => {
      results[indicator] = await fetchWorldBankData(countryCode, indicator);
    })
  );
  
  return results;
}
