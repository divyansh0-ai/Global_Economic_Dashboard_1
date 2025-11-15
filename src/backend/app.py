"""
Flask Backend API Gateway for Global Economic Intelligence Platform
Handles all external API calls, caching, and data processing
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import pandas as pd
from datetime import datetime, timedelta
import os
from functools import lru_cache
import json
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# API Keys (set these as environment variables in production)
FRED_API_KEY = os.getenv('FRED_API_KEY', 'YOUR_FRED_API_KEY')
ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY', 'YOUR_ALPHA_VANTAGE_API_KEY')
NEWS_API_KEY = os.getenv('NEWS_API_KEY', 'YOUR_NEWS_API_KEY')

# Cache configuration
CACHE_TIMEOUT = 3600  # 1 hour cache

# ============================================================================
# WORLD BANK API ENDPOINTS
# ============================================================================

@app.route('/api/worldbank/indicator', methods=['GET'])
def get_worldbank_indicator():
    """Fetch World Bank indicator data"""
    country = request.args.get('country', 'USA')
    indicator = request.args.get('indicator', 'NY.GDP.MKTP.CD')
    start_year = request.args.get('start', '2000')
    end_year = request.args.get('end', '2023')
    
    try:
        url = f"https://api.worldbank.org/v2/country/{country}/indicator/{indicator}"
        params = {
            'date': f'{start_year}:{end_year}',
            'format': 'json',
            'per_page': 1000
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if len(data) > 1 and data[1]:
            records = data[1]
            processed_data = [
                {
                    'year': int(record['date']),
                    'value': record['value'],
                    'country': record['country']['value'],
                    'countryCode': record['countryiso3code']
                }
                for record in records if record['value'] is not None
            ]
            
            # Sort by year
            processed_data.sort(key=lambda x: x['year'])
            
            return jsonify({
                'success': True,
                'data': processed_data,
                'source': 'World Bank API'
            })
        
        return jsonify({'success': False, 'error': 'No data found'}), 404
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================================
# CRYPTOCURRENCY API ENDPOINTS (CoinGecko)
# ============================================================================

@app.route('/api/crypto/top', methods=['GET'])
def get_top_cryptos():
    """Fetch top cryptocurrencies"""
    limit = request.args.get('limit', 10, type=int)
    
    try:
        url = 'https://api.coingecko.com/api/v3/coins/markets'
        params = {
            'vs_currency': 'usd',
            'order': 'market_cap_desc',
            'per_page': limit,
            'page': 1,
            'sparkline': False
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        processed_data = [
            {
                'id': coin['id'],
                'symbol': coin['symbol'].upper(),
                'name': coin['name'],
                'image': coin['image'],
                'currentPrice': coin['current_price'],
                'marketCap': coin['market_cap'],
                'marketCapRank': coin['market_cap_rank'],
                'priceChange24h': coin['price_change_24h'],
                'priceChangePercentage24h': coin['price_change_percentage_24h'],
                'volume24h': coin['total_volume'],
                'high24h': coin['high_24h'],
                'low24h': coin['low_24h'],
                'circulatingSupply': coin['circulating_supply'],
                'totalSupply': coin['total_supply']
            }
            for coin in data
        ]
        
        return jsonify({
            'success': True,
            'data': processed_data,
            'source': 'CoinGecko API'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/crypto/history', methods=['GET'])
def get_crypto_history():
    """Fetch cryptocurrency price history"""
    coin_id = request.args.get('id', 'bitcoin')
    days = request.args.get('days', 30, type=int)
    
    try:
        url = f'https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart'
        params = {
            'vs_currency': 'usd',
            'days': days
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        processed_data = [
            {
                'timestamp': item[0],
                'price': item[1],
                'volume': 0
            }
            for item in data.get('prices', [])
        ]
        
        return jsonify({
            'success': True,
            'data': processed_data,
            'source': 'CoinGecko API'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/crypto/global', methods=['GET'])
def get_crypto_global():
    """Fetch global cryptocurrency statistics"""
    try:
        url = 'https://api.coingecko.com/api/v3/global'
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        global_data = data['data']
        
        processed_data = {
            'totalMarketCap': global_data['total_market_cap']['usd'],
            'total24hVolume': global_data['total_volume']['usd'],
            'marketCapChangePercentage24h': global_data['market_cap_change_percentage_24h_usd'],
            'activeCryptocurrencies': global_data['active_cryptocurrencies'],
            'markets': global_data['markets'],
            'btcDominance': global_data['market_cap_percentage']['btc']
        }
        
        return jsonify({
            'success': True,
            'data': processed_data,
            'source': 'CoinGecko API'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================================
# EXCHANGE RATES API ENDPOINTS
# ============================================================================

@app.route('/api/forex/rates', methods=['GET'])
def get_exchange_rates():
    """Fetch exchange rates"""
    base = request.args.get('base', 'USD')
    
    try:
        url = f'https://api.exchangerate-api.com/v4/latest/{base}'
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        return jsonify({
            'success': True,
            'data': {
                'base': data['base'],
                'rates': data['rates'],
                'date': data.get('date', datetime.now().strftime('%Y-%m-%d'))
            },
            'source': 'Exchange Rate API'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================================
# FRED API ENDPOINTS (Requires API Key)
# ============================================================================

@app.route('/api/fred/series', methods=['GET'])
def get_fred_series():
    """Fetch FRED series data"""
    series_id = request.args.get('series_id', 'GDP')
    
    if FRED_API_KEY == 'YOUR_FRED_API_KEY':
        return jsonify({
            'success': False,
            'error': 'FRED API key not configured',
            'message': 'Please set FRED_API_KEY environment variable'
        }), 401
    
    try:
        url = 'https://api.stlouisfed.org/fred/series/observations'
        params = {
            'series_id': series_id,
            'api_key': FRED_API_KEY,
            'file_type': 'json'
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        observations = [
            {
                'date': obs['date'],
                'value': float(obs['value']) if obs['value'] != '.' else None
            }
            for obs in data.get('observations', [])
        ]
        
        return jsonify({
            'success': True,
            'data': observations,
            'source': 'FRED API'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================================
# NEWS API ENDPOINTS (Requires API Key)
# ============================================================================

@app.route('/api/news/top', methods=['GET'])
def get_top_news():
    """Fetch top news headlines"""
    category = request.args.get('category', 'business')
    
    if NEWS_API_KEY == 'YOUR_NEWS_API_KEY':
        return jsonify({
            'success': False,
            'error': 'News API key not configured',
            'message': 'Please set NEWS_API_KEY environment variable'
        }), 401
    
    try:
        url = 'https://newsapi.org/v2/top-headlines'
        params = {
            'category': category,
            'apiKey': NEWS_API_KEY,
            'pageSize': 20
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        articles = [
            {
                'id': f"article-{i}",
                'title': article['title'],
                'description': article['description'],
                'content': article.get('content', ''),
                'author': article.get('author', 'Unknown'),
                'source': article['source']['name'],
                'url': article['url'],
                'imageUrl': article.get('urlToImage', ''),
                'publishedAt': article['publishedAt'],
                'category': category
            }
            for i, article in enumerate(data.get('articles', []))
        ]
        
        return jsonify({
            'success': True,
            'data': articles,
            'source': 'News API'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================================
# MACHINE LEARNING ENDPOINTS
# ============================================================================

@app.route('/api/ml/forecast', methods=['POST'])
def forecast_gdp():
    """Forecast GDP using linear regression"""
    try:
        data = request.json
        years = data.get('years', [])
        values = data.get('values', [])
        forecast_years = data.get('forecast_years', 5)
        
        if not years or not values:
            return jsonify({'success': False, 'error': 'Invalid data'}), 400
        
        # Prepare data for sklearn
        X = np.array(years).reshape(-1, 1)
        y = np.array(values)
        
        # Train model
        model = LinearRegression()
        model.fit(X, y)
        
        # Make predictions
        last_year = max(years)
        future_years = np.array([last_year + i for i in range(1, forecast_years + 1)]).reshape(-1, 1)
        predictions = model.predict(future_years)
        
        # Calculate R² score
        r2_score = model.score(X, y)
        
        forecast_data = [
            {'year': int(year[0]), 'value': float(pred)}
            for year, pred in zip(future_years, predictions)
        ]
        
        return jsonify({
            'success': True,
            'data': {
                'forecasts': forecast_data,
                'r2_score': r2_score,
                'slope': float(model.coef_[0]),
                'intercept': float(model.intercept_)
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'apis_configured': {
            'fred': FRED_API_KEY != 'YOUR_FRED_API_KEY',
            'alpha_vantage': ALPHA_VANTAGE_API_KEY != 'YOUR_ALPHA_VANTAGE_API_KEY',
            'news': NEWS_API_KEY != 'YOUR_NEWS_API_KEY'
        }
    })


@app.route('/api/test-all', methods=['GET'])
def test_all_apis():
    """Test all API connections"""
    results = {}
    
    # Test World Bank
    try:
        response = requests.get(
            'https://api.worldbank.org/v2/country/USA/indicator/NY.GDP.MKTP.CD',
            params={'date': '2020:2023', 'format': 'json'},
            timeout=5
        )
        results['worldbank'] = {'status': 'working' if response.ok else 'error', 'code': response.status_code}
    except:
        results['worldbank'] = {'status': 'error', 'code': 0}
    
    # Test CoinGecko
    try:
        response = requests.get('https://api.coingecko.com/api/v3/ping', timeout=5)
        results['coingecko'] = {'status': 'working' if response.ok else 'error', 'code': response.status_code}
    except:
        results['coingecko'] = {'status': 'error', 'code': 0}
    
    # Test Exchange Rates
    try:
        response = requests.get('https://api.exchangerate-api.com/v4/latest/USD', timeout=5)
        results['exchangerates'] = {'status': 'working' if response.ok else 'error', 'code': response.status_code}
    except:
        results['exchangerates'] = {'status': 'error', 'code': 0}
    
    return jsonify({
        'success': True,
        'results': results,
        'timestamp': datetime.now().isoformat()
    })


# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
