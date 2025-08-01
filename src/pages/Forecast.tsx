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
import { FinancialAPI } from "@/lib/financial-api";
import { toast } from "sonner";

const timeframeOptions = [
  { value: "1d", label: "1 Day", days: 1 },
  { value: "2d", label: "2 Days", days: 2 },
  { value: "3d", label: "3 Days", days: 3 },
  { value: "7d", label: "7 Days", days: 7 },
];

interface AssetData {
  symbol: string;
  name: string;
  currentPrice: number;
  historicalData: any[];
  change24h: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
}

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
  const [selectedAssetData, setSelectedAssetData] = useState<AssetData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("3d");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);

  const handleAssetSearch = async (symbol: string, assetData: AssetData) => {
    try {
      setSelectedAssetData(assetData);
      setPredictionData(null);
      toast.success(`Successfully loaded ${assetData.name} (${symbol})`);
    } catch (error) {
      toast.error("Failed to load asset data");
      console.error('Asset search error:', error);
    }
  };

  const handleSearchStart = () => {
    setIsLoading(true);
    setSelectedAssetData(null);
    setPredictionData(null);
  };

  const handleGenerateForecast = async () => {
    if (!selectedAssetData) return;
    
    setIsAnalyzing(true);
    setPredictionData(null);
    
    try {
      const days = timeframeOptions.find(t => t.value === selectedTimeframe)?.days || 3;
      
      const prediction = await FinancialAPI.generatePrediction(
        selectedAssetData.symbol,
        selectedAssetData.historicalData,
        days
      );
      
      setPredictionData({
        symbol: selectedAssetData.symbol,
        currentPrice: selectedAssetData.currentPrice,
        predictedPrice: prediction.predictedPrice,
        timeframe: prediction.timeframe,
        confidence: prediction.confidence,
        trend: prediction.trend,
        changePercent: prediction.changePercent,
        explanation: prediction.explanation
      });
      
      toast.success("AI forecast generated successfully!");
      
    } catch (error) {
      toast.error("Failed to generate forecast");
      console.error('Forecast error:', error);
    } finally {
      setIsAnalyzing(false);
    }
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
        <AssetSearch 
          onSearch={handleAssetSearch} 
          onSearchStart={handleSearchStart}
          isLoading={isLoading} 
        />
      </motion.div>

      {/* Analysis Panel */}
      {selectedAssetData && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Historical Chart */}
          <PriceChart 
            data={selectedAssetData.historicalData}
            symbol={selectedAssetData.symbol}
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