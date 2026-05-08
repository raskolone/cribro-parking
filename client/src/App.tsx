import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Auth from "./pages/Auth";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import MyReservations from "./pages/MyReservations";
import Dashboard from "./pages/Dashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/search"} component={SearchResults} />
      <Route path={"/auth"} component={Auth} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/owner"} component={OwnerDashboard} />
      <Route path={"/book/:id"} component={Booking} />
      <Route path={"/confirmation/:id"} component={Confirmation} />
      <Route path={"/my-reservations"} component={MyReservations} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
