# 🌍 Global Economic Intelligence Platform

> **Pure JavaScript** implementation with **Flask + React + Plotly.js** - No TypeScript

## 🎯 Tech Stack (Exact Match to Requirements)

### Backend (Python 3.10+)
- ✅ **Flask** - REST API framework
- ✅ **Requests** - World Bank API calls
- ✅ **Pandas** - Data wrangling and processing
- ✅ **scikit-learn** - Simple regression/prediction
- ✅ **joblib** - Model save/load

### Frontend (JavaScript Only)
- ✅ **React** - with Vite (no Create React App, no TypeScript)
- ✅ **Plotly.js** - Interactive charts via react-plotly.js
- ✅ **Axios** - HTTP requests to Flask backend
- ✅ **Tailwind CSS** - Quick clean UI
- ✅ **React Router** - Multi-page navigation

### Data / Storage
- ✅ **In-Memory Caching** - Fast data access
- ✅ **Local JSON Files** - Simple storage
- ✅ **No Database** - Initially (optional SQLite later)

### Dev / Tooling
- ✅ **Git + GitHub** - Version control
- ✅ **ESLint + Prettier** - Frontend linting/formatting
- ✅ **black + flake8** - Backend Python formatting/linting
- ✅ **GitHub Actions** - CI/CD (optional)

## 🚀 Quick Start

### Prerequisites
```bash
# Python 3.10+
python --version

# Node.js 18+
node --version
```

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup

```bash
# In root directory
npm install

# Run development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 📦 Dependencies

### Backend (`backend/requirements.txt`)
```
Flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
pandas==2.1.4
numpy==1.26.2
scikit-learn==1.3.2
joblib==1.3.2
pytest==7.4.3
```

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-plotly.js": "^2.6.0",
    "plotly.js": "^2.27.1",
    "axios": "^1.6.2",
    "react-router-dom": "^6.20.1",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.6"
  }
}
```

## 🏗️ Project Structure

```
/
├── backend/
│   ├── app.py                 # Flask REST API
│   ├── requirements.txt       # Python dependencies
│   ├── .flake8               # Flake8 config
│   ├── pyproject.toml        # Black config
│   └── README.md             # Backend docs
│
├── components/
│   ├── CryptoMarketsPlotly.jsx  # Crypto component (Plotly)
│   └── ui/                      # UI components
│
├── lib/
│   └── api.js                # Axios API client (no .ts!)
│
├── .eslintrc.json            # ESLint config
├── .prettierrc.json          # Prettier config
├── vite.config.js            # Vite config (no TypeScript)
├── App.jsx                   # Main app (JavaScript)
├── main.jsx                  # Entry point (JavaScript)
├── index.html                # HTML entry
└── package.json              # Node dependencies
```

## 📊 Features

### ✅ Currently Implemented
- **Cryptocurrency Markets** - Real-time prices with Plotly.js charts
- **Flask Backend** - RESTful API with CORS support
- **Axios Integration** - HTTP client for all API calls
- **No TypeScript** - Pure JavaScript (.jsx files only)
- **Plotly.js Charts** - Interactive visualizations
- **Pandas Processing** - Data wrangling in backend
- **scikit-learn** - ML predictions ready

### 🚧 Coming Soon
- World Bank economic indicators
- FRED US economic data
- Currency exchange rates
- Stock market data
- Economic news feed
- ML forecasting dashboard

## 🔧 Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
```

### Backend
```bash
python app.py        # Run Flask server
black .              # Format with black
flake8              # Lint with flake8
pytest              # Run tests
```

## 📡 API Endpoints

### Backend (Flask)
```
GET  /api/health                    # Health check
GET  /api/worldbank/indicator       # World Bank data
GET  /api/crypto/top                # Top cryptocurrencies
GET  /api/crypto/history            # Crypto price history
GET  /api/crypto/global             # Global crypto stats
GET  /api/forex/rates               # Exchange rates
GET  /api/fred/series               # FRED economic data
POST /api/ml/forecast               # ML forecasting
GET  /api/test-all                  # Test all APIs
```

### External APIs (via Axios)
- World Bank API - Economic indicators
- CoinGecko API - Cryptocurrency data
- Exchange Rate API - Forex rates
- FRED API - US economic data (requires key)

## 🎨 UI Components

All components are **pure JavaScript** (.jsx):
- `App.jsx` - Main application
- `CryptoMarketsPlotly.jsx` - Crypto dashboard with Plotly
- `ui/` - Shadcn UI components (adapted for JS)

## 🔍 Code Quality

### Frontend Linting
```bash
# ESLint configuration
npm run lint

