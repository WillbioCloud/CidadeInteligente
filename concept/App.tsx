import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Comercios from "./pages/Comercios";
import Gamificacao from "./pages/Gamificacao";
import Mapa from "./pages/Mapa";
import HorariosOnibus from "./pages/HorariosOnibus";
import Conta from "./pages/Conta";
import NotFound from "./pages/NotFound";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { UserProvider } from "@/contexts/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/comercios" element={<><Comercios /><BottomNavigation /></>} />
              <Route path="/gamificacao" element={<><Gamificacao /><BottomNavigation /></>} />
              <Route path="/mapa" element={<><Mapa /><BottomNavigation /></>} />
              <Route path="/horarios-onibus" element={<><HorariosOnibus /><BottomNavigation /></>} />
              <Route path="/conta" element={<><Conta /><BottomNavigation /></>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
