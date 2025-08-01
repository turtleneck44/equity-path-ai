import { Home, TrendingUp, Brain, Bookmark, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: TrendingUp, label: "Forecast", path: "/forecast" },
  { icon: Brain, label: "Insights", path: "/insights" },
  { icon: Bookmark, label: "Watchlist", path: "/watchlist" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-card border-t border-border/50 backdrop-blur-lg">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center min-h-[60px] px-3 py-2 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-gradient-primary text-primary-foreground shadow-luxury"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "w-6 h-6 mb-1 transition-transform duration-300",
                    isActive && "animate-glow-pulse"
                  )}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}