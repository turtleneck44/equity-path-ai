import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Calendar, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { AssetSearch } from "@/components/ui/asset-search";
import { PriceChart } from "@/components/charts/price-chart";
import { PredictionCard } from "@/components/ui/prediction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const timeframeOptions = [
  { value: "1d", label: "1 Day", days: 1 },
  { value: "2d", label: "2 Days", days: 2 },
  { value: "3d", label: "3 Days", days: 3 },
  { value: "7d", label: "7 Days", days: 7 },
];

const mockHistoricalData = [
  { date: "2024-01-01", price: 150.00 },
  { date: "2024-01-02", price: 152.50 },
  { date: "2024-01-03", price: 148.75 },
  { date: "2024-01-04", price: 155.20 },
  { date: "2024-01-05", price: 158.90 },
  { date: "2024-01-06", price: 161.45 },
];

const generatePredictionData = (currentPrice: number, timeframe: string) => {
  const random = (min: number, max: number) => Math.random() * (max - min) + min;
  const days = parseInt(timeframe.replace('d', ''));
  
  // Generate slightly different predictions based on timeframe
  const volatility = days * 0.02; // More volatility for longer timeframes
  const baseChange = random(-0.05, 0.08); // Slight bullish bias
  const finalChange = baseChange + random(-volatility, volatility);
  
  const predictedPrice = currentPrice * (1 + finalChange);
  const confidence = Math.max(60, Math.min(95, 80 - (days * 3) + random(-10, 10)));
  
  return {
    predictedPrice: Math.max(0, predictedPrice),
    changePercent: finalChange * 100,
    confidence: Math.round(confidence),
    trend: finalChange > 0.01 ? "bullish" : finalChange < -0.01 ? "bearish" : "neutral" as const
  };
};

const Forecast = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("3d");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);

  const currentPrice = 161.45; // Mock current price

  const handleAssetSearch = async (symbol: string) => {
    setIsLoading(true);
    setSelectedAsset(symbol);
    setPredictionData(null);
    
    // Simulate fetching historical data
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleGenerateForecast = async () => {
    if (!selectedAsset) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const prediction = generatePredictionData(currentPrice, selectedTimeframe);
      const timeframeLabel = timeframeOptions.find(t => t.value === selectedTimeframe)?.label || "3 Days";
      
      setPredictionData({
        symbol: selectedAsset,
        currentPrice,
        predictedPrice: prediction.predictedPrice,
        timeframe: timeframeLabel,
        confidence: prediction.confidence,
        trend: prediction.trend,
        changePercent: prediction.changePercent,
        explanation: `Based on technical analysis and market sentiment, our LSTM model identifies ${prediction.trend} momentum. Key factors include moving average convergence, volume patterns, and historical price action over the ${timeframeLabel.toLowerCase()} horizon.`
      });
      setIsAnalyzing(false);
    }, 3000);
  };

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
          <div className="bg-gradient-secondary p-3 rounded-xl shadow-glow">
            <Brain className="w-6 h-6 text-secondary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Forecast Engine</h1>
        <p className="text-muted-foreground">Generate precise price predictions with advanced machine learning</p>
      </motion.div>

      {/* Asset Search */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <AssetSearch onSearch={handleAssetSearch} isLoading={isLoading} />
      </motion.div>

      {/* Analysis Panel */}
      {selectedAsset && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Historical Chart */}
          <PriceChart 
            data={mockHistoricalData}
            symbol={selectedAsset}
            showPrediction={false}
          />

          {/* Forecast Configuration */}
          <Card className="luxury-card p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Configure Forecast
            </h3>
            
            <div className="space-y-6">
              {/* Timeframe Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Prediction Timeframe
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {timeframeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedTimeframe === option.value ? "default" : "outline"}
                      onClick={() => setSelectedTimeframe(option.value)}
                      className={selectedTimeframe === option.value ? "luxury-button" : ""}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateForecast}
                disabled={isAnalyzing}
                className="w-full luxury-button py-4 text-lg"
              >
                {isAnalyzing ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Analyzing Market Patterns...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Generate AI Forecast
                  </div>
                )}
              </Button>
            </div>
          </Card>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="luxury-card p-6 border border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="bg-gradient-primary p-4 rounded-xl animate-glow-pulse">
                      <Brain className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-foreground">AI Analysis in Progress</h4>
                    <p className="text-sm text-muted-foreground">
                      Processing market data and generating predictions...
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Fetching historical price data",
                      "Analyzing technical indicators",
                      "Processing market sentiment",
                      "Generating price forecast"
                    ].map((step, index) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.7 }}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Prediction Results */}
          {predictionData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PredictionCard data={predictionData} />
            </motion.div>
          )}

          {/* Risk Disclaimer */}
          <Card className="luxury-card p-4 border border-warning/20 bg-warning/5">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-medium text-foreground">Investment Risk Warning</h4>
                <p className="text-sm text-muted-foreground">
                  AI predictions are based on historical data and market patterns. 
                  Past performance does not guarantee future results. Always consult with 
                  financial advisors before making investment decisions.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Forecast;