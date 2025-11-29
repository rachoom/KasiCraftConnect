import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  ArrowLeft, 
  Clock,
  Shield,
  Award,
  User,
  Images
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
          <Card className="border border-green/30 bg-black max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-gold/50" />
              <h1 className="text-2xl font-bold text-white mb-4">Artisan Not Found</h1>
              <p className="text-white mb-6">The artisan profile you're looking for doesn't exist.</p>
              <Link href="/">
                <Button className="bg-green hover:bg-green-dark text-white">
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
        <Link href="/profiles">
          <Button variant="outline" className="mb-6 border-green/30 text-gold hover:bg-gold/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Artisans
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="border border-green/30 bg-black">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 overflow-hidden">
                    {artisan.profileImage ? (
                      <img 
                        src={artisan.profileImage} 
                        alt={`${artisan.firstName} ${artisan.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(artisan.firstName, artisan.lastName)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start flex-wrap gap-3 mb-3">
                      <h1 className="text-2xl font-bold text-white">
                        {artisan.firstName} {artisan.lastName}
                      </h1>
                      
                      {/* Tier Badges */}
                      {artisan.subscriptionTier === 'unverified' && (
                        <Badge variant="outline" className="text-white/80 border-green/30 bg-zinc-800/50">
                          <User className="w-3 h-3 mr-1" />
                          Unverified
                        </Badge>
                      )}
                      
                      {(artisan.subscriptionTier === 'verified' || artisan.subscriptionTier === 'premium') && (
                        <Badge variant="outline" className="text-gold border-green/30 bg-gold/20">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      
                      {artisan.subscriptionTier === 'premium' && (
                        <Badge variant="outline" className="text-gold border-green/30 bg-gold/20">
                          <Award className="w-3 h-3 mr-1" />
                          Premium Marketing
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-lg text-gold font-medium mb-4">
                      {artisan.services.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center space-x-1 text-white/80">
                        <MapPin className="w-4 h-4 text-gold" />
                        <span>{artisan.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-white/80">
                        <Clock className="w-4 h-4 text-gold" />
                        <span>{artisan.yearsExperience}+ years experience</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="border border-green/30 bg-black">
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
            <Card className="border border-green/30 bg-black">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Award className="w-5 h-5 text-gold" />
                  <span>Services Offered</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {artisan.services.map((service) => (
                    <Badge key={service} className="px-3 py-1 bg-gold/20 text-gold border-green/30">
                      {service.charAt(0).toUpperCase() + service.slice(1)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio - Proof of Work */}
            {artisan.portfolio && artisan.portfolio.length > 0 && (
              <Card className="border border-green/30 bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Images className="w-5 h-5 text-gold" />
                    <span>Portfolio - Proof of Work</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {artisan.portfolio.map((imageUrl, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg border border-gold/30 cursor-pointer" data-testid={`portfolio-preview-${index}`}>
                        <img
                          src={imageUrl}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-40 object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="border border-green/30 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Contact {artisan.firstName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href={`tel:${artisan.phone}`} className="w-full block">
                  <Button className="w-full bg-green hover:bg-green-dark text-white" size="lg" data-testid="button-call-now">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </a>
                
                <a href={`https://wa.me/${artisan.phone.replace(/\D/g, '')}?text=Hi%20${artisan.firstName}%2C%20I%20found%20your%20profile%20on%20Skills%20Connect%20and%20would%20like%20to%20discuss%20your%20services.`} className="w-full block" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-2 border-gold text-gold hover:bg-gold/20 hover:border-gold-dark" size="lg" data-testid="button-whatsapp-message">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message on WhatsApp
                  </Button>
                </a>
                
                <Separator className="bg-gold/20" />
                
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium text-white">{artisan.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="font-medium text-white">{artisan.yearsExperience}+ years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border border-green/30 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Experience</span>
                  <span className="font-semibold text-white">{artisan.yearsExperience}+ years</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Verified</span>
                  <Badge variant={artisan.verified ? "default" : "secondary"} className={artisan.verified ? "bg-green" : "bg-gray-700"}>
                    {artisan.verified ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Subscription</span>
                  <Badge className="bg-gold/20 text-gold border-green/30">
                    {artisan.subscriptionTier === 'unverified' && 'Free'}
                    {artisan.subscriptionTier === 'verified' && 'Verified'}
                    {artisan.subscriptionTier === 'premium' && 'Premium'}
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
