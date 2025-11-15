// News API Integration
// Multiple news sources for comprehensive coverage

const NEWS_API_KEY = 'YOUR_NEWS_API_KEY';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export const NEWS_CATEGORIES = [
  'business',
  'economics',
  'markets',
  'finance',
  'technology',
  'politics',
  'world',
];

export const NEWS_SOURCES = {
  FINANCIAL_TIMES: 'financial-times',
  BLOOMBERG: 'bloomberg',
  WALL_STREET_JOURNAL: 'the-wall-street-journal',
  REUTERS: 'reuters',
  CNBC: 'cnbc',
  BBC_NEWS: 'bbc-news',
  CNN: 'cnn',
  THE_ECONOMIST: 'the-economist',
};

// Mock news data generator
function generateMockNews(category, count = 20) {
  const headlines = {
    business: [
      'Tech Giants Report Record Quarterly Earnings',
      'Global Supply Chain Shows Signs of Recovery',
      'Major Merger Deal Announced in Healthcare Sector',
      'Startup Raises $500M in Series D Funding',
      'E-commerce Sales Surge 45% Year-over-Year',
    ],
    economics: [
      'Federal Reserve Signals Potential Rate Cut',
      'GDP Growth Exceeds Expectations in Q3',
      'Inflation Rates Show Downward Trend',
      'Labor Market Remains Strong Despite Concerns',
      'Central Banks Coordinate Global Economic Policy',
    ],
    markets: [
      'Stock Markets Hit All-Time Highs',
      'Emerging Markets Show Strong Performance',
      'Bond Yields Rise on Economic Optimism',
      'Commodities Rally on Supply Concerns',
      'Tech Stocks Lead Market Gains',
    ],
    finance: [
      'Digital Banking Adoption Accelerates',
      'Cryptocurrency Regulation Framework Proposed',
      'ESG Investing Reaches New Heights',
      'Fintech Companies Disrupt Traditional Banking',
      'Private Equity Activity Surges',
    ],
  };

  const sources = ['Bloomberg', 'Reuters', 'Financial Times', 'CNBC', 'Wall Street Journal', 'The Economist'];
  const authors = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Jennifer Martinez'];
  
  const categoryHeadlines = headlines[category] || headlines.business;
  const articles = [];

  for (let i = 0; i < count; i++) {
    const headlineIndex = i % categoryHeadlines.length;
    const publishedDate = new Date();
    publishedDate.setHours(publishedDate.getHours() - Math.floor(Math.random() * 48));

    articles.push({
      id: `article-${category}-${i}`,
      title: categoryHeadlines[headlineIndex],
      description: `Comprehensive analysis of ${categoryHeadlines[headlineIndex].toLowerCase()}. Market experts weigh in on the latest developments and future implications for global markets.`,
      content: `Full article content about ${categoryHeadlines[headlineIndex]}. This would contain the complete story with detailed analysis, expert opinions, and market implications. The article explores various aspects including economic impact, market reactions, and future outlook.`,
      author: authors[Math.floor(Math.random() * authors.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      url: `https://example.com/article/${i}`,
      imageUrl: `https://picsum.photos/seed/${category}-${i}/800/450`,
      publishedAt: publishedDate.toISOString(),
      category,
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
    });
  }

  return articles;
}

export async function fetchEconomicNews(category = 'business', searchQuery, sources) {
  try {
    // In production, use real API:
    // const url = `${NEWS_API_BASE_URL}/top-headlines?category=${category}&apiKey=${NEWS_API_KEY}`;
    // const response = await fetch(url);
    // const data = await response.json();
    
    // For demo, return mock data
    const mockArticles = generateMockNews(category);
    
    // Filter by search query if provided
    if (searchQuery) {
      return mockArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return mockArticles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function fetchBreakingNews() {
  try {
    const breakingHeadlines = [
      'BREAKING: Major Economic Policy Shift Announced',
      'ALERT: Stock Markets React to Surprise Fed Decision',
      'DEVELOPING: Global Trade Agreement Reached',
      'URGENT: Tech Sector Faces New Regulatory Scrutiny',
    ];

    return breakingHeadlines.map((headline, i) => ({
      id: `breaking-${i}`,
      title: headline,
      description: 'Breaking news story developing...',
      content: 'Full breaking news content...',
      author: 'News Desk',
      source: 'Reuters',
      url: `https://example.com/breaking/${i}`,
      imageUrl: `https://picsum.photos/seed/breaking-${i}/800/450`,
      publishedAt: new Date().toISOString(),
      category: 'breaking',
      sentiment: 'neutral',
    }));
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    throw error;
  }
}

export async function searchNews(query) {
  try {
    // In production: const url = `${NEWS_API_BASE_URL}/everything?q=${query}&apiKey=${NEWS_API_KEY}`;
    return generateMockNews('business', 10).filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
}

export async function fetchTrendingTopics() {
  return [
    'Federal Reserve',
    'Interest Rates',
    'Inflation',
    'Stock Market',
    'Tech Earnings',
    'GDP Growth',
    'Employment Data',
    'Trade Policy',
  ];
}
