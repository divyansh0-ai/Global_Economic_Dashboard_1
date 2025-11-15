import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, Search, TrendingUp, Clock, ExternalLink, Newspaper, Zap, Globe } from 'lucide-react';
import { fetchEconomicNews, fetchBreakingNews, fetchTrendingTopics, NewsArticle, NEWS_CATEGORIES } from '../lib/apis/news';
import { Button } from './ui/button';

export function EconomicNews() {
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [breakingNews, setBreakingNews] = useState<NewsArticle[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const [newsData, breakingData, trending] = await Promise.all([
          fetchEconomicNews(selectedCategory, searchQuery),
          fetchBreakingNews(),
          fetchTrendingTopics(),
        ]);

        setArticles(newsData);
        setBreakingNews(breakingData);
        setTrendingTopics(trending);
      } catch (err) {
        setError('Failed to load news');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [selectedCategory, searchQuery]);

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Breaking News Ticker */}
      <div className="relative overflow-hidden rounded-xl border-2 border-red-500 bg-gradient-to-r from-red-50 via-orange-50 to-red-50">
        <div className="flex items-center gap-3 p-4">
          <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            <Zap className="w-4 h-4" />
            BREAKING
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {breakingNews.map((news, index) => (
                <span key={index} className="inline-block mx-8 text-sm font-medium text-slate-800">
                  {news.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Trending Topics */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search economic news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg border-2"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-slate-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending:
              </span>
              {trendingTopics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => setSearchQuery(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-2">
          {NEWS_CATEGORIES.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Featured Article */}
              {articles[0] && (
                <Card className="overflow-hidden border-2 border-blue-300 hover:shadow-2xl transition-all">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-auto overflow-hidden group">
                      <img
                        src={articles[0].imageUrl}
                        alt={articles[0].title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-600 text-white">Featured</Badge>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {articles[0].source}
                          </Badge>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(articles[0].publishedAt)}
                          </span>
                          {articles[0].sentiment && (
                            <Badge className={`text-xs ${getSentimentColor(articles[0].sentiment)}`}>
                              {articles[0].sentiment}
                            </Badge>
                          )}
                        </div>
                        <h2 className="text-2xl mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                          {articles[0].title}
                        </h2>
                        <p className="text-slate-600 mb-4">{articles[0].description}</p>
                        <p className="text-sm text-slate-500">By {articles[0].author}</p>
                      </div>
                      <Button className="mt-4 w-full" size="lg">
                        Read Full Article
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(1).map((article) => (
                  <Card
                    key={article.id}
                    className="overflow-hidden hover:shadow-xl transition-all border-2 hover:border-blue-300 group cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {article.sentiment && (
                        <div className="absolute top-3 right-3">
                          <Badge className={getSentimentColor(article.sentiment)}>
                            {article.sentiment}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {article.source}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(article.publishedAt)}
                        </span>
                      </div>
                      <h3 className="mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{article.author}</span>
                        <Button variant="ghost" size="sm">
                          Read More
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
}