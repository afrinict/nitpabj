import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { ThemeProvider } from "next-themes";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import MembersDirectory from "@/pages/members-directory";
import ExecutiveCommittee from "@/pages/executive-committee";
import Ethics from "@/pages/ethics";
import Finance from "@/pages/finance";
import Applications from "@/pages/applications";
import Profile from "@/pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/members" component={MembersDirectory} />
      <ProtectedRoute path="/executive-committee" component={ExecutiveCommittee} />
      <ProtectedRoute path="/ethics" component={Ethics} />
      <ProtectedRoute path="/finance" component={Finance} />
      <ProtectedRoute path="/applications" component={Applications} />
      <ProtectedRoute path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
