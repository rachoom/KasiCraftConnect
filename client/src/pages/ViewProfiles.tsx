import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeInSection from "@/components/FadeInSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { User, MapPin, Phone, Mail, Briefcase, Star, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";

const serviceOptions = [
  { id: "builders", label: "Builder" },
  { id: "plumbers", label: "Plumber" },
  { id: "electricians", label: "Electrician" },
  { id: "painters", label: "Painter" },
  { id: "carpenters", label: "Carpenter" },
  { id: "roofers", label: "Roofer" },
  { id: "gardeners", label: "Gardener" },
  { id: "cleaners", label: "Cleaner" },
  { id: "landscapers", label: "Landscaper" },
];

export default function ViewProfiles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { data: artisans = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/artisans"],
  });

  // Filter artisans based on search criteria
  const filteredArtisans = artisans.filter((artisan: any) => {
    const matchesSearch = !searchTerm || 
      `${artisan.firstName} ${artisan.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = !filterService || filterService === 'all' || (artisan.services && artisan.services.includes(filterService));
    
    const matchesLocation = !filterLocation || 
      (artisan.location && artisan.location.toLowerCase().includes(filterLocation.toLowerCase()));
    
    const matchesStatus = !filterStatus || filterStatus === 'all' || artisan.approvalStatus === filterStatus;
    
    return matchesSearch && matchesService && matchesLocation && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green text-white';
      case 'rejected': return 'bg-red-900 text-white';
      default: return 'bg-zinc-700 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-3 h-3" />;
      case 'rejected': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-8">
              <Link href="/">
                <Button variant="outline" className="mb-4 border border-green/30 text-gold hover:bg-gold/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-white mb-2">
                Artisan Profiles
              </h1>
              <p className="text-lg text-white/90">
                Browse and search through all registered artisan profiles
              </p>
            </div>

            {/* Search and Filter Section */}
            <Card className="mb-8 shadow-lg border border-green/30 bg-black">
              <CardHeader>
                <CardTitle className="text-white">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* REORDERED: 1. Filter by service */}
                  <div>
                    <Select value={filterService} onValueChange={setFilterService}>
                      <SelectTrigger className="bg-zinc-800 border border-green/30 text-white placeholder:text-white/60">
                        <SelectValue placeholder="Filter by service" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border border-green/30 text-gold">
                        <SelectItem value="all" className="text-gold">All Services</SelectItem>
                        {serviceOptions.map((service) => (
                          <SelectItem key={service.id} value={service.id} className="text-gold">
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* REORDERED: 2. Filter by location */}
                  <div>
                    <Input
                      placeholder="Filter by location..."
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full bg-zinc-800 border border-green/30 text-white placeholder:text-white/60"
                    />
                  </div>
                  
                  {/* REORDERED: 3. Filter by status */}
                  <div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="bg-zinc-800 border border-green/30 text-white placeholder:text-white/60">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border border-green/30 text-gold">
                        <SelectItem value="all" className="text-gold">All Statuses</SelectItem>
                        <SelectItem value="pending" className="text-gold">Pending</SelectItem>
                        <SelectItem value="approved" className="text-gold">Approved</SelectItem>
                        <SelectItem value="rejected" className="text-gold">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* REORDERED: 4. Search by name or email */}
                  <div>
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-zinc-800 border border-green/30 text-white placeholder:text-white/60"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-white">
                {isLoading ? "Loading..." : `Showing ${filteredArtisans.length} of ${artisans.length} profiles`}
              </p>
            </div>

            {/* Artisan Profiles Grid */}
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredArtisans.length === 0 ? (
              <Card className="shadow-lg border-green/30 bg-black">
                <CardContent className="p-8 text-center">
                  <User className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No profiles found
                  </h3>
                  <p className="text-white/80">
                    Try adjusting your search criteria or filters
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArtisans.map((artisan: any) => (
                  <Card key={artisan.id} className="shadow-lg border-green/30 bg-black hover:shadow-xl transition-shadow hover:border-green/30">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header with name and status */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gold">
                              {artisan.firstName} {artisan.lastName}
                            </h3>
                            <div className="flex items-center text-white/80 text-sm">
                              <Mail className="w-4 h-4 mr-1" />
                              {artisan.email}
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(artisan.approvalStatus)} flex items-center gap-1`}>
                            {getStatusIcon(artisan.approvalStatus)}
                            {artisan.approvalStatus === 'approved' ? 'Approved' : 
                             artisan.approvalStatus === 'rejected' ? 'Rejected' : 'Pending'}
                          </Badge>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2">
                          {artisan.phone && (
                            <div className="flex items-center text-white/80 text-sm">
                              <Phone className="w-4 h-4 mr-2" />
                              {artisan.phone}
                            </div>
                          )}
                          {artisan.location && (
                            <div className="flex items-center text-white/80 text-sm">
                              <MapPin className="w-4 h-4 mr-2" />
                              {artisan.location}
                            </div>
                          )}
                        </div>

                        {/* Services */}
                        {artisan.services && artisan.services.length > 0 && (
                          <div>
                            <div className="flex items-center text-white text-sm mb-2">
                              <Briefcase className="w-4 h-4 mr-2" />
                              Services
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {artisan.services.slice(0, 3).map((service: string) => {
                                const serviceLabel = serviceOptions.find(s => s.id === service)?.label || service;
                                return (
                                  <Badge key={service} variant="outline" className="text-xs text-gold border-green/30">
                                    {serviceLabel}
                                  </Badge>
                                );
                              })}
                              {artisan.services.length > 3 && (
                                <Badge variant="outline" className="text-xs text-gold border-green/30">
                                  +{artisan.services.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {artisan.yearsExperience && (
                          <div className="text-sm text-white">
                            <strong>{artisan.yearsExperience}</strong> years of experience
                          </div>
                        )}

                        {/* Description */}
                        {artisan.description && (
                          <div className="text-sm text-white/80 line-clamp-2">
                            {artisan.description}
                          </div>
                        )}

                        {/* Verification Status */}
                        <div className="flex items-center justify-between pt-2 border-t border-green/30">
                          <div className="flex items-center text-sm">
                            {artisan.verified ? (
                              <span className="flex items-center text-green">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="flex items-center text-yellow-600">
                                <Clock className="w-4 h-4 mr-1" />
                                Unverified
                              </span>
                            )}
                          </div>
                          
                          <Link href={`/artisan/${artisan.id}`}>
                            <Button size="sm" className="bg-green hover:bg-green-dark text-white">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </FadeInSection>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}