import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitials, formatRating } from "@/lib/utils";
import { MapPin, Star, Phone, Mail, ArrowLeft, Info } from "lucide-react";
import type { Artisan } from "@shared/schema";

export default function SearchResults() {
  const [location, navigate] = useLocation();
  
  // Use window.location.search to get the actual URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  console.log("Full window location:", window.location.href);
  console.log("Window search:", window.location.search);
  console.log("All params:", Array.from(searchParams.entries()));
  
  const service = searchParams.get("service") || "";
  const searchLocation = searchParams.get("location") || "";
  const tier = searchParams.get("tier") || "basic";

  // Debug logging
  console.log("Search params:", { service, searchLocation, tier });
  console.log("Query enabled:", !!(service && searchLocation));
  console.log("Query key:", [`/api/search?service=${service}&location=${searchLocation}&tier=${tier}`]);

  const { data: searchResults, isLoading, error } = useQuery<{
    artisans: Artisan[];
    tier: string;
    limit: number;
    count: number;
  }>({
    queryKey: [`/api/search?service=${service}&location=${searchLocation}&tier=${tier}`],
    enabled: !!(service && searchLocation),
    retry: 3,
    retryDelay: 1000,
  });

  // Debug search results
  console.log("Search results:", searchResults);
  console.log("Is loading:", isLoading);
  console.log("Error:", error);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    console.error("Search error:", error);
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Search Error</h1>
            <p className="text-gray-300 mb-4">Unable to perform search. Please try again.</p>
            <p className="text-sm text-red-600 mb-6">Error: {error?.message || "Unknown error"}</p>
            <Link href="/">
              <Button className="bg-gold hover:bg-gold-dark text-black cosmic-glow-static">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!searchResults && !isLoading && !error) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">No Results</h1>
            <p className="text-gray-300 mb-4">No search results found for "{service}" in "{searchLocation}".</p>
            <p className="text-sm text-gray-400 mb-6">Try adjusting your search terms or location.</p>
            <Link href="/">
              <Button className="bg-gold hover:bg-gold-dark text-black cosmic-glow-static">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const artisans = searchResults?.artisans || [];
  const resultTier = searchResults?.tier || 'basic';
  const count = searchResults?.count || 0;

  // If we have search results but no artisans, show appropriate message
  if (searchResults && artisans.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">No Artisans Found</h1>
            <p className="text-gray-300 mb-4">No {service} found in {searchLocation}.</p>
            <p className="text-sm text-gray-400 mb-6">Try searching in nearby areas or different services.</p>
            <Link href="/">
              <Button className="bg-gold hover:bg-gold-dark text-black cosmic-glow-static">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black-soft mb-2">
                {service.charAt(0).toUpperCase() + service.slice(1)} in {searchLocation}
              </h1>
              <p className="text-gray-600">
                Found {count} {count === 1 ? 'artisan' : 'artisans'} 
                <Badge variant={resultTier === 'basic' ? 'outline' : 'default'} className={`ml-2 ${resultTier === 'basic' ? 'border-gray-400 text-gray-600' : 'bg-gold text-black'}`}>
                  {resultTier.toUpperCase()} TIER - {resultTier === 'basic' ? 'UNVERIFIED' : 'VERIFIED'} ARTISANS
                </Badge>
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {artisans.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-black-soft mb-4">
              No artisans found
            </h2>
            <p className="text-gray-600 mb-6">
              Try expanding your search area or selecting a different service.
            </p>
            <Link href="/">
              <Button className="bg-gold hover:bg-gold-dark text-black cosmic-glow-static">
                Try New Search
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {artisans.map((artisan: Artisan) => (
              <Card key={artisan.id} className={`hover:shadow-lg transition-all cosmic-glow-static ${artisan.verified ? 'border-2 border-green-500/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {artisan.profileImage || getInitials(artisan.firstName, artisan.lastName)}
                      </div>
                      
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-black-soft">
                            {artisan.firstName} {artisan.lastName}
                          </h3>
                          {artisan.verified ? (
                            <Badge variant="outline" className="text-green-600 border-green-500 bg-green-50 text-sm px-3 py-1">
                              ✓ Verified
                            </Badge>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="text-gray-600 border-gray-400 bg-gray-50 text-sm px-3 py-1 flex items-center gap-1">
                                    Unverified <Info className="w-3 h-3" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>This artisan's profile is self-reported and has not been manually verified by Skills Connect.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        
                        <p className="text-gold-dark font-medium mb-2">
                          {artisan.services.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                        </p>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-gold text-gold" />
                            <span className="font-medium">{formatRating(artisan.rating || "0")}</span>
                            <span className="text-gray-500">({artisan.reviewCount} reviews)</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{artisan.location}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{artisan.description}</p>
                        
                        <div className="text-sm text-gray-500">
                          {artisan.yearsExperience} years of experience
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <Link href={`/artisan/${artisan.id}`}>
                        <Button className="bg-gold hover:bg-gold-dark text-black cosmic-glow-static">
                          View Profile
                        </Button>
                      </Link>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Upgrade prompt for basic tier */}
        {resultTier === 'basic' && (
          <Card className="mt-8 bg-gradient-to-r from-gold/10 to-gold-dark/10 border-gold/30">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-black-soft mb-2">
                Want verified artisans?
              </h3>
              <p className="text-gray-600 mb-4">
                Upgrade to Premium to see up to 5 ID & qualification verified artisans with detailed profiles and reviews.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  className="bg-gold hover:bg-gold-dark text-black cosmic-glow-static"
                  onClick={() => navigate(`/search?service=${service}&location=${searchLocation}&tier=premium`)}
                >
                  Premium - R99
                </Button>
                <Button 
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-black cosmic-selection"
                  onClick={() => navigate(`/search?service=${service}&location=${searchLocation}&tier=enterprise`)}
                >
                  Enterprise - R299
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tier selection for other tiers */}
        {resultTier !== 'basic' && (
          <Card className="mt-8 bg-gray-50 border-gray-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-black-soft mb-2">
                Try different search tiers
              </h3>
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/search?service=${service}&location=${searchLocation}&tier=basic`)}
                >
                  Basic (Free)
                </Button>
                {resultTier !== 'premium' && (
                  <Button 
                    className="bg-gold hover:bg-gold-dark text-black"
                    onClick={() => navigate(`/search?service=${service}&location=${searchLocation}&tier=premium`)}
                  >
                    Premium - R99
                  </Button>
                )}
                {resultTier !== 'enterprise' && (
                  <Button 
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-black"
                    onClick={() => navigate(`/search?service=${service}&location=${searchLocation}&tier=enterprise`)}
                  >
                    Enterprise - R299
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Sticky CTA Banner for Artisans */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gold to-gold-dark shadow-lg border-t-2 border-gold-dark z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex-1">
              <p className="text-black font-semibold text-sm sm:text-base">
                Are you a skilled artisan? Get listed for free!
              </p>
            </div>
            <Link href="/artisan">
              <Button className="bg-black hover:bg-gray-800 text-gold font-bold shadow-md hover:shadow-lg transition-all">
                Join as Artisan
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
