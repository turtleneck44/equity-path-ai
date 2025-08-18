import { TrendingUp, TrendingDown, Minus, Brain, Target, Zap, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AIPredictionData {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  timeframe: string;
  confidence: number;
  trend: "bullish" | "bearish" | "neutral";
  changePercent: number;
  explanation?: string;
  aiPowered?: boolean;
  technicalIndicators?: {
    rsi: string;
    macd: string;
    movingAverages: string;
  };
  volatility?: string;
  sentiment?: string;
}

interface AIPredictionCardProps {
  data: AIPredictionData;
  className?: string;
}

export function AIPredictionCard({ data, className }: AIPredictionCardProps) {
  const {
    symbol,
    currentPrice,
    predictedPrice,
    timeframe,
    confidence,
    trend,
    changePercent,
    explanation,
    aiPowered = true,
    technicalIndicators,
    volatility,
    sentiment
  } = data;

  const isPositive = changePercent > 0;
  const isNeutral = Math.abs(changePercent) < 0.5;

  const getTrendIcon = () => {
    if (isNeutral) return Minus;
    return isPositive ? TrendingUp : TrendingDown;
  };

  const getTrendColor = () => {
    if (isNeutral) return "text-muted-foreground";
    return isPositive ? "text-green-600" : "text-red-600";
  };

  const getTrendBg = () => {
    if (isNeutral) return "bg-muted/20";
    return isPositive ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20";
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={cn("relative overflow-hidden border-2", className)}>
      {/* AI Badge */}
      {aiPowered && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <Brain className="w-3 h-3 mr-1" />
            ChatGPT-4
          </Badge>
        </div>
      )}

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      
      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{symbol}</h3>
              <p className="text-sm text-muted-foreground">AI Forecast • {timeframe}</p>
            </div>
          </div>
          <Badge 
            variant="outline"
            className={cn(
              "px-3 py-1 font-medium border-2",
              getTrendBg(),
              getTrendColor()
            )}
          >
            {trend.charAt(0).toUpperCase() + trend.slice(1)}
          </Badge>
        </div>

        {/* Price Prediction */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold text-foreground">
                ${currentPrice.toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">AI Target</p>
              <p className={cn(
                "text-2xl font-bold",
                getTrendColor()
              )}>
                ${predictedPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Change Indicator */}
          <div className={cn(
            "flex items-center justify-center p-4 rounded-xl border",
            getTrendBg()
          )}>
            <TrendIcon className={cn("w-6 h-6 mr-2", getTrendColor())} />
            <span className={cn("text-lg font-bold", getTrendColor())}>
              {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              ({isPositive ? "+" : ""}${(predictedPrice - currentPrice).toFixed(2)})
            </span>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">AI Confidence</span>
            </div>
            <span className="text-sm font-bold text-primary">{confidence}%</span>
          </div>
          <Progress 
            value={confidence} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Confidence</span>
            <span>High Confidence</span>
          </div>
        </div>

        {/* Technical Indicators */}
        {technicalIndicators && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Technical Signals</h4>
              <div className="space-y-1 text-xs">
                <div><span className="text-muted-foreground">RSI:</span> {technicalIndicators.rsi}</div>
                <div><span className="text-muted-foreground">MACD:</span> {technicalIndicators.macd}</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Market Analysis</h4>
              <div className="space-y-1 text-xs">
                <div><span className="text-muted-foreground">Volatility:</span> {volatility}</div>
                <div><span className="text-muted-foreground">Sentiment:</span> {sentiment}</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Explanation */}
        {explanation && (
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-foreground">ChatGPT Analysis</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg">
              {explanation}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start space-x-2 text-xs text-muted-foreground bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-200 dark:border-amber-800/30">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="text-amber-800 dark:text-amber-400">AI Disclaimer:</strong> This prediction is generated by ChatGPT-4 and should not be considered as financial advice. 
            Always conduct your own research before making investment decisions.
          </div>
        </div>
      </div>
    </Card>
  );
}