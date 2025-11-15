# Flask Backend API Gateway

This Flask backend serves as a proxy for all external API calls, solving CORS issues and centralizing API key management.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure API Keys

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```
FRED_API_KEY=your_actual_key
ALPHA_VANTAGE_API_KEY=your_actual_key
NEWS_API_KEY=your_actual_key
```

### 3. Run the Server

```bash
python app.py
```

Server will start on `http://localhost:5000`

## API Endpoints

### World Bank API
- `GET /api/worldbank/indicator?country=USA&indicator=NY.GDP.MKTP.CD&start=2000&end=2023`

### Cryptocurrency (CoinGecko)
- `GET /api/crypto/top?limit=10`
- `GET /api/crypto/history?id=bitcoin&days=30`
- `GET /api/crypto/global`

### Exchange Rates
- `GET /api/forex/rates?base=USD`

### FRED (Requires API Key)
- `GET /api/fred/series?series_id=GDP`

### News (Requires API Key)
- `GET /api/news/top?category=business`

### Machine Learning
- `POST /api/ml/forecast` - GDP forecasting with linear regression

### Health & Testing
- `GET /api/health` - Check server status
- `GET /api/test-all` - Test all API connections

## Testing

```bash
pytest
```

## Production Deployment

### Option 1: Railway
```bash
railway login
railway init
railway up
```

### Option 2: Render
1. Connect your GitHub repo
2. Create new Web Service
3. Set environment variables
4. Deploy

### Option 3: Fly.io
```bash
fly launch
fly deploy
```

### Option 4: Docker
```bash
docker build -t economic-dashboard-backend .
docker run -p 5000:5000 --env-file .env economic-dashboard-backend
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FRED_API_KEY` | No | Federal Reserve Economic Data API key |
| `ALPHA_VANTAGE_API_KEY` | No | Alpha Vantage financial data API key |
| `NEWS_API_KEY` | No | News API key for economic news |
| `PORT` | No | Server port (default: 5000) |

## Security Notes

1. **Never commit `.env` to version control**
2. Always use environment variables for API keys in production
3. Enable rate limiting for production deployments
4. Use HTTPS in production
5. Implement authentication if storing user data

## Caching

The backend implements basic caching to reduce API calls. For production, consider:
- Redis for distributed caching
- CDN caching for static responses
- Database caching for historical data

## Error Handling

All endpoints return standardized JSON responses:

Success:
```json
{
  "success": true,
  "data": {...},
  "source": "API Name"
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Tech Stack

- **Flask 3.0** - Web framework
- **Flask-CORS** - CORS handling
- **Requests** - HTTP client
- **Pandas** - Data processing
- **scikit-learn** - Machine learning
- **pytest** - Testing
