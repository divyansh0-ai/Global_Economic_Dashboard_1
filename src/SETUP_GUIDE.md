# Complete Setup Guide

## 🚀 Quick Start Options

### Option 1: Frontend Only (Limited APIs)
If you just want to see the dashboard quickly:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the app**
   ```bash
   npm run dev
   ```

3. **What works:**
   - ✅ World Bank API (real data)
   - ⚠️ Other APIs use mock data

### Option 2: Full Stack (All APIs Working) - RECOMMENDED

#### Step 1: Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Create Python virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure API keys**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   - Get FRED key: https://fred.stlouisfed.org/docs/api/api_key.html
   - Get Alpha Vantage key: https://www.alphavantage.co/support/#api-key
   - Get News API key: https://newsapi.org/register

5. **Run Flask backend**
   ```bash
   python app.py
   ```
   
   Backend will run on `http://localhost:5000`

#### Step 2: Frontend Setup

1. **Open new terminal**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   The `.env` should contain:
   ```
   VITE_BACKEND_URL=http://localhost:5000
   VITE_USE_BACKEND=true
   ```

4. **Run frontend**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:5173`

## 📊 API Status

### ✅ Working Without API Keys
1. **World Bank API** - Real economic data for 200+ countries
2. **CoinGecko API** - Real-time cryptocurrency data
3. **Exchange Rate API** - Live forex rates

### 🔑 Requires API Keys (Free)
1. **FRED API** - US Federal Reserve economic data
2. **Alpha Vantage** - Stock market data
3. **News API** - Economic news articles

## 🔧 Troubleshooting

### Backend Issues

**Problem:** "Module not found" error
```bash
# Solution: Make sure virtual environment is activated
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Then reinstall
pip install -r requirements.txt
```

**Problem:** CORS errors
```bash
# Solution: Make sure Flask-CORS is installed
pip install flask-cors
```

### Frontend Issues

**Problem:** "Failed to fetch" errors
```bash
# Solution 1: Make sure backend is running
# Check http://localhost:5000/api/health

# Solution 2: Update .env
VITE_BACKEND_URL=http://localhost:5000
VITE_USE_BACKEND=true
```

**Problem:** APIs returning mock data
```bash
# Solution: Enable backend in .env
VITE_USE_BACKEND=true

# Restart dev server
npm run dev
```

## 🚢 Production Deployment

### Backend Deployment (Choose One)

#### Railway
```bash
railway login
railway init
railway up
```

#### Render
1. Connect GitHub repo
2. Create Web Service
3. Set environment variables from `.env.example`
4. Deploy

#### Fly.io
```bash
fly launch
fly deploy
```

### Frontend Deployment (Choose One)

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 📁 Project Structure

```
/
├── backend/              # Flask API backend
│   ├── app.py           # Main Flask application
│   ├── requirements.txt # Python dependencies
│   └── .env            # API keys (don't commit!)
├── src/
│   ├── components/      # React components
│   ├── lib/
│   │   ├── api-client.ts    # Unified API client
│   │   ├── worldbank.ts     # World Bank API
│   │   └── apis/            # Other API integrations
├── .env                 # Frontend env (don't commit!)
└── package.json         # Node dependencies
```

## 🔐 Security Checklist

- [ ] Add `.env` to `.gitignore`
- [ ] Never commit API keys
- [ ] Use environment variables in production
- [ ] Enable HTTPS in production
- [ ] Set up rate limiting
- [ ] Add authentication if needed

## 🧪 Testing

### Test Backend
```bash
cd backend
pytest
```

### Test API Connections
Visit: `http://localhost:5000/api/test-all`

### Test Frontend
```bash
npm test
```

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [World Bank API Docs](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)
- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [FRED API Docs](https://fred.stlouisfed.org/docs/api/)

## 💡 Tips

1. **Start with backend first** - This solves CORS issues
2. **Get free API keys** - All APIs offer free tiers
3. **Use mock data** - For testing without keys
4. **Check API status** - Use `/api/health` endpoint
5. **Monitor rate limits** - Most free tiers have limits

## 🆘 Need Help?

- Check backend logs: Look at Flask console output
- Check frontend logs: Open browser DevTools console
- Test individual APIs: Use Postman or curl
- Backend health: `curl http://localhost:5000/api/health`

## ✨ What You Get

With full setup:
- ✅ Real-time economic data from World Bank
- ✅ Live cryptocurrency prices
- ✅ Current exchange rates
- ✅ US economic indicators (with FRED key)
- ✅ Stock market data (with Alpha Vantage key)
- ✅ Economic news (with News API key)
- ✅ ML-powered GDP forecasting
- ✅ No CORS issues
- ✅ Centralized API management
- ✅ Production-ready architecture