# Prettier formatting
npm run format
```

### Backend Linting
```bash
# Black formatting (PEP 8)
black .

# Flake8 linting
flake8
```

## 🌐 Environment Variables

### Frontend (`.env`)
```
VITE_BACKEND_URL=http://localhost:5000
VITE_USE_BACKEND=true
```

### Backend (`backend/.env`)
```
FRED_API_KEY=your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
PORT=5000
FLASK_ENV=development
```

## 📈 Data Flow

```
User Browser
     ↓
React App (JavaScript + Plotly.js)
     ↓
Axios HTTP Client
     ↓
Flask REST API
     ↓
├─ Pandas (data processing)
├─ scikit-learn (ML predictions)
├─ Requests (external APIs)
└─ joblib (model persistence)
     ↓
External APIs
├─ World Bank API
├─ CoinGecko API
├─ FRED API
└─ Exchange Rate API
```

## 🚢 Deployment

### Backend (Railway / Render / Fly.io)
```bash
# Railway
railway up

# Render - Connect GitHub repo

# Fly.io
fly launch
fly deploy
```

### Frontend (Vercel / Netlify)
```bash
# Vercel
npm run build
vercel

# Netlify
npm run build
netlify deploy --prod
```

## 🧪 Testing

### Frontend
```bash
npm run lint        # Check for errors
npm run format      # Auto-format code
```

### Backend
```bash
pytest              # Run tests
flake8              # Check code quality
black --check .     # Check formatting
```

## 📚 Documentation

- `/backend/README.md` - Backend setup guide
- `/SETUP_GUIDE.md` - Complete setup instructions
- `/API_SOLUTION.md` - API integration details
- This file - Project overview

## ✨ Key Highlights

### ✅ No TypeScript
- All files use `.jsx` extension
- No type annotations
- No interface definitions
- Pure JavaScript ES6+

### ✅ Plotly.js Integration
- Interactive charts
- Responsive visualizations
- Area charts, line charts, bar charts
- Better than Recharts for complex data

### ✅ Axios HTTP Client
- Centralized API client
- Request/response interceptors
- Automatic retries
- Better error handling than fetch

### ✅ Flask Backend
- RESTful API design
- CORS support
- Pandas data processing
- scikit-learn ML models
- joblib model persistence

### ✅ Code Quality Tools
- ESLint for JavaScript
- Prettier for formatting
- black for Python
- flake8 for Python linting
- Pre-configured and ready

## 🎯 Next Steps

1. **Start Development**
   ```bash
   # Terminal 1 - Backend
   cd backend && python app.py
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Add More Features**
   - Implement World Bank dashboard
   - Add FRED economic indicators
   - Create ML forecasting page
   - Add user preferences

3. **Deploy to Production**
   - Deploy Flask backend to Railway/Render
   - Deploy React frontend to Vercel/Netlify
   - Set up environment variables
   - Configure GitHub Actions CI/CD

## 🆘 Troubleshooting

### Frontend Issues
```bash
# Clear cache
rm -rf node_modules .vite
npm install

# Check for errors
npm run lint
```

### Backend Issues
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Check Flask is running
curl http://localhost:5000/api/health
```

### CORS Issues
- Make sure Flask-CORS is installed
- Check Vite proxy configuration
- Verify backend URL in frontend

## 📞 Support

- Backend docs: `/backend/README.md`
- Frontend setup: `/SETUP_GUIDE.md`
- API details: `/lib/api.js`

---

**Built with:** Python 3.10 + Flask + React + Vite + Plotly.js + Axios + Tailwind CSS

**No TypeScript** | **Pure JavaScript** | **Exact Tech Stack Match** ✅
