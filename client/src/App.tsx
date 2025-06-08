import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import ArtisanProfile from "@/pages/ArtisanProfile";
import ArtisanRegistration from "@/pages/ArtisanRegistration";
import ContactUs from "@/pages/ContactUs";
import BulkArtisanImport from "@/pages/BulkArtisanImport";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchResults} />
      <Route path="/artisan/:id" component={ArtisanProfile} />
      <Route path="/register-artisan" component={ArtisanRegistration} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/bulk-import" component={BulkArtisanImport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
