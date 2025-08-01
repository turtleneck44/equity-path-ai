import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

interface PriceDataPoint {
  date: string;
  price: number;
  predicted?: boolean;
  high?: number;
  low?: number;
}

interface PriceChartProps {
  data: PriceDataPoint[];
  symbol: string;
  className?: string;
  showPrediction?: boolean;
}

export function PriceChart({ data, symbol, className, showPrediction = false }: PriceChartProps) {
  const formatPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatDate = (value: string) => new Date(value).toLocaleDateString();

  const isPositiveTrend = data.length > 1 && data[data.length - 1].price > data[0].price;

  return (
    <div className={cn("luxury-card rounded-xl p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">{symbol}</h3>
          <p className="text-sm text-muted-foreground">Price Movement</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isPositiveTrend ? "bg-chart-bull" : "bg-chart-bear"
            )} />
            <span className={cn(
              "text-sm font-medium",
              isPositiveTrend ? "text-chart-bull" : "text-chart-bear"
            )}>
              {isPositiveTrend ? "Bullish" : "Bearish"}
            </span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositiveTrend ? "hsl(var(--chart-bull))" : "hsl(var(--chart-bear))"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositiveTrend ? "hsl(var(--chart-bull))" : "hsl(var(--chart-bear))"} 
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--chart-grid))"
              opacity={0.3}
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatPrice}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-card)'
              }}
              labelFormatter={formatDate}
              formatter={(value: number, name: string) => [
                formatPrice(value), 
                name === 'price' ? 'Price' : 'Predicted'
              ]}
            />
            {/* Historical data */}
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositiveTrend ? "hsl(var(--chart-bull))" : "hsl(var(--chart-bear))"}
              strokeWidth={2}
              fill="url(#priceGradient)"
              fillOpacity={1}
              dot={{
                fill: isPositiveTrend ? "hsl(var(--chart-bull))" : "hsl(var(--chart-bear))",
                strokeWidth: 2,
                r: 3
              }}
              activeDot={{
                r: 5,
                stroke: isPositiveTrend ? "hsl(var(--chart-bull))" : "hsl(var(--chart-bear))",
                strokeWidth: 2,
                fill: "hsl(var(--background))"
              }}
            />
            {/* Prediction line if enabled */}
            {showPrediction && (
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{
                  fill: "hsl(var(--primary))",
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                  className: "animate-glow-pulse"
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-4 h-0.5 rounded",
            isPositiveTrend ? "bg-chart-bull" : "bg-chart-bear"
          )} />
          <span className="text-xs text-muted-foreground">Historical</span>
        </div>
        {showPrediction && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-primary rounded" style={{
              backgroundImage: 'repeating-linear-gradient(to right, hsl(var(--primary)) 0, hsl(var(--primary)) 3px, transparent 3px, transparent 8px)'
            }} />
            <span className="text-xs text-muted-foreground">AI Prediction</span>
          </div>
        )}
      </div>
    </div>
  );
}