import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Activity, DollarSign, AlertCircle, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const marketInsights = [
  {
    id: 1,
    type: "market_trend",
    title: "Technology Sector Rally Expected",
    description: "AI models detect strong momentum in FAANG stocks with 82% confidence over the next 5 days.",
    confidence: 82,
    timeframe: "5 days",
    impact: "bullish",
    assets: ["AAPL", "GOOGL", "MSFT", "AMZN"],
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    type: "crypto_alert",
    title: "Bitcoin Consolidation Pattern",
    description: "BTC showing triangle consolidation pattern. Potential breakout expected around $45,000 resistance level.",
    confidence: 75,
    timeframe: "3 days",
    impact: "neutral",
    assets: ["BTC-USD"],
    timestamp: "4 hours ago"
  },
  {
    id: 3,
    type: "risk_warning",
    title: "High Volatility Period Detected",
    description: "Increased market volatility predicted due to upcoming Federal Reserve meeting. Exercise caution with leveraged positions.",
    confidence: 89,
    timeframe: "2 days",
    impact: "bearish",
    assets: ["SPY", "QQQ", "IWM"],
    timestamp: "6 hours ago"
  },
  {
    id: 4,
    type: "opportunity",
    title: "Energy Sector Undervaluation",
    description: "Machine learning models identify potential value opportunities in renewable energy ETFs based on policy shifts.",
    confidence: 71,
    timeframe: "7 days",
    impact: "bullish",
    assets: ["ICLN", "PBW", "QCLN"],
    timestamp: "1 day ago"
  }
];

const aiMetrics = [
  {
    label: "Prediction Accuracy",
    value: "84.7%",
    change: "+2.3%",
    trend: "up",
    description: "7-day rolling average"
  },
  {
    label: "Active Models",
    value: "12",
    change: "+1",
    trend: "up",
    description: "Currently running"
  },
  {
    label: "Data Points Analyzed",
    value: "2.4M",
    change: "+156K",
    trend: "up",
    description: "In the last 24h"
  },
  {
    label: "Market Coverage",
    value: "98.2%",
    change: "0%",
    trend: "neutral",
    description: "Major assets tracked"
  }
];

const getInsightIcon = (type: string) => {
  switch (type) {
    case "market_trend":
      return TrendingUp;
    case "crypto_alert":
      return Activity;
    case "risk_warning":
      return AlertCircle;
    case "opportunity":
      return Star;
    default:
      return Brain;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "bullish":
      return "text-chart-bull bg-chart-bull/10";
    case "bearish":
      return "text-chart-bear bg-chart-bear/10";
    case "neutral":
      return "text-chart-neutral bg-chart-neutral/10";
    default:
      return "text-muted-foreground bg-muted/10";
  }
};

const Insights = () => {
  return (
    <div className="min-h-screen bg-gradient-surface pb-20 px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-primary p-3 rounded-xl shadow-glow">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Market Insights</h1>
        <p className="text-muted-foreground">AI-powered analysis and real-time market intelligence</p>
      </motion.div>

      {/* AI Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-secondary" />
          AI Performance Dashboard
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {aiMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="luxury-card p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <div className={`flex items-center text-xs ${
                      metric.trend === "up" ? "text-chart-bull" : 
                      metric.trend === "down" ? "text-chart-bear" : "text-chart-neutral"
                    }`}>
                      {metric.trend === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> :
                       metric.trend === "down" ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-bold text-foreground flex items-center">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          Latest Market Intelligence
        </h2>

        {marketInsights.map((insight, index) => {
          const IconComponent = getInsightIcon(insight.type);
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="luxury-card p-6 hover:shadow-glow transition-all duration-300">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-secondary p-2 rounded-lg">
                        <IconComponent className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground">{insight.timestamp}</p>
                      </div>
                    </div>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>

                  {/* Metrics */}
                  <div className="flex items-center space-x-6 pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-xs text-muted-foreground">
                        Confidence: <span className="text-primary font-medium">{insight.confidence}%</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span className="text-xs text-muted-foreground">
                        Timeframe: <span className="text-foreground font-medium">{insight.timeframe}</span>
                      </span>
                    </div>
                  </div>

                  {/* Assets */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {insight.assets.map((asset) => (
                      <Badge key={asset} variant="outline" className="text-xs">
                        {asset}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View Detailed Analysis
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* AI Model Status */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <Card className="luxury-card p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-primary" />
              AI Engine Status
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-chart-bull rounded-full animate-pulse" />
              <span className="text-sm text-chart-bull font-medium">Online</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Next market scan:</span>
              <span className="text-sm text-foreground font-medium">2 minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Models updated:</span>
              <span className="text-sm text-foreground font-medium">45 minutes ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Processing queue:</span>
              <span className="text-sm text-foreground font-medium">Empty</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Insights;