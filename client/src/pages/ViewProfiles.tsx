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
import { User, MapPin, Phone, Mail, Briefcase, Star, CheckCircle, XCircle, Clock } from "lucide-react";

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

  const { data: artisans, isLoading } = useQuery({
    queryKey: ["/api/artisans"],
  });

  // Filter artisans based on search criteria
  const filteredArtisans = (artisans || []).filter((artisan: any) => {
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
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
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
    <div className="min-h-screen bg-gray-soft">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black-soft mb-2">
                Artisan Profiles
              </h1>
              <p className="text-lg text-gray-600">
                Browse and search through all registered artisan profiles
              </p>
            </div>

            {/* Search and Filter Section */}
            <Card className="mb-8 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-black-soft">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Select value={filterService} onValueChange={setFilterService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        {serviceOptions.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Input
                      placeholder="Filter by location..."
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">
                {isLoading ? "Loading..." : `Showing ${filteredArtisans.length} of ${(artisans || []).length} profiles`}
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
              <Card className="shadow-lg border-0">
                <CardContent className="p-8 text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No profiles found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or filters
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArtisans.map((artisan: any) => (
                  <Card key={artisan.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header with name and status */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-black-soft">
                              {artisan.firstName} {artisan.lastName}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm">
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
                            <div className="flex items-center text-gray-600 text-sm">
                              <Phone className="w-4 h-4 mr-2" />
                              {artisan.phone}
                            </div>
                          )}
                          {artisan.location && (
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="w-4 h-4 mr-2" />
                              {artisan.location}
                            </div>
                          )}
                        </div>

                        {/* Services */}
                        {artisan.services && artisan.services.length > 0 && (
                          <div>
                            <div className="flex items-center text-gray-700 text-sm mb-2">
                              <Briefcase className="w-4 h-4 mr-2" />
                              Services
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {artisan.services.slice(0, 3).map((service: string) => {
                                const serviceLabel = serviceOptions.find(s => s.id === service)?.label || service;
                                return (
                                  <Badge key={service} variant="outline" className="text-xs">
                                    {serviceLabel}
                                  </Badge>
                                );
                              })}
                              {artisan.services.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{artisan.services.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {artisan.yearsExperience && (
                          <div className="text-sm text-gray-600">
                            <strong>{artisan.yearsExperience}</strong> years of experience
                          </div>
                        )}

                        {/* Description */}
                        {artisan.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {artisan.description}
                          </div>
                        )}

                        {/* Verification Status */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center text-sm">
                            {artisan.verified ? (
                              <span className="flex items-center text-green-600">
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
                            <Button variant="outline" size="sm">
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