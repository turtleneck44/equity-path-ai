import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, Plus, TrendingUp, TrendingDown, Bell, Trash2, AlertTriangle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetSearch } from "@/components/ui/asset-search";
import { FinancialAPI, formatPrice, formatChange } from "@/lib/financial-api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  change24h: number;
  prediction: {
    direction: "up" | "down" | "neutral";
    confidence: number;
    targetPrice: number;
    lastUpdated: string;
  };
  alerts: {
    priceAbove?: number;
    priceBelow?: number;
    predictionChange?: boolean;
  };
  addedAt: string;
}

const STORAGE_KEY = 'equitypath_watchlist';

// Load watchlist from localStorage
const loadWatchlist = (): WatchlistItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save watchlist to localStorage
const saveWatchlist = (watchlist: WatchlistItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  } catch (error) {
    console.error('Failed to save watchlist:', error);
  }
};

// Generate mock prediction for watchlist item
const generateMockPrediction = (currentPrice: number) => {
  const change = (Math.random() - 0.5) * 0.1; // ±5% max change
  const targetPrice = currentPrice * (1 + change);
  const confidence = Math.floor(Math.random() * 30) + 65; // 65-95% confidence
  
  let direction: "up" | "down" | "neutral";
  if (Math.abs(change) < 0.01) direction = "neutral";
  else direction = change > 0 ? "up" : "down";
  
  return {
    direction,
    confidence,
    targetPrice: Number(targetPrice.toFixed(2)),
    lastUpdated: new Date().toISOString()
  };
};

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load watchlist on component mount
  useEffect(() => {
    const savedWatchlist = loadWatchlist();
    setWatchlist(savedWatchlist);
  }, []);

  // Save watchlist whenever it changes
  useEffect(() => {
    saveWatchlist(watchlist);
  }, [watchlist]);

  const handleAddAsset = async (symbol: string, assetData: any) => {
    try {
      // Check if asset already exists
      if (watchlist.find(item => item.symbol === symbol)) {
        toast.error(`${symbol} is already in your watchlist`);
        return;
      }

      const newAsset: WatchlistItem = {
        id: Date.now().toString(),
        symbol: assetData.symbol,
        name: assetData.name,
        currentPrice: assetData.currentPrice,
        changePercent: assetData.changePercent,
        change24h: assetData.change24h,
        prediction: generateMockPrediction(assetData.currentPrice),
        alerts: {},
        addedAt: new Date().toISOString()
      };
      
      setWatchlist(prev => [...prev, newAsset]);
      setIsAddingAsset(false);
      toast.success(`Added ${assetData.name} to watchlist`);
    } catch (error) {
      toast.error("Failed to add asset to watchlist");
      console.error('Add asset error:', error);
    }
  };

  const handleSearchStart = () => {
    setIsLoading(true);
  };

  const handleRemoveAsset = (id: string) => {
    const item = watchlist.find(w => w.id === id);
    setWatchlist(watchlist.filter(item => item.id !== id));
    toast.success(`Removed ${item?.symbol} from watchlist`);
  };

  const handleRefreshPredictions = async () => {
    if (watchlist.length === 0) return;
    
    setIsRefreshing(true);
    toast.info("Refreshing AI predictions...");
    
    try {
      // Simulate refreshing predictions for all assets
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setWatchlist(prev => prev.map(item => ({
        ...item,
        prediction: generateMockPrediction(item.currentPrice)
      })));
      
      toast.success("All predictions updated successfully!");
    } catch (error) {
      toast.error("Failed to refresh predictions");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getPredictionIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingDown;
      default:
        return AlertTriangle;
    }
  };

  const getPredictionColor = (direction: string) => {
    switch (direction) {
      case "up":
        return "text-chart-bull";
      case "down":
        return "text-chart-bear";
      default:
        return "text-chart-neutral";
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
          <div className="bg-gradient-primary p-3 rounded-xl shadow-glow">
            <Bookmark className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Watchlist</h1>
            <p className="text-muted-foreground">Track your favorite assets with AI-powered insights</p>
          </div>
          {watchlist.length > 0 && (
            <Button
              onClick={handleRefreshPredictions}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              <span>Refresh</span>
            </Button>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        {!isAddingAsset ? (
          <Button
            onClick={() => setIsAddingAsset(true)}
            className="w-full luxury-button py-4 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Asset to Watchlist
          </Button>
        ) : (
          <Card className="luxury-card p-4">
            <AssetSearch 
              onSearch={handleAddAsset}
              onSearchStart={handleSearchStart}
              isLoading={isLoading}
              className="mb-4"
            />
            <Button
              variant="outline"
              onClick={() => setIsAddingAsset(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Watchlist Items */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {watchlist.length === 0 ? (
          <Card className="luxury-card p-8 text-center">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Your Watchlist is Empty</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking assets to get AI-powered insights and alerts
            </p>
            <Button
              onClick={() => setIsAddingAsset(true)}
              className="luxury-button"
            >
              Add Your First Asset
            </Button>
          </Card>
        ) : (
          watchlist.map((item, index) => {
            const PredictionIcon = getPredictionIcon(item.prediction.direction);
            const isPositive = item.changePercent > 0;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="luxury-card p-6 hover:shadow-glow transition-all duration-300">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{item.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{item.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Alert indicators */}
                        {(item.alerts.priceAbove || item.alerts.priceBelow || item.alerts.predictionChange) && (
                          <div className="flex items-center space-x-1">
                            <Bell className="w-4 h-4 text-secondary" />
                            <span className="text-xs text-secondary">Active</span>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAsset(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Price Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-bold text-foreground">
                          ${formatPrice(item.currentPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">24h Change</p>
                        <div className="flex items-center space-x-2">
                          <span className={cn(
                            "text-xl font-bold",
                            isPositive ? "text-chart-bull" : "text-chart-bear"
                          )}>
                            {formatChange(item.changePercent, true)}
                          </span>
                          <span className={cn(
                            "text-sm",
                            isPositive ? "text-chart-bull" : "text-chart-bear"
                          )}>
                            ({formatChange(item.change24h)})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Prediction */}
                    <div className="space-y-3 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PredictionIcon className={cn("w-5 h-5", getPredictionColor(item.prediction.direction))} />
                          <span className="font-medium text-foreground">AI Prediction</span>
                        </div>
                        <Badge className={cn(
                          "px-2 py-1",
                          item.prediction.direction === "up" ? "bg-chart-bull/10 text-chart-bull" :
                          item.prediction.direction === "down" ? "bg-chart-bear/10 text-chart-bear" :
                          "bg-chart-neutral/10 text-chart-neutral"
                        )}>
                          {item.prediction.direction}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Target Price: </span>
                          <span className="font-medium text-foreground">
                            ${formatPrice(item.prediction.targetPrice)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence: </span>
                          <span className="font-medium text-primary">
                            {item.prediction.confidence}%
                          </span>
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div className="text-xs text-muted-foreground">
                        Updated: {new Date(item.prediction.lastUpdated).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Alerts */}
                    {(item.alerts.priceAbove || item.alerts.priceBelow || item.alerts.predictionChange) && (
                      <div className="space-y-2 pt-3 border-t border-border/50">
                        <h4 className="text-sm font-medium text-foreground flex items-center">
                          <Bell className="w-4 h-4 mr-1 text-secondary" />
                          Active Alerts
                        </h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {item.alerts.priceAbove && (
                            <div>• Alert when price rises above ${item.alerts.priceAbove}</div>
                          )}
                          {item.alerts.priceBelow && (
                            <div>• Alert when price falls below ${item.alerts.priceBelow}</div>
                          )}
                          {item.alerts.predictionChange && (
                            <div>• Alert on AI prediction changes</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Portfolio Summary */}
      {watchlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="luxury-card p-6 border border-primary/20">
            <h3 className="text-lg font-bold text-foreground mb-4">Watchlist Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Assets Tracked</p>
                <p className="text-2xl font-bold text-foreground">{watchlist.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bullish Predictions</p>
                <p className="text-2xl font-bold text-chart-bull">
                  {watchlist.filter(item => item.prediction.direction === "up").length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-secondary">
                  {watchlist.filter(item => 
                    item.alerts.priceAbove || item.alerts.priceBelow || item.alerts.predictionChange
                  ).length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Watchlist;