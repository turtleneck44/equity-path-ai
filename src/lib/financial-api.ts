// Mock API service for financial data - simulates real Yahoo Finance API
interface AssetData {
  symbol: string;
  name: string;
  currentPrice: number;
  historicalData: PriceDataPoint[];
  marketCap?: number;
  volume?: number;
  change24h: number;
  changePercent: number;
}

interface PriceDataPoint {
  date: string;
  price: number;
  high?: number;
  low?: number;
  volume?: number;
  predicted?: boolean;
}

// Real-world asset data with realistic price movements
const ASSET_DATABASE: Record<string, Omit<AssetData, 'historicalData' | 'currentPrice' | 'change24h' | 'changePercent'>> = {
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    marketCap: 3000000000000,
    volume: 89543210
  },
  'TSLA': {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    marketCap: 850000000000,
    volume: 45234567
  },
  'GOOGL': {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    marketCap: 1800000000000,
    volume: 32156789
  },
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    marketCap: 2800000000000,
    volume: 38764521
  },
  'AMZN': {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    marketCap: 1600000000000,
    volume: 29876543
  },
  'BTC-USD': {
    symbol: 'BTC-USD',
    name: 'Bitcoin',
    marketCap: 850000000000,
    volume: 28456789
  },
  'ETH-USD': {
    symbol: 'ETH-USD',
    name: 'Ethereum',
    marketCap: 280000000000,
    volume: 18734562
  },
  'SPY': {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    marketCap: 450000000000,
    volume: 67234891
  },
  'QQQ': {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    marketCap: 220000000000,
    volume: 34567892
  },
  'NVDA': {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    marketCap: 1800000000000,
    volume: 56789123
  }
};

// Base prices for realistic scaling
const BASE_PRICES: Record<string, number> = {
  'AAPL': 185.50,
  'TSLA': 248.75,
  'GOOGL': 2650.40,
  'MSFT': 415.30,
  'AMZN': 3380.75,
  'BTC-USD': 43250.00,
  'ETH-USD': 2480.60,
  'SPY': 485.20,
  'QQQ': 385.80,
  'NVDA': 875.45
};

// Generate realistic historical data with proper market behavior
function generateHistoricalData(symbol: string, days: number = 30): PriceDataPoint[] {
  const basePrice = BASE_PRICES[symbol] || 100;
  const data: PriceDataPoint[] = [];
  let currentPrice = basePrice;
  
  // Market characteristics based on asset type
  const volatility = symbol.includes('BTC') || symbol.includes('ETH') ? 0.04 : 
                   symbol === 'TSLA' ? 0.03 : 0.02;
  
  const trend = Math.random() > 0.5 ? 0.001 : -0.0005; // Slight trend bias
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add market noise with mean reversion
    const randomChange = (Math.random() - 0.5) * volatility;
    const meanReversion = (basePrice - currentPrice) * 0.01;
    const trendComponent = trend;
    
    const totalChange = randomChange + meanReversion + trendComponent;
    currentPrice = Math.max(currentPrice * (1 + totalChange), 0.01);
    
    // Generate realistic high/low based on daily volatility
    const dailyVolatility = Math.random() * volatility * 0.5;
    const high = currentPrice * (1 + dailyVolatility);
    const low = currentPrice * (1 - dailyVolatility);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000
    });
  }
  
  return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Advanced prediction algorithm using multiple factors
function generateAIPrediction(historicalData: PriceDataPoint[], timeframeDays: number) {
  if (historicalData.length < 5) {
    throw new Error('Insufficient historical data for prediction');
  }
  
  const prices = historicalData.map(d => d.price);
  const currentPrice = prices[prices.length - 1];
  
  // Technical indicators
  const sma5 = prices.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const sma10 = prices.slice(-10).reduce((a, b) => a + b, 0) / 10;
  const priceChange = (currentPrice - prices[prices.length - 2]) / prices[prices.length - 2];
  
  // Momentum indicator
  const momentum = prices.slice(-3).reduce((sum, price, i) => {
    if (i === 0) return 0;
    return sum + (price - prices[prices.length - 3 + i - 1]);
  }, 0) / 2;
  
  // Volatility calculation
  const volatility = Math.sqrt(
    prices.slice(-10).reduce((sum, price) => {
      const avgPrice = prices.slice(-10).reduce((a, b) => a + b, 0) / 10;
      return sum + Math.pow(price - avgPrice, 2);
    }, 0) / 10
  );
  
  // Trend analysis
  const trendDirection = sma5 > sma10 ? 1 : -1;
  const trendStrength = Math.abs(sma5 - sma10) / currentPrice;
  
  // Base prediction using multiple factors
  let basePrediction = currentPrice;
  
  // Apply trend factor
  basePrediction += (trendDirection * trendStrength * currentPrice * 0.1);
  
  // Apply momentum
  basePrediction += momentum * 0.5;
  
  // Add time decay factor (longer predictions are less reliable)
  const timeDecay = Math.pow(0.95, timeframeDays);
  const confidenceBase = 85 * timeDecay;
  
  // Adjust for volatility
  const volatilityAdjustment = Math.max(0.1, 1 - (volatility / currentPrice * 10));
  const finalConfidence = Math.min(95, Math.max(55, confidenceBase * volatilityAdjustment));
  
  // Add realistic noise for longer predictions
  const predictionNoise = (Math.random() - 0.5) * volatility * timeframeDays * 0.1;
  const predictedPrice = Math.max(0.01, basePrediction + predictionNoise);
  
  const changePercent = ((predictedPrice - currentPrice) / currentPrice) * 100;
  
  // Determine trend
  let trend: 'bullish' | 'bearish' | 'neutral';
  if (Math.abs(changePercent) < 1) {
    trend = 'neutral';
  } else if (changePercent > 0) {
    trend = 'bullish';
  } else {
    trend = 'bearish';
  }
  
  // Generate explanation
  const explanation = generatePredictionExplanation(
    trendDirection, 
    momentum, 
    volatility, 
    timeframeDays, 
    trend
  );
  
  return {
    predictedPrice: Number(predictedPrice.toFixed(2)),
    confidence: Math.round(finalConfidence),
    changePercent: Number(changePercent.toFixed(2)),
    trend,
    explanation,
    technicalFactors: {
      sma5: Number(sma5.toFixed(2)),
      sma10: Number(sma10.toFixed(2)),
      momentum: Number(momentum.toFixed(2)),
      volatility: Number(volatility.toFixed(2))
    }
  };
}

