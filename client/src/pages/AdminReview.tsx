import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { MapPin, Star, Phone, Mail, FileText, CheckCircle, XCircle, Clock, Users, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Artisan } from "@shared/schema";

export default function AdminReview() {
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminName, setAdminName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    
    // Verify token is valid
    fetch("/api/admin/verify-token", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => {
      if (!response.ok) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      }
    }).catch(() => {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    });
  }, []);

  const { data: pendingArtisans, isLoading } = useQuery<Artisan[]>({
    queryKey: ["/api/admin/pending-artisans"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/pending-artisans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch pending artisans");
      return response.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approvedBy }: { id: number; approvedBy: string }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/approve-artisan/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approvedBy }),
      });
      if (!response.ok) throw new Error("Failed to approve artisan");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Artisan approved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-artisans"] });
      setSelectedArtisan(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve artisan",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, rejectionReason, rejectedBy }: { id: number; rejectionReason: string; rejectedBy: string }) => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/reject-artisan/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason, rejectedBy }),
      });
      if (!response.ok) throw new Error("Failed to reject artisan");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Artisan rejected successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-artisans"] });
      setSelectedArtisan(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reject artisan",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (artisan: Artisan) => {
    if (!adminName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your admin name",
        variant: "destructive",
      });
      return;
    }
    approveMutation.mutate({ id: artisan.id, approvedBy: adminName });
  };

  const handleReject = (artisan: Artisan) => {
    if (!adminName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your admin name",
        variant: "destructive",
      });
      return;
    }
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }
    rejectMutation.mutate({ 
      id: artisan.id, 
      rejectionReason: rejectionReason.trim(), 
      rejectedBy: adminName 
    });
  };

  const filteredArtisans = useMemo(() => {
    if (!pendingArtisans) return [];
    return pendingArtisans.filter((artisan) => {
      const matchesSearch = 
        searchTerm === "" ||
        `${artisan.firstName} ${artisan.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [pendingArtisans, searchTerm]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-black">
          <Header />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading pending artisans...</p>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gold">Admin Review Panel</h1>
                <p className="text-white/80">Review and approve pending artisan applications</p>
              </div>
              <Link href="/admin/manage">
                <Button className="bg-gold hover:bg-gold-dark text-black" data-testid="button-manage-artisans">
                  <Users className="w-4 h-4 mr-2" />
                  Manage All Artisans
                </Button>
              </Link>
            </div>
            
            {/* Admin Name Input - REQUIRED for approvals */}
            <Card className="bg-gradient-to-r from-gold/10 to-gold-dark/10 border-2 border-gold/50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gold/20 rounded-full p-2">
                    <CheckCircle className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="adminName" className="text-white font-semibold text-base mb-1 block">
                      Your Admin Name (Required for Approvals)
                    </Label>
                    <Input
                      id="adminName"
                      type="text"
                      placeholder="Enter your name to enable approve/reject buttons"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="mt-2 bg-zinc-900 border-green/30 text-white"
                      data-testid="input-admin-name"
                    />
                    {!adminName.trim() && (
                      <p className="text-white/70 text-sm mt-2">
                        ⚠️ Enter your name above to enable the approve and reject buttons
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Box */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <Input
                placeholder="Search artisans by name, email, location, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-900 border-green/30 text-white"
                data-testid="input-search-artisans"
              />
            </div>
            
            {searchTerm && (
              <p className="text-white/60 mt-3">
                Showing {filteredArtisans.length} of {pendingArtisans?.length || 0} pending applications
              </p>
            )}
          </div>

          {!pendingArtisans || pendingArtisans.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Pending Applications</h3>
              <p className="text-white/60">All artisan applications have been reviewed.</p>
            </div>
          ) : filteredArtisans.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-16 w-16 text-white/40 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
              <p className="text-white/60">No pending artisans match your search "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredArtisans.map((artisan) => (
                <Card key={artisan.id} className="bg-zinc-900 border-2 border-green/30 hover:border-gold transition-all duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-white">
                          {artisan.firstName} {artisan.lastName}
                        </CardTitle>
                        <CardDescription className="text-white/60">
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {artisan.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {artisan.yearsExperience} years experience
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-orange-400 text-orange-600">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {artisan.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="bg-gold/10 text-gold border-green/30">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Description</h4>
                        <p className="text-white/70">{artisan.description}</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {artisan.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {artisan.phone}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-white mb-2">Documents</h4>
                          <div className="space-y-1 text-sm text-white/60">
                            {artisan.idDocument && (
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                ID Document: {artisan.idDocument}
                              </div>
                            )}
                            {artisan.qualificationDocuments && artisan.qualificationDocuments.length > 0 && (
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Qualifications: {artisan.qualificationDocuments.length} files
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-4">
                    <Button
                      onClick={() => handleApprove(artisan)}
                      disabled={approveMutation.isPending || !adminName.trim()}
                      className="bg-green hover:bg-green-dark text-white flex items-center gap-2"
                      data-testid={`button-approve-${artisan.id}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                    
                    <Button
                      onClick={() => setSelectedArtisan(artisan)}
                      disabled={rejectMutation.isPending || !adminName.trim()}
                      variant="destructive"
                      className="flex items-center gap-2"
                      data-testid={`button-reject-${artisan.id}`}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {selectedArtisan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-zinc-900 border-2 border-green/30">
              <CardHeader>
                <CardTitle className="text-white">Reject Application</CardTitle>
                <CardDescription className="text-white/60">
                  Provide a reason for rejecting {selectedArtisan.firstName} {selectedArtisan.lastName}'s application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="rejectionReason" className="text-white">Rejection Reason</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1 bg-zinc-800 border-green/30 text-white"
                  rows={4}
                />
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedArtisan(null);
                    setRejectionReason("");
                  }}
                  variant="outline"
                  className="flex-1 border-green/30 text-white hover:bg-zinc-800"
                  data-testid="button-cancel-rejection"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReject(selectedArtisan)}
                  disabled={rejectMutation.isPending || !rejectionReason.trim() || !adminName.trim()}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-confirm-rejection"
                >
                  Reject
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <Footer />
      </div>
    </PageTransition>
  );
}