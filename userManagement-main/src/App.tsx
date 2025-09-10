import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ Import your components
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import {UserDashboard} from "@/components/users/UserDashboard";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Index />} />

          {/* Auth Pages */}
          <Route
            path="/login"
            element={<LoginForm onSwitchToRegister={() => (window.location.href = "/register")} />}
          />
          <Route path="/register" element={<RegisterForm onSwitchToLogin={function (): void {
            throw new Error("Function not implemented.");
          } } />} />

          {/* Dashboard Page */}
          <Route path="/dashboard" element={<UserDashboard currentUser={{
            email: "",
            username: ""
          }} onLogout={function (): void {
            throw new Error("Function not implemented.");
          } } />} />

          {/* Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
