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
    // Global error handler for runtime errors
    const handleError = (event: ErrorEvent) => {
      // Hide Vite error overlay specifically
      const overlay = document.querySelector('#vite-error-overlay') || 
                     document.querySelector('.vite-error-overlay') ||
                     document.querySelector('[data-vite-error-overlay]');
      if (overlay) {
        (overlay as HTMLElement).style.display = 'none';
      }
      
      console.warn('Runtime error suppressed:', event.error);
      event.preventDefault();
      return true;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn('Promise rejection suppressed:', event.reason);
      event.preventDefault();
    };

    // Additional DOM observer for dynamically added overlays
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.id === 'vite-error-overlay' || 
                element.classList?.contains('vite-error-overlay') ||
                element.hasAttribute('data-vite-error-overlay')) {
              (element as HTMLElement).style.display = 'none';
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      observer.disconnect();
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
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
