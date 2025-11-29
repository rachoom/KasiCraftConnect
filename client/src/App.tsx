import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import CosmicBackground from "@/components/CosmicBackground";
import PageTransition from "@/components/PageTransition";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import ArtisanProfile from "@/pages/ArtisanProfile";
import JoinArtisan from "@/pages/JoinArtisan";
import ArtisanRegistration from "@/pages/ArtisanRegistration";
import ArtisanDashboard from "@/pages/ArtisanDashboard";
import ViewProfiles from "@/pages/ViewProfiles";
import ArtisanLogin from "@/pages/ArtisanLogin";
import ArtisanSubscription from "@/pages/ArtisanSubscription";
import ServiceLanding from "@/pages/ServiceLanding";
import ContactUs from "@/pages/ContactUs";
import AdminBulkImport from "@/pages/AdminBulkImport";
import AdminReview from "@/pages/AdminReview";
import AdminManagement from "@/pages/AdminManagement";
import AdminAds from "@/pages/AdminAds";
import AdminLogin from "@/pages/AdminLogin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={() => <PageTransition><Home /></PageTransition>} />
        <Route path="/search" component={() => <PageTransition><SearchResults /></PageTransition>} />
        <Route path="/artisan" component={() => <PageTransition><JoinArtisan /></PageTransition>} />
        <Route path="/register-artisan" component={() => <PageTransition><ArtisanRegistration /></PageTransition>} />
        <Route path="/artisan/login" component={() => <PageTransition><ArtisanLogin /></PageTransition>} />
        <Route path="/artisan/dashboard" component={() => <PageTransition><ArtisanDashboard /></PageTransition>} />
        <Route path="/artisan/:id" component={() => <PageTransition><ArtisanProfile /></PageTransition>} />
        <Route path="/service/builders" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/service/plumbers" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/service/electricians" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/service/carpenters" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/service/tilers" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/service/cleaners" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/service/landscapers" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/service/mechanics" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/service/painters" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/service/dressmakers" component={() => <PageTransition><ServiceLanding /></PageTransition>} />
        <Route path="/profiles" component={() => <PageTransition><ViewProfiles /></PageTransition>} />
        <Route path="/subscription" component={() => <PageTransition><ArtisanSubscription /></PageTransition>} />
        <Route path="/contact" component={() => <PageTransition><ContactUs /></PageTransition>} />
        <Route path="/admin/login" component={() => <PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/bulk-import" component={() => <PageTransition><AdminBulkImport /></PageTransition>} />
        <Route path="/admin/review" component={() => <PageTransition><AdminReview /></PageTransition>} />
        <Route path="/admin/manage" component={() => <PageTransition><AdminManagement /></PageTransition>} />
        <Route path="/admin/ads" component={() => <PageTransition><AdminAds /></PageTransition>} />
        <Route component={() => <PageTransition><NotFound /></PageTransition>} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CosmicBackground />
        <div className="relative z-10 bg-black text-white min-h-screen">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
