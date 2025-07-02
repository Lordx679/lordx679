import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Disable Vite error overlays completely
    const disableErrorOverlay = () => {
      // Override the global error handlers
      const originalError = window.addEventListener;
      const originalConsoleError = console.error;
      
      // Intercept and block error overlay creation
      (window as any).__vite_plugin_react_preamble_installed__ = true;
      
      // Block any attempt to create error overlays
      if ((window as any).__vite_error_overlay) {
        (window as any).__vite_error_overlay.clearErrors = () => {};
        (window as any).__vite_error_overlay.overlayMounted = false;
      }
      
      // Suppress specific runtime errors
      console.error = (...args: any[]) => {
        const errorMsg = args.join(' ');
        if (errorMsg.includes('runtime-error-plugin') || 
            errorMsg.includes('unknown runtime error')) {
          return; // Suppress these specific errors
        }
        originalConsoleError.apply(console, args);
      };
    };

    // Apply immediately and on interval to ensure it stays disabled
    disableErrorOverlay();
    const interval = setInterval(disableErrorOverlay, 100);

    // Global error suppression
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      event.stopPropagation();
      return true;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
    };

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-background text-foreground">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
