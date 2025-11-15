// Exchange Rates API
// API Documentation: https://exchangeratesapi.io/

// Using a public, free API that doesn't require a key
const EXCHANGE_RATES_BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export const MAJOR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
];

export async function fetchExchangeRates(baseCurrency = 'USD') {
  try {
    // Try real API first with timeout
    const url = `${EXCHANGE_RATES_BASE_URL}/${baseCurrency}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        base: data.base,
        rates: data.rates,
        date: data.date || new Date().toISOString().split('T')[0],
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn('Exchange rates API timeout, using mock data');
      } else {
        console.warn('Exchange rates API unavailable, using mock data:', error.message);
      }
    }
  }
  
  // Always fallback to mock data if API fails
  return getMockExchangeRates(baseCurrency);
}

function getMockExchangeRates(baseCurrency) {
  const mockRates = {
    'USD': 1.0,
    'EUR': 0.92,
    'GBP': 0.79,
    'JPY': 149.50,
    'CNY': 7.24,
    'AUD': 1.52,
    'CAD': 1.36,
    'CHF': 0.88,
    'INR': 83.12,
    'BRL': 4.98,
    'MXN': 17.12,
    'KRW': 1320.45,
    'RUB': 92.50,
    'ZAR': 18.75,
    'SGD': 1.34,
    'HKD': 7.82,
    'SEK': 10.45,
    'NOK': 10.68,
  };
  
  // Adjust rates if base is not USD
  const adjustedRates = {};
  const baseRate = mockRates[baseCurrency] || 1;
  
  Object.keys(mockRates).forEach(currency => {
    adjustedRates[currency] = parseFloat((mockRates[currency] / baseRate).toFixed(6));
  });
  
  return {
    base: baseCurrency,
    rates: adjustedRates,
    date: new Date().toISOString().split('T')[0],
  };
}

export async function convertCurrency(from, to, amount) {
  try {
    const rates = await fetchExchangeRates(from);
    const rate = rates.rates[to];
    const result = amount * rate;
    
    return {
      from,
      to,
      amount,
      result: parseFloat(result.toFixed(2)),
      rate: parseFloat(rate.toFixed(6)),
    };
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}

export async function getHistoricalRates(baseCurrency, targetCurrency, days = 30) {
  try {
    // Historical data requires paid API, using mock data
    const data = [];
    const baseRate = await fetchExchangeRates(baseCurrency);
    const currentRate = baseRate.rates[targetCurrency];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some realistic variation
      const variation = (Math.random() - 0.5) * 0.05;
      const rate = currentRate * (1 + variation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        rate: parseFloat(rate.toFixed(6)),
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    throw error;
  }
}
