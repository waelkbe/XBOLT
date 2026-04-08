import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BookShipment from "./pages/BookShipment";
import TrackShipment from "./pages/TrackShipment";
import MyShipments from "./pages/MyShipments";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import RewardsPage from "./pages/RewardsPage";
import ShipmentDetails from "./pages/ShipmentDetails";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ShippingGuide from "./pages/ShippingGuide";
import InsuranceInfo from "./pages/InsuranceInfo";
import PriceCalculator from "./pages/PriceCalculator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/book" component={BookShipment} />
      <Route path="/track" component={TrackShipment} />
      <Route path="/track/:trackingNumber" component={TrackShipment} />
      <Route path="/my-shipments" component={MyShipments} />
      <Route path="/shipment/:id" component={ShipmentDetails} />
      <Route path="/rewards" component={RewardsPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/employee" component={EmployeeDashboard} />
      <Route path="/about" component={AboutUs} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsAndConditions} />
      <Route path="/shipping-guide" component={ShippingGuide} />
      <Route path="/insurance-info" component={InsuranceInfo} />
      <Route path="/price-calculator" component={PriceCalculator} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <Router />
          <WhatsAppButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
