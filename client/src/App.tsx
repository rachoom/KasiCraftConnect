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
import ArtisanRegistration from "@/pages/ArtisanRegistration";
import ContactUs from "@/pages/ContactUs";
import AdminBulkImport from "@/pages/AdminBulkImport";
import AdminReview from "@/pages/AdminReview";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={() => <PageTransition><Home /></PageTransition>} />
        <Route path="/search" component={() => <PageTransition><SearchResults /></PageTransition>} />
        <Route path="/artisan/:id" component={() => <PageTransition><ArtisanProfile /></PageTransition>} />
        <Route path="/register-artisan" component={() => <PageTransition><ArtisanRegistration /></PageTransition>} />
        <Route path="/contact" component={() => <PageTransition><ContactUs /></PageTransition>} />
        <Route path="/admin/bulk-import" component={() => <PageTransition><AdminBulkImport /></PageTransition>} />
        <Route path="/admin/review" component={() => <PageTransition><AdminReview /></PageTransition>} />
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
        <div className="relative z-10">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
