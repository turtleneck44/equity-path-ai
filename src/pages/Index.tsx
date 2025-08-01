import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Brain, Shield, Zap } from "lucide-react";
import { AssetSearch } from "@/components/ui/asset-search";
import { PriceChart } from "@/components/charts/price-chart";
import { PredictionCard } from "@/components/ui/prediction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FinancialAPI, formatPrice, formatChange } from "@/lib/financial-api";
import { toast } from "sonner";

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

const features = [
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description: "Advanced machine learning models analyze market patterns to forecast price movements with high accuracy."
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Live market data and technical indicators provide instant insights into asset performance and trends."
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Comprehensive risk analysis helps you make informed decisions with confidence scores and explanations."
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description: "Get immediate AI-generated explanations for market movements and prediction rationales."
  }
];

const Index = () => {
  const [selectedAssetData, setSelectedAssetData] = useState<AssetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [isGeneratingPrediction, setIsGeneratingPrediction] = useState(false);

  const handleAssetSearch = async (symbol: string, assetData: AssetData) => {
    try {
      setSelectedAssetData(assetData);
      setPredictionData(null);
      
      toast.success(`Successfully loaded ${assetData.name} (${symbol})`);
      
      // Auto-generate a quick 3-day prediction
      setTimeout(() => {
        handleGeneratePrediction(3);
      }, 500);
      
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

  const handleGeneratePrediction = async (timeframeDays: number = 3) => {
    if (!selectedAssetData) return;
    
    setIsGeneratingPrediction(true);
    setPredictionData(null);
    
    try {
      const prediction = await FinancialAPI.generatePrediction(
        selectedAssetData.symbol,
        selectedAssetData.historicalData,
        timeframeDays
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
      
      toast.success("AI prediction generated successfully!");
      
    } catch (error) {
      toast.error("Failed to generate prediction");
      console.error('Prediction error:', error);
    } finally {
      setIsGeneratingPrediction(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4 pt-8 pb-12"
      >
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-luxury">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            EquityPath AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
            Professional-grade AI forecasting for stocks and cryptocurrency markets
          </p>
        </div>

        {/* Asset Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
        <AssetSearch 
          onSearch={handleAssetSearch} 
          onSearchStart={handleSearchStart}
          isLoading={isLoading} 
        />
        </motion.div>

        {/* Live Asset Data and Prediction */}
        {selectedAssetData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Asset Information Card */}
            <Card className="luxury-card p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{selectedAssetData.symbol}</h3>
                    <p className="text-muted-foreground">{selectedAssetData.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-foreground">
                      ${formatPrice(selectedAssetData.currentPrice)}
                    </p>
                    <p className={`text-lg font-medium ${
                      selectedAssetData.changePercent >= 0 ? 'text-chart-bull' : 'text-chart-bear'
                    }`}>
                      {formatChange(selectedAssetData.changePercent, true)} 
                      <span className="text-sm ml-1">
                        ({formatChange(selectedAssetData.change24h)})
                      </span>
                    </p>
                  </div>
                </div>
                
                {selectedAssetData.marketCap && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="font-medium text-foreground">
                        ${(selectedAssetData.marketCap / 1e12).toFixed(2)}T
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="font-medium text-foreground">
                        {(selectedAssetData.volume! / 1e6).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <PriceChart 
              data={selectedAssetData.historicalData}
              symbol={selectedAssetData.symbol}
              showPrediction={!!predictionData}
            />
            
            {/* Generate Prediction Button */}
            {!predictionData && !isGeneratingPrediction && (
              <Button
                onClick={() => handleGeneratePrediction(3)}
                className="w-full luxury-button py-4 text-lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                Generate AI Prediction
              </Button>
            )}
            
            {/* Prediction Loading */}
            {isGeneratingPrediction && (
              <Card className="luxury-card p-6 border border-primary/20">
                <div className="flex items-center justify-center space-x-3">
                  <div className="bg-gradient-primary p-3 rounded-xl animate-glow-pulse">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-foreground">Generating AI Prediction...</h4>
                    <p className="text-sm text-muted-foreground">Analyzing market patterns and technical indicators</p>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Prediction Results */}
            {predictionData && (
              <PredictionCard data={predictionData} />
            )}
          </motion.div>
        )}


        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Why Choose EquityPath AI?
            </h2>
            <p className="text-muted-foreground">
              Cutting-edge technology meets professional-grade financial analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="luxury-card p-6 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-secondary p-3 rounded-xl">
                      <feature.icon className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="luxury-card p-8 bg-gradient-card">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Ready to Transform Your Trading?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of professionals using AI-powered insights for smarter investment decisions
            </p>
            <Button className="luxury-button px-8 py-3 text-lg">
              Start Analyzing
              <TrendingUp className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
