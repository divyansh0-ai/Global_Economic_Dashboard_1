/**
 * Unified API Client
 * Automatically uses Flask backend if available, otherwise falls back to direct API calls
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true' || false;

/**
 * Check if backend is available
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Generic API caller with backend fallback
 */
async function apiCall(backendEndpoint, fallbackFunction) {
  // If backend is explicitly disabled, use fallback
  if (!USE_BACKEND) {
    return fallbackFunction();
  }

  try {
    const response = await fetch(`${BACKEND_URL}${backendEndpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        console.log(`✅ Using backend: ${result.source}`);
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Backend unavailable, using fallback:', error);
  }

  // Fallback to direct API call
  return fallbackFunction();
}

/**
 * World Bank API
 */
export async function fetchWorldBankData(country, indicator, dateRange = '2000:2023') {
  const [startYear, endYear] = dateRange.split(':');
  
  return apiCall(
    `/api/worldbank/indicator?country=${country}&indicator=${indicator}&start=${startYear}&end=${endYear}`,
    async () => {
      // Direct API call fallback
      const url = `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?date=${dateRange}&format=json&per_page=1000`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 1) {
        return data[1]
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
    }
  );
}

/**
 * Cryptocurrency API
 */
export async function fetchTopCryptos(limit = 10) {
  return apiCall(
    `/api/crypto/top?limit=${limit}`,
    async () => {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
      const response = await fetch(url);
      const data = await response.json();
      
      return data.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        currentPrice: coin.current_price,
        marketCap: coin.market_cap,
        marketCapRank: coin.market_cap_rank,
        priceChange24h: coin.price_change_24h,
        priceChangePercentage24h: coin.price_change_percentage_24h,
        volume24h: coin.total_volume,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
        circulatingSupply: coin.circulating_supply,
        totalSupply: coin.total_supply,
      }));
    }
  );
}

export async function fetchCryptoHistory(id, days = 30) {
  return apiCall(
    `/api/crypto/history?id=${id}&days=${days}`,
    async () => {
      const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
      const response = await fetch(url);
      const data = await response.json();
      
      return data.prices.map((item) => ({
        timestamp: item[0],
        price: item[1],
        volume: 0,
      }));
    }
  );
}

export async function fetchGlobalCryptoStats() {
  return apiCall(
    '/api/crypto/global',
    async () => {
      const url = 'https://api.coingecko.com/api/v3/global';
      const response = await fetch(url);
      const result = await response.json();
      const globalData = result.data;
      
      return {
        totalMarketCap: globalData.total_market_cap.usd,
        total24hVolume: globalData.total_volume.usd,
        marketCapChangePercentage24h: globalData.market_cap_change_percentage_24h_usd,
        activeCryptocurrencies: globalData.active_cryptocurrencies,
        markets: globalData.markets,
        btcDominance: globalData.market_cap_percentage.btc,
      };
    }
  );
}

/**
 * Exchange Rates API
 */
export async function fetchExchangeRates(base = 'USD') {
  return apiCall(
    `/api/forex/rates?base=${base}`,
    async () => {
      const url = `https://api.exchangerate-api.com/v4/latest/${base}`;
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        base: data.base,
        rates: data.rates,
        date: data.date || new Date().toISOString().split('T')[0],
      };
    }
  );
}

/**
 * Test all APIs
 */
export async function testAllAPIs() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/test-all`);
    if (response.ok) {
      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Failed to test APIs:', error);
  }
  
  return null;
}
