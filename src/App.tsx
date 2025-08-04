import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileNav } from "@/components/ui/mobile-nav";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Forecast from "./pages/Forecast";
import Insights from "./pages/Insights";
import Watchlist from "./pages/Watchlist";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 transition-colors duration-500">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
