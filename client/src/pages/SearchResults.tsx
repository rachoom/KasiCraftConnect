import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatRating } from "@/lib/utils";
import { MapPin, Star, Phone, Mail, ArrowLeft } from "lucide-react";
import type { Artisan } from "@shared/schema";

export default function SearchResults() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const service = searchParams.get("service") || "";
  const searchLocation = searchParams.get("location") || "";
  const tier = searchParams.get("tier") || "basic";

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: [`/api/search?service=${service}&location=${searchLocation}&tier=${tier}`],
    enabled: !!(service && searchLocation),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
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

  if (error || !searchResults) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black-soft mb-4">Search Error</h1>
            <p className="text-gray-600 mb-6">Unable to perform search. Please try again.</p>
            <Link href="/">
              <Button className="bg-gold hover:bg-gold-dark text-black">
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

  const { artisans, tier: resultTier, count } = searchResults;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Button className="bg-gold hover:bg-gold-dark text-black">
                Try New Search
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {artisans.map((artisan: Artisan) => (
              <Card key={artisan.id} className="hover:shadow-lg transition-shadow">
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
                          {artisan.verified && (
                            <Badge variant="outline" className="text-gold border-gold">
                              Verified
                            </Badge>
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
                        <Button className="bg-gold hover:bg-gold-dark text-black">
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
        {resultTier === 'basic' && count >= 3 && (
          <Card className="mt-8 bg-gradient-to-r from-gold/10 to-gold-dark/10 border-gold/30">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-black-soft mb-2">
                Want to see more artisans?
              </h3>
              <p className="text-gray-600 mb-4">
                Upgrade to Premium to see up to 5 verified artisans with detailed profiles and reviews.
              </p>
              <Button className="bg-gold hover:bg-gold-dark text-black">
                Upgrade to Premium - R99
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
