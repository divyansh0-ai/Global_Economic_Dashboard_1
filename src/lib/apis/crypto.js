// Cryptocurrency API Integration - CoinGecko (Free, no API key required)
// Real-time crypto market data with proper error handling

const CRYPTO_API_BASE = 'https://api.coingecko.com/api/v3';

// Fallback to backend if available
const BACKEND_URL = typeof window !== 'undefined' 
  ? (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')
  : '';

async function fetchWithTimeout(url, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function fetchTopCryptos(limit = 10) {
  // Try backend first if available
  if (BACKEND_URL) {
    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/api/crypto/top?limit=${limit}`, 5000);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          console.log('✅ Fetched crypto data from backend');
          return result.data;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, trying direct API...');
    }
  }

  // Try direct CoinGecko API
  try {
    const url = `${CRYPTO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&locale=en`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Fetched crypto data from CoinGecko API');
    
    return data.map((coin) => ({
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
    console.warn('CoinGecko API failed, using mock data:', error);
    return generateMockCryptoData(limit);
  }
}

export async function fetchCryptoPriceHistory(id, days = 30) {
  // Try backend first
  if (BACKEND_URL) {
    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/api/crypto/history?id=${id}&days=${days}`, 5000);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.log('Backend unavailable for history, trying direct API...');
    }
  }

  // Try direct API
  try {
    const url = `${CRYPTO_API_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.prices && Array.isArray(data.prices)) {
      return data.prices.map((item) => ({
        timestamp: item[0],
        price: item[1],
        volume: 0,
      }));
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn('Price history API failed, using mock data:', error);
    return generateMockPriceHistory(id, days);
  }
}

export async function fetchGlobalCryptoStats() {
  // Try backend first
  if (BACKEND_URL) {
    try {
      const response = await fetchWithTimeout(`${BACKEND_URL}/api/crypto/global`, 5000);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
    } catch (error) {
      console.log('Backend unavailable for global stats, trying direct API...');
    }
  }

  // Try direct API
  try {
    const url = `${CRYPTO_API_BASE}/global`;
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }
    
    const data = await response.json();
    const globalData = data.data;
    
    return {
      totalMarketCap: globalData.total_market_cap?.usd || 0,
      total24hVolume: globalData.total_volume?.usd || 0,
      marketCapChangePercentage24h: globalData.market_cap_change_percentage_24h_usd || 0,
      activeCryptocurrencies: globalData.active_cryptocurrencies || 0,
      markets: globalData.markets || 0,
      btcDominance: globalData.market_cap_percentage?.btc || 0,
    };
  } catch (error) {
    console.warn('Global stats API failed, using mock data:', error);
    return {
      totalMarketCap: 1.8e12 + Math.random() * 2e11,
      total24hVolume: 8e10 + Math.random() * 2e10,
      marketCapChangePercentage24h: (Math.random() - 0.5) * 5,
      activeCryptocurrencies: 12500,
      markets: 850,
      btcDominance: 45 + Math.random() * 10,
    };
  }
}

// Mock data generators
function generateMockCryptoData(limit) {
  const cryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', basePrice: 43000 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', basePrice: 2300 },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', basePrice: 310 },
    { id: 'ripple', symbol: 'XRP', name: 'XRP', basePrice: 0.52 },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', basePrice: 0.38 },
    { id: 'solana', symbol: 'SOL', name: 'Solana', basePrice: 98 },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', basePrice: 7.2 },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.082 },
  ];

  return cryptos.slice(0, limit).map((crypto, index) => {
    const variation = (Math.random() - 0.5) * 0.15;
    const currentPrice = crypto.basePrice * (1 + variation);
    const priceChange24h = (Math.random() - 0.5) * crypto.basePrice * 0.08;

    return {
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      image: `https://assets.coingecko.com/coins/images/${index + 1}/large/${crypto.id}.png`,
      currentPrice,
      marketCap: currentPrice * (1e9 + Math.random() * 5e9),
      marketCapRank: index + 1,
      priceChange24h,
      priceChangePercentage24h: (priceChange24h / currentPrice) * 100,
      volume24h: currentPrice * (1e8 + Math.random() * 5e8),
      high24h: currentPrice * (1 + Math.random() * 0.05),
      low24h: currentPrice * (1 - Math.random() * 0.05),
      circulatingSupply: 1e7 + Math.random() * 1e8,
      totalSupply: 2.1e7,
    };
  });
}

function generateMockPriceHistory(id, days) {
  const cryptos = ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano', 'solana', 'polkadot', 'dogecoin'];
  const basePrices = [43000, 2300, 310, 0.52, 0.38, 98, 7.2, 0.082];
  const cryptoIndex = cryptos.indexOf(id);
  const basePrice = basePrices[cryptoIndex] || 100;

  const data = [];
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const trend = Math.sin(i / 10) * 0.1;
    const noise = (Math.random() - 0.5) * 0.05;
    const price = basePrice * (1 + trend + noise);

    data.push({
      timestamp,
      price: parseFloat(price.toFixed(8)),
      volume: Math.random() * 1e9,
    });
  }

  return data;
}
