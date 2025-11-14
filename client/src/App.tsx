import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import Journal from "@/pages/journal";
import Insights from "@/pages/insights";
import Assistant from "@/pages/assistant";
import Strategies from "@/pages/strategies";
import Connect from "@/pages/connect";
import Therapists from "@/pages/therapists";
import Landing from "@/pages/landing";
import About from "@/pages/about";
import SignUp from "@/pages/signup";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route component={Landing} />
    </Switch>
  );
}

function ProtectedRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/journal" component={Journal} />
      <Route path="/insights" component={Insights} />
      <Route path="/assistant" component={Assistant} />
      <Route path="/strategies" component={Strategies} />
      <Route path="/connect" component={Connect} />
      <Route path="/therapists" component={Therapists} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <PublicRouter />
      </div>
    );
  }

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground" data-testid="text-user-name">
                {user?.displayName}
              </span>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <ProtectedRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
