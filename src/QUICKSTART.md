# ⚡ Quick Start Guide

## 1️⃣ Install Dependencies (2 minutes)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend
```bash
npm install
```

## 2️⃣ Start Servers (30 seconds)

### Terminal 1 - Backend
```bash
cd backend
python app.py
```
✅ Backend running on `http://localhost:5000`

### Terminal 2 - Frontend
```bash
npm run dev
```
✅ Frontend running on `http://localhost:5173`

## 3️⃣ Open Browser

Navigate to: **http://localhost:5173**

Click on **"Crypto"** tab to see Plotly.js charts!

---

## 🎯 Tech Stack Summary

### ✅ What's Running:
- **Backend:** Flask (Python 3.10+) with Pandas & scikit-learn
- **Frontend:** React + Vite (JavaScript only, no TypeScript)
- **Charts:** Plotly.js (interactive visualizations)
- **HTTP:** Axios (API client)
- **Styling:** Tailwind CSS

### ✅ What's NOT Used:
- ❌ TypeScript
- ❌ Recharts
- ❌ fetch API
- ❌ Create React App

---

## 🔧 Quick Commands

### Development
```bash
# Frontend
npm run dev          # Start dev server
npm run lint         # Check code quality
npm run format       # Format code

# Backend
python app.py        # Start Flask server
black .              # Format Python code
flake8               # Lint Python code
```

### Build for Production
```bash
npm run build        # Build frontend
npm run preview      # Preview production build
```

---

## 📁 File Structure

```
/
├── backend/
│   ├── app.py              # Flask REST API ✅
│   └── requirements.txt    # Python deps ✅
│
├── components/
│   └── CryptoMarketsPlotly.jsx  # Plotly component ✅
│
├── lib/
│   └── api.js              # Axios client ✅
│
├── App.jsx                 # Main app (JavaScript) ✅
├── main.jsx                # Entry point (JavaScript) ✅
└── package.json            # Node deps (no TypeScript) ✅
```

---

## 🚀 What Works Right Now:

1. ✅ **Crypto Markets** - Real-time cryptocurrency prices
2. ✅ **Plotly.js Charts** - Interactive area charts
3. ✅ **Flask Backend** - REST API with CORS
4. ✅ **Axios HTTP** - API client with interceptors
5. ✅ **Pandas Processing** - Data wrangling ready
6. ✅ **scikit-learn** - ML models ready

---

## 📊 Test the APIs

```bash
# Health check
curl http://localhost:5000/api/health

# Crypto data
curl http://localhost:5000/api/crypto/top?limit=5

# Test all APIs
curl http://localhost:5000/api/test-all
```

---

## 🎨 See the Magic

1. Open `http://localhost:5173`
2. Click **"Crypto"** tab
3. See interactive Plotly.js charts
4. Click on different cryptocurrencies
5. Charts update in real-time!

---

## 🆘 Troubleshooting

### Backend won't start?
```bash
# Activate virtual environment first
source backend/venv/bin/activate  # Mac/Linux
backend\venv\Scripts\activate     # Windows

# Then run
python backend/app.py
```

### Frontend errors?
```bash
# Clear cache and reinstall
rm -rf node_modules .vite
npm install
npm run dev
```

### CORS errors?
- Make sure backend is running on port 5000
- Check `vite.config.js` proxy settings
- Verify Flask-CORS is installed

---

## ✅ You're All Set!

**Time to start:** 3 minutes

**What you have:**
- ✅ Flask backend (Python 3.10+)
- ✅ React frontend (JavaScript, no TypeScript)
- ✅ Plotly.js charts
- ✅ Axios HTTP client
- ✅ Pandas + scikit-learn
- ✅ ESLint + Prettier
- ✅ black + flake8

**Start building amazing features!** 🚀
