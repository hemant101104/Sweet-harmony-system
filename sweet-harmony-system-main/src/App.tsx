import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ✅ JWT auth check
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* AUTH */}
          <Route
            path="/auth"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" />
              ) : (
                <Auth />
              )
            }
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated() ? (
                <Dashboard />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          {/* ADMIN (still protected by backend too) */}
          <Route
            path="/admin"
            element={
              isAuthenticated() ? (
                <Admin />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
