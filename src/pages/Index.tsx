import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Brain, Shield, Zap } from "lucide-react";
import { AssetSearch } from "@/components/ui/asset-search";
import { PriceChart } from "@/components/charts/price-chart";
import { PredictionCard } from "@/components/ui/prediction-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock data for demonstration
const mockChartData = [
  { date: "2024-01-01", price: 150.00 },
  { date: "2024-01-02", price: 152.50 },
  { date: "2024-01-03", price: 148.75 },
  { date: "2024-01-04", price: 155.20 },
  { date: "2024-01-05", price: 158.90 },
  { date: "2024-01-06", price: 161.45 },
  { date: "2024-01-07", price: 164.25, predicted: true },
];

const mockPrediction = {
  symbol: "AAPL",
  currentPrice: 161.45,
  predictedPrice: 168.30,
  timeframe: "3 days",
  confidence: 78,
  trend: "bullish" as const,
  changePercent: 4.24,
  explanation: "Our AI model predicts upward movement based on strong earnings momentum, positive technical indicators including RSI divergence above 60, and historically favorable seasonal patterns in January."
};

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
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssetSearch = async (symbol: string) => {
    setIsLoading(true);
    setSelectedAsset(symbol);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
          <AssetSearch onSearch={handleAssetSearch} isLoading={isLoading} />
        </motion.div>

        {/* Demo Chart and Prediction */}
        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <PriceChart 
              data={mockChartData}
              symbol={selectedAsset}
              showPrediction={true}
            />
            
            <PredictionCard data={{
              ...mockPrediction,
              symbol: selectedAsset
            }} />
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
