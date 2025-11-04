import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, formatRating } from "@/lib/utils";
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  ArrowLeft, 
  Clock,
  Shield,
  Award,
  User
} from "lucide-react";
import type { Artisan } from "@shared/schema";

export default function ArtisanProfile() {
  const [match, params] = useRoute("/artisan/:id");
  const artisanId = params?.id;

  const { data: artisan, isLoading, error } = useQuery<Artisan>({
    queryKey: [`/api/artisans/${artisanId}`],
    enabled: !!artisanId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-24 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-6">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-gold/30 bg-zinc-900 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-gold/50" />
              <h1 className="text-2xl font-bold text-white mb-4">Artisan Not Found</h1>
              <p className="text-white mb-6">The artisan profile you're looking for doesn't exist.</p>
              <Link href="/">
                <Button className="bg-gold hover:bg-gold-dark text-black">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="border-gold/30 bg-zinc-900">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {artisan.profileImage || getInitials(artisan.firstName, artisan.lastName)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start flex-wrap gap-3 mb-3">
                      <h1 className="text-2xl font-bold text-white">
                        {artisan.firstName} {artisan.lastName}
                      </h1>
                      
                      {/* Tier Badges */}
                      {artisan.subscriptionTier === 'unverified' && (
                        <Badge variant="outline" className="text-white/80 border-white/40 bg-zinc-800/50">
                          <User className="w-3 h-3 mr-1" />
                          Unverified
                        </Badge>
                      )}
                      
                      {(artisan.subscriptionTier === 'verified' || artisan.subscriptionTier === 'premium') && (
                        <Badge variant="outline" className="text-gold border-gold/60 bg-gold/20">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      
                      {artisan.subscriptionTier === 'premium' && (
                        <Badge variant="outline" className="text-purple-400 border-purple-500 bg-purple-900/30">
                          <Star className="w-3 h-3 mr-1" />
                          Premium Marketing
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-lg text-gold font-medium mb-4">
                      {artisan.services.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 fill-gold text-gold" />
                        <span className="font-semibold text-lg text-white">{formatRating(artisan.rating || "0")}</span>
                        <span className="text-white/80">({artisan.reviewCount} reviews)</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-white/80">
                        <MapPin className="w-4 h-4" />
                        <span>{artisan.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-white/80">
                        <Clock className="w-4 h-4" />
                        <span>{artisan.yearsExperience} years experience</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="border-gold/30 bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <User className="w-5 h-5 text-gold" />
                  <span>About</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">{artisan.description}</p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="border-gold/30 bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Award className="w-5 h-5 text-gold" />
                  <span>Services Offered</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {artisan.services.map((service) => (
                    <Badge key={service} className="px-3 py-1 bg-gold/20 text-gold border-gold/40">
                      {service.charAt(0).toUpperCase() + service.slice(1)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section - Only for Verified and Premium tiers */}
            {(artisan.subscriptionTier === 'verified' || artisan.subscriptionTier === 'premium') ? (
              <Card className="border-gold/30 bg-zinc-900">
                <CardHeader>
                  <CardTitle className="text-white">Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-white">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gold/50" />
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gold/30 bg-zinc-900">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gold/50" />
                  <h3 className="font-semibold text-white mb-2">Reviews Available for Verified Artisans</h3>
                  <p className="text-sm text-white/80">
                    This artisan needs to upgrade to a verified tier to access the customer review system.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="border-gold/30 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-white">Contact {artisan.firstName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gold hover:bg-gold-dark text-black" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                
                <Button variant="outline" className="w-full border-gold/40 text-white hover:bg-gold/20" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                
                <Separator className="bg-gold/20" />
                
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium text-white">{artisan.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium text-white break-all">{artisan.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-gold/30 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-gold text-gold" />
                    <span className="font-semibold text-white">{formatRating(artisan.rating || "0")}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Reviews</span>
                  <span className="font-semibold text-white">{artisan.reviewCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Experience</span>
                  <span className="font-semibold text-white">{artisan.yearsExperience} years</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Verified</span>
                  <Badge variant={artisan.verified ? "default" : "secondary"} className={artisan.verified ? "bg-green-600" : "bg-gray-700"}>
                    {artisan.verified ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
