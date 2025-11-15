# API Integration Guide

This dashboard integrates multiple data sources. Some APIs require API keys for production use.

## ✅ Working APIs (No Key Required)

### 1. World Bank Open Data API
- **Status**: ✅ FULLY FUNCTIONAL
- **Endpoint**: `https://api.worldbank.org/v2`
- **Documentation**: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
- **No API key required**
- **Rate limit**: None
- **Features**: 
  - 200+ countries
  - 1000+ economic indicators
  - Historical data from 1960+

## 🔑 APIs Requiring Keys (Currently Using Mock Data)

### 2. FRED (Federal Reserve Economic Data)
- **Status**: 🟡 MOCK DATA (Requires API Key)
- **Endpoint**: `https://api.stlouisfed.org/fred`
- **Documentation**: https://fred.stlouisfed.org/docs/api/fred/
- **Get Free API Key**: https://fred.stlouisfed.org/docs/api/api_key.html
- **Setup**: Add your key to `/lib/apis/fred.ts`
- **Rate limit**: 120 requests/minute

### 3. Alpha Vantage (Financial Markets)
- **Status**: 🟡 MOCK DATA (Requires API Key)
- **Endpoint**: `https://www.alphavantage.co/query`
- **Documentation**: https://www.alphavantage.co/documentation/
- **Get Free API Key**: https://www.alphavantage.co/support/#api-key
- **Setup**: Add your key to `/lib/apis/alphavantage.ts`
- **Rate limit**: 5 requests/minute (free tier)

### 4. News API
- **Status**: 🟡 MOCK DATA (Requires API Key)
- **Endpoint**: `https://newsapi.org/v2`
- **Documentation**: https://newsapi.org/docs
- **Get Free API Key**: https://newsapi.org/register
- **Setup**: Add your key to `/lib/apis/news.ts`
- **Rate limit**: 100 requests/day (free tier)

### 5. Exchange Rates API
- **Status**: 🟡 MOCK DATA
- **Endpoint**: `https://api.exchangerate-api.com/v4/latest`
- **Documentation**: https://exchangeratesapi.io/
- **Alternative Free API**: https://www.exchangerate-api.com/
- **No key required for basic tier**

### 6. CoinGecko (Cryptocurrency)
- **Status**: 🟡 MOCK DATA (Can work without key)
- **Endpoint**: `https://api.coingecko.com/api/v3`
- **Documentation**: https://www.coingecko.com/en/api/documentation
- **No API key required for basic tier**
- **Rate limit**: 50 requests/minute

## 📦 How to Enable Real Data

### Step 1: Get API Keys
1. Visit the documentation links above
2. Register for free accounts
3. Generate API keys

### Step 2: Add Keys to Code
Open the respective API files and replace placeholders:

**Example for FRED** (`/lib/apis/fred.ts`):
```typescript
const FRED_API_KEY = 'your_actual_api_key_here';
```

**Example for Alpha Vantage** (`/lib/apis/alphavantage.ts`):
```typescript
const ALPHA_VANTAGE_API_KEY = 'your_actual_api_key_here';
```

### Step 3: Uncomment Real API Calls
Each API file has commented code for real API calls. Uncomment and use them.

## 🚀 Production Recommendations

### Backend API Gateway (Recommended)
For production, create a backend server to:
1. Store API keys securely (environment variables)
2. Implement caching (Redis)
3. Handle rate limiting
4. Proxy requests to avoid CORS issues

### Tech Stack (As Requested)
```
Backend:
- Python 3.10+
- Flask (REST API)
- Pandas (data processing)
- Requests (API calls)
- scikit-learn (ML models)
- joblib (model persistence)
- pytest (testing)

Frontend:
- React + TypeScript
- Plotly.js / Recharts
- Tailwind CSS
- Axios

Data Processing:
- Pandas for cleaning
- Caching with Redis/JSON
- ML with scikit-learn
```

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. Use **environment variables** (.env files)
3. Add `.env` to `.gitignore`
4. Use **backend proxy** for API calls in production
5. Implement **rate limiting** on your backend

## 📊 Current Implementation Status

| API | Status | Real Data | Mock Data | Requires Key |
|-----|--------|-----------|-----------|--------------|
| World Bank | ✅ | Yes | No | No |
| FRED | 🟡 | No | Yes | Yes |
| Alpha Vantage | 🟡 | No | Yes | Yes |
| News API | 🟡 | No | Yes | Yes |
| Exchange Rates | 🟡 | No | Yes | No* |
| CoinGecko | 🟡 | No | Yes | No* |

*Can work without key but has lower rate limits

## 🛠️ Testing APIs

Run individual API tests:
```bash
# Test World Bank API (should work immediately)
curl "https://api.worldbank.org/v2/country/USA/indicator/NY.GDP.MKTP.CD?format=json"

# Test with your FRED key
curl "https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=YOUR_KEY&file_type=json"
```

## 📞 Support

For API-specific issues, refer to their official documentation:
- World Bank: https://datahelpdesk.worldbank.org/
- FRED: https://fred.stlouisfed.org/
- Alpha Vantage: https://www.alphavantage.co/support/
- News API: https://newsapi.org/docs/
