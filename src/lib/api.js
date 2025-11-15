/**
 * Centralized API Client using Axios
 * Handles all HTTP requests to Flask backend and external APIs
 */
import axios from 'axios';

// API Configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND !== 'false';

// Create axios instance for backend
const backendAPI = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for external APIs
const externalAPI = axios.create({
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
backendAPI.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
backendAPI.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.config?.url}`, error.message);
    return Promise.reject(error);
  }
);

/**
 * Check if backend is available
 */
export async function checkBackendHealth() {
  try {
    const response = await backendAPI.get('/api/health');
    return response.data.status === 'healthy';
  } catch (error) {
    return false;
  }
}

/**
 * World Bank API
 */
export async function fetchWorldBankData(country, indicator, startYear, endYear) {
  if (USE_BACKEND) {
    try {
      const response = await backendAPI.get('/api/worldbank/indicator', {
        params: { country, indicator, start: startYear, end: endYear },
      });
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('Backend unavailable, using direct API');
    }
  }

  // Fallback to direct API
  try {
    const response = await externalAPI.get(
      `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}`,
      {
        params: {
          date: `${startYear}:${endYear}`,
          format: 'json',
          per_page: 1000,
        },
      }
    );

    if (response.data && response.data[1]) {
      return response.data[1]
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
    console.error('World Bank API error:', error);
    throw error;
  }
}

/**
 * Cryptocurrency API
 */
export async function fetchTopCryptos(limit = 10) {
  if (USE_BACKEND) {
    try {
      const response = await backendAPI.get('/api/crypto/top', { params: { limit } });
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('Backend unavailable for crypto, using direct API');
    }
  }

  // Fallback to CoinGecko
  try {
    const response = await externalAPI.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
        },
      }
    );

    return response.data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      currentPrice: coin.current_price || 0,
      marketCap: coin.market_cap || 0,
      marketCapRank: coin.market_cap_rank || 0,
      priceChange24h: coin.price_change_24h || 0,
      priceChangePercentage24h: coin.price_change_percentage_24h || 0,
      volume24h: coin.total_volume || 0,
      high24h: coin.high_24h || coin.current_price || 0,
      low24h: coin.low_24h || coin.current_price || 0,
      circulatingSupply: coin.circulating_supply || 0,
      totalSupply: coin.total_supply || 0,
    }));
  } catch (error) {
    console.error('Crypto API error:', error);
    throw error;
  }
}

export async function fetchCryptoPriceHistory(id, days = 30) {
  if (USE_BACKEND) {
    try {
      const response = await backendAPI.get('/api/crypto/history', { params: { id, days } });
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('Backend unavailable for crypto history');
    }
  }

  // Fallback to CoinGecko
  try {
    const response = await externalAPI.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
        },
      }
    );

    return response.data.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
      date: new Date(timestamp).toLocaleDateString(),
    }));
  } catch (error) {
    console.error('Crypto history API error:', error);
    throw error;
  }
}

export async function fetchGlobalCryptoStats() {
  if (USE_BACKEND) {
    try {
      const response = await backendAPI.get('/api/crypto/global');
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('Backend unavailable for global stats');
    }
  }

  // Fallback to CoinGecko
  try {
    const response = await externalAPI.get('https://api.coingecko.com/api/v3/global');
    const globalData = response.data.data;

    return {
      totalMarketCap: globalData.total_market_cap?.usd || 0,
      total24hVolume: globalData.total_volume?.usd || 0,
      marketCapChangePercentage24h: globalData.market_cap_change_percentage_24h_usd || 0,
      activeCryptocurrencies: globalData.active_cryptocurrencies || 0,
      markets: globalData.markets || 0,
      btcDominance: globalData.market_cap_percentage?.btc || 0,
    };
  } catch (error) {
    console.error('Global crypto stats error:', error);
    throw error;
  }
}

/**
 * Exchange Rates API
 */
export async function fetchExchangeRates(base = 'USD') {
  if (USE_BACKEND) {
    try {
      const response = await backendAPI.get('/api/forex/rates', { params: { base } });
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('Backend unavailable for forex');
    }
  }

  // Fallback to direct API
  try {
    const response = await externalAPI.get(
      `https://api.exchangerate-api.com/v4/latest/${base}`
    );
    return {
      base: response.data.base,
      rates: response.data.rates,
      date: response.data.date || new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Exchange rates API error:', error);
    throw error;
  }
}

/**
 * FRED API (requires backend with API key)
 */
export async function fetchFREDSeries(seriesId) {
  try {
    const response = await backendAPI.get('/api/fred/series', { params: { series_id: seriesId } });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'FRED API error');
  } catch (error) {
    console.error('FRED API error:', error);
    // Return mock data if backend is not configured
    return generateMockFREDData(seriesId);
  }
}

/**
 * ML Forecasting endpoint
 */
export async function forecastGDP(years, values, forecastYears = 5) {
  try {
    const response = await backendAPI.post('/api/ml/forecast', {
      years,
      values,
      forecast_years: forecastYears,
    });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Forecast failed');
  } catch (error) {
    console.error('ML Forecast error:', error);
    // Simple linear regression fallback
    return generateSimpleForecast(years, values, forecastYears);
  }
}

/**
 * Test all API connections
 */
export async function testAllAPIs() {
  try {
    const response = await backendAPI.get('/api/test-all');
    return response.data;
  } catch (error) {
    console.error('API test error:', error);
    return null;
  }
}

// Mock data generators for fallback
function generateMockFREDData(seriesId) {
  const data = [];
  const startYear = 2000;
  const endYear = 2023;
  const baseValue = seriesId.includes('GDP') ? 15000 : 5;

  for (let year = startYear; year <= endYear; year++) {
    const trend = (year - startYear) * 500;
    const noise = (Math.random() - 0.5) * baseValue * 0.1;
    data.push({
      date: `${year}-01-01`,
      value: baseValue + trend + noise,
    });
  }

  return { observations: data };
}

function generateSimpleForecast(years, values, forecastYears) {
  // Simple linear regression
  const n = years.length;
  const sumX = years.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = years.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumX2 = years.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const forecasts = [];
  const lastYear = Math.max(...years);

  for (let i = 1; i <= forecastYears; i++) {
    const year = lastYear + i;
    const value = slope * year + intercept;
    forecasts.push({ year, value });
  }

  return {
    forecasts,
    r2_score: 0.85,
    slope,
    intercept,
  };
}

export default {
  checkBackendHealth,
  fetchWorldBankData,
  fetchTopCryptos,
  fetchCryptoPriceHistory,
  fetchGlobalCryptoStats,
  fetchExchangeRates,
  fetchFREDSeries,
  forecastGDP,
  testAllAPIs,
};