function generatePredictionExplanation(
  trendDirection: number, 
  momentum: number, 
  volatility: number, 
  timeframeDays: number, 
  trend: string
): string {
  const trendWord = trendDirection > 0 ? "upward" : "downward";
  const momentumWord = momentum > 0 ? "positive" : "negative";
  const volatilityLevel = volatility > 5 ? "high" : volatility > 2 ? "moderate" : "low";
  
  const explanations = [
    `Our AI model predicts ${trend} movement based on ${trendWord} trend analysis and ${momentumWord} momentum indicators.`,
    `Technical analysis shows ${volatilityLevel} volatility with ${trendWord} price pressure over the ${timeframeDays}-day horizon.`,
    `Moving average convergence and ${momentumWord} momentum signals suggest ${trend} bias in the near term.`,
    `Machine learning algorithms identify ${trend} patterns with ${volatilityLevel} volatility considerations.`
  ];
  
  return explanations[Math.floor(Math.random() * explanations.length)] + 
         ` Key factors include price action analysis, volume patterns, and historical ${timeframeDays}-day performance metrics.`;
}

// Main API functions
export const FinancialAPI = {
  // Search for assets
  async searchAsset(symbol: string): Promise<AssetData | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const upperSymbol = symbol.toUpperCase();
        const assetInfo = ASSET_DATABASE[upperSymbol];
        
        if (!assetInfo) {
          resolve(null);
          return;
        }
        
        const historicalData = generateHistoricalData(upperSymbol, 30);
        const currentPrice = historicalData[historicalData.length - 1].price;
        const previousPrice = historicalData[historicalData.length - 2].price;
        const change24h = currentPrice - previousPrice;
        const changePercent = (change24h / previousPrice) * 100;
        
        resolve({
          ...assetInfo,
          historicalData,
          currentPrice,
          change24h: Number(change24h.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2))
        });
      }, 800 + Math.random() * 1200); // Realistic API delay
    });
  },

  // Generate AI prediction
  async generatePrediction(
    symbol: string, 
    historicalData: PriceDataPoint[], 
    timeframeDays: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const prediction = generateAIPrediction(historicalData, timeframeDays);
          resolve({
            symbol,
            timeframe: `${timeframeDays} day${timeframeDays > 1 ? 's' : ''}`,
            ...prediction
          });
        } catch (error) {
          reject(error);
        }
      }, 2000 + Math.random() * 2000); // AI processing time
    });
  },

  // Get extended historical data
  async getExtendedHistory(symbol: string, days: number = 90): Promise<PriceDataPoint[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateHistoricalData(symbol, days));
      }, 500);
    });
  },

  // Get market insights (mock)
  async getMarketInsights(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const insights = [
          {
            id: Date.now(),
            type: 'market_trend',
            title: 'Technology Sector Momentum',
            description: 'Strong buying pressure detected in major tech stocks with AI-driven growth expectations.',
            confidence: 82,
            timeframe: '5 days',
            impact: 'bullish',
            assets: ['AAPL', 'GOOGL', 'MSFT'],
            timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
          }
        ];
        resolve(insights);
      }, 600);
    });
  }
};

// Utility functions
export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }
  return price.toFixed(2);
};

export const formatChange = (change: number, isPercent: boolean = false): string => {
  const formatted = isPercent ? change.toFixed(2) + '%' : change.toFixed(2);
  return change >= 0 ? `+${formatted}` : formatted;
};

export const getAssetType = (symbol: string): 'stock' | 'crypto' | 'etf' => {
  if (symbol.includes('-USD')) return 'crypto';
  if (['SPY', 'QQQ', 'ICLN', 'PBW'].includes(symbol)) return 'etf';
  return 'stock';
};