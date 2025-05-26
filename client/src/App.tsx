import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AuthPage from "@/pages/AuthPage";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";

function AppRoutes() {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    // Check if user is already authenticated on mount
    checkAuth();
  }, [checkAuth]);

  // If not authenticated, show only the auth page
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={AuthPage} />
        <Route path="/auth/verify" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // If authenticated, show the main app
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AppRoutes />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
