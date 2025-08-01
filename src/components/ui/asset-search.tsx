import { useState } from "react";
import { Search, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { FinancialAPI, getAssetType } from "@/lib/financial-api";

interface AssetSearchProps {
  onSearch: (symbol: string, assetData: any) => void;
  onSearchStart?: () => void;
  isLoading?: boolean;
  className?: string;
}

const popularAssets = [
  { symbol: "AAPL", name: "Apple Inc.", type: "stock" },
  { symbol: "TSLA", name: "Tesla Inc.", type: "stock" },
  { symbol: "GOOGL", name: "Alphabet Inc.", type: "stock" },
  { symbol: "MSFT", name: "Microsoft Corporation", type: "stock" },
  { symbol: "BTC-USD", name: "Bitcoin", type: "crypto" },
  { symbol: "ETH-USD", name: "Ethereum", type: "crypto" },
  { symbol: "SPY", name: "SPDR S&P 500", type: "etf" },
  { symbol: "NVDA", name: "NVIDIA Corporation", type: "stock" },
];

export function AssetSearch({ onSearch, onSearchStart, isLoading = false, className }: AssetSearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      await performSearch(searchValue.trim().toUpperCase());
    }
  };

  const performSearch = async (symbol: string) => {
    setError(null);
    setIsSearching(true);
    onSearchStart?.();

    try {
      const assetData = await FinancialAPI.searchAsset(symbol);
      
      if (!assetData) {
        setError(`Asset "${symbol}" not found. Please check the symbol and try again.`);
        return;
      }

      onSearch(symbol, assetData);
      setSearchValue("");
    } catch (err) {
      setError("Failed to fetch asset data. Please try again.");
      console.error('Asset search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSelect = async (symbol: string) => {
    await performSearch(symbol);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Error Alert */}
      {error && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter stock symbol or crypto (e.g., AAPL, BTC-USD)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-12 pr-24 h-14 text-lg bg-gradient-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
            disabled={isLoading || isSearching}
          />
          <Button
            type="submit"
            disabled={!searchValue.trim() || isLoading || isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 luxury-button h-10 px-6"
          >
            {isLoading || isSearching ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              "Analyze"
            )}
          </Button>
        </div>
      </form>

      {/* Popular Assets */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Popular Assets
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {popularAssets.map((asset) => (
            <Button
              key={asset.symbol}
              variant="outline"
              onClick={() => handleQuickSelect(asset.symbol)}
              disabled={isLoading || isSearching}
              className="luxury-card h-auto p-4 flex flex-col items-start space-y-2 hover:bg-muted/50 border-border/50 transition-all duration-300 hover:shadow-card"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-foreground">{asset.symbol}</span>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  getAssetType(asset.symbol) === "stock" && "bg-secondary",
                  getAssetType(asset.symbol) === "crypto" && "bg-primary",
                  getAssetType(asset.symbol) === "etf" && "bg-chart-neutral"
                )} />
              </div>
              <span className="text-sm text-muted-foreground text-left">{asset.name}</span>
              <div className="flex items-center text-xs text-primary">
                <DollarSign className="w-3 h-3 mr-1" />
                {getAssetType(asset.symbol).toUpperCase()}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Search Tips */}
      <div className="luxury-card p-4 border border-border/50">
        <h4 className="font-medium text-foreground mb-2">Search Tips:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• For stocks: Use ticker symbols (AAPL, TSLA, GOOGL)</li>
          <li>• For crypto: Add -USD suffix (BTC-USD, ETH-USD)</li>
          <li>• For ETFs: Use fund symbols (SPY, QQQ, VOO)</li>
        </ul>
      </div>
    </div>
  );
}