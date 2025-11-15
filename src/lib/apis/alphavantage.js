// Alpha Vantage API for Financial Market Data
// API Documentation: https://www.alphavantage.co/documentation/

const ALPHA_VANTAGE_API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Market indices
export const MARKET_INDICES = {
  SP500: 'SPY',
  NASDAQ: 'QQQ',
  DOW_JONES: 'DIA',
  RUSSELL_2000: 'IWM',
  VIX: 'VXX',
};

export async function fetchStockQuote(symbol) {
  try {
    // Mock data for demonstration
    const mockPrice = 100 + Math.random() * 400;
    const mockChange = (Math.random() - 0.5) * 10;
    
    return {
      symbol,
      price: parseFloat(mockPrice.toFixed(2)),
      change: parseFloat(mockChange.toFixed(2)),
      changePercent: parseFloat(((mockChange / mockPrice) * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
}

export async function fetchTimeSeries(symbol, interval = 'daily') {
  try {
    // Mock data for demonstration
    const data = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    
    let basePrice = 100 + Math.random() * 200;
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * basePrice * volatility;
      basePrice = Math.max(10, basePrice + change);
      
      const open = basePrice;
      const close = basePrice + (Math.random() - 0.5) * basePrice * volatility;
      const high = Math.max(open, close) + Math.random() * basePrice * 0.01;
      const low = Math.min(open, close) - Math.random() * basePrice * 0.01;
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000),
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching time series:', error);
    throw error;
  }
}

export async function fetchForexRate(fromCurrency, toCurrency) {
  try {
    // Mock exchange rates
    const rates = {
      'USD_EUR': 0.92,
      'USD_GBP': 0.79,
      'USD_JPY': 149.50,
      'USD_CNY': 7.24,
      'EUR_USD': 1.09,
      'GBP_USD': 1.27,
      'JPY_USD': 0.0067,
    };
    
    const key = `${fromCurrency}_${toCurrency}`;
    const rate = rates[key] || (1 + (Math.random() - 0.5) * 0.2);
    
    return {
      from: fromCurrency,
      to: toCurrency,
      rate: parseFloat(rate.toFixed(4)),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching forex rate:', error);
    throw error;
  }
}

export async function fetchCommodityPrice(commodity) {
  try {
    const prices = {
      'CRUDE_OIL': { price: 75 + Math.random() * 20, unit: 'USD/barrel' },
      'GOLD': { price: 1900 + Math.random() * 200, unit: 'USD/oz' },
      'SILVER': { price: 22 + Math.random() * 3, unit: 'USD/oz' },
      'NATURAL_GAS': { price: 2.5 + Math.random() * 1.5, unit: 'USD/MMBtu' },
      'COPPER': { price: 3.5 + Math.random() * 1, unit: 'USD/lb' },
    };
    
    const data = prices[commodity] || { price: Math.random() * 100, unit: 'USD' };
    
    return {
      commodity,
      price: parseFloat(data.price.toFixed(2)),
      unit: data.unit,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching commodity price:', error);
    throw error;
  }
}

export async function fetchMultipleStockQuotes(symbols) {
  const results = {};
  
  await Promise.all(
    symbols.map(async (symbol) => {
      try {
        results[symbol] = await fetchStockQuote(symbol);
      } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
      }
    })
  );
  
  return results;
}
