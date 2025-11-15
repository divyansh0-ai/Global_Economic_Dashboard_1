// OECD (Organisation for Economic Co-operation and Development) API
// API Documentation: https://data.oecd.org/api/

const OECD_BASE_URL = 'https://stats.oecd.org/SDMX-JSON/data';

export const OECD_INDICATORS = {
  // Economic Indicators
  GDP_GROWTH: 'QNA/GDP',
  PRODUCTIVITY: 'PDB_GR/PROD',
  EMPLOYMENT_RATE: 'LFS_SEXAGE_I_R/EMP',
  
  // Living Standards
  LIFE_SATISFACTION: 'BLI/SW_LIFS',
  HOUSEHOLD_INCOME: 'IDD/TOT',
  WEALTH: 'WEALTH/TOT',
  
  // Education
  EDUCATION_SPENDING: 'EAG_FIN_RATIO_23/RATIO',
  TERTIARY_EDUCATION: 'EAG_GRAD_ENTR_RATES/GRAD',
  
  // Health
  HEALTH_SPENDING: 'SHA/TOT',
  LIFE_EXPECTANCY: 'HEALTH_STAT/LIFEEXP',
  
  // Environment
  CO2_EMISSIONS: 'AIR_GHG/GHG',
  RENEWABLE_ENERGY: 'GREEN_GROWTH/RENEW',
  
  // Innovation
  RD_SPENDING: 'MSTI_PUB/GERD',
  PATENTS: 'PAT_DEV/TOTAL',
};

export async function fetchOECDIndicator(indicator, countries, startYear = 2010, endYear = 2023) {
  try {
    // Mock OECD data for demonstration
    const data = [];
    
    countries.forEach(country => {
      for (let year = startYear; year <= endYear; year++) {
        const value = generateMockOECDValue(indicator, country, year);
        
        if (value !== null) {
          data.push({
            indicator,
            country,
            year,
            value: parseFloat(value.toFixed(2)),
            unit: getOECDUnit(indicator),
          });
        }
      }
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching OECD data:', error);
    throw error;
  }
}

function generateMockOECDValue(indicator, country, year) {
  const baseValues = {
    'GDP_GROWTH': 2.5,
    'PRODUCTIVITY': 100,
    'EMPLOYMENT_RATE': 70,
    'LIFE_SATISFACTION': 7.0,
    'HOUSEHOLD_INCOME': 35000,
    'EDUCATION_SPENDING': 5.0,
    'HEALTH_SPENDING': 8.0,
    'LIFE_EXPECTANCY': 80,
    'CO2_EMISSIONS': 8.0,
    'RD_SPENDING': 2.5,
  };
  
  const base = baseValues[indicator] || 50;
  const trend = (year - 2010) * 0.5;
  const random = (Math.random() - 0.5) * 5;
  
  return base + trend + random;
}

function getOECDUnit(indicator) {
  const units = {
    'GDP_GROWTH': 'Percent',
    'PRODUCTIVITY': 'Index',
    'EMPLOYMENT_RATE': 'Percent',
    'LIFE_SATISFACTION': 'Scale 0-10',
    'HOUSEHOLD_INCOME': 'USD',
    'EDUCATION_SPENDING': 'Percent of GDP',
    'HEALTH_SPENDING': 'Percent of GDP',
    'LIFE_EXPECTANCY': 'Years',
    'CO2_EMISSIONS': 'Tonnes per capita',
    'RD_SPENDING': 'Percent of GDP',
  };
  
  return units[indicator] || 'Units';
}
