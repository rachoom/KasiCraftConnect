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

  const { data: allArtisans, isLoading } = useQuery<Artisan[]>({
    queryKey: ["/api/admin/artisans"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/artisans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch artisans");
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/artisans"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/artisans"] });
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
        title: "Missing Admin Name",
        description: "Please enter your name in the admin name field above before approving",
        variant: "destructive",
      });
      return;
    }
    approveMutation.mutate({ id: artisan.id, approvedBy: adminName });
  };

  const handleReject = (artisan: Artisan) => {
    if (!adminName.trim()) {
      toast({
        title: "Missing Admin Name",
        description: "Please enter your name in the admin name field above before rejecting",
        variant: "destructive",
      });
      return;
    }
    setSelectedArtisan(artisan);
  };

  const filteredArtisans = useMemo(() => {
    if (!allArtisans) return [];
    return allArtisans.filter((artisan) => {
      const matchesSearch = 
        searchTerm === "" ||
        `${artisan.firstName} ${artisan.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [allArtisans, searchTerm]);

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
                <h1 className="text-3xl font-bold text-gold">Artisan Review & Management</h1>
                <p className="text-white/80">Review, approve, reject, and manage artisan applications and profiles</p>
              </div>
              <Link href="/admin/manage">
                <Button className="bg-gold hover:bg-gold-dark text-black" data-testid="button-manage-artisans">
                  <Users className="w-4 h-4 mr-2" />
                  Go to Manage Artisans
                </Button>
              </Link>
            </div>
            
            {/* Admin Name Input - REQUIRED for approvals */}
            <Card className="bg-gradient-to-r from-gold/10 to-gold-dark/10 border-2 border-gold mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gold/20 rounded-full p-3">
                    <CheckCircle className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="adminName" className="text-white font-bold text-base mb-2 block">
                      Your Admin Name
                    </Label>
                    <Input
                      id="adminName"
                      type="text"
                      placeholder="Enter your name to enable approve/reject functions"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="bg-zinc-800 border-2 border-green/50 text-white placeholder:text-white/40"
                      data-testid="input-admin-name"
                    />
                    {!adminName.trim() && (
                      <p className="text-gold text-sm mt-3 font-semibold">
                        ⚠️ Enter your name above to enable approval and rejection functions
                      </p>
                    )}
                    {adminName.trim() && (
                      <p className="text-green text-sm mt-3 font-semibold">
                        ✓ You're all set! You can now approve or reject artisans.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Box */}
            <div className="mb-6">
              <Label className="text-white font-bold mb-2 block">Search Artisans</Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold w-5 h-5" />
                <Input
                  placeholder="Search by name, email, location, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-zinc-800 border-2 border-green/50 text-white placeholder:text-white/40"
                  data-testid="input-search-artisans"
                />
              </div>
              {allArtisans && allArtisans.length > 0 && (
                <p className="text-white/70 text-sm mt-3">
                  {searchTerm ? `Found ${filteredArtisans.length} of ${allArtisans.length} artisans` : `Total artisans: ${allArtisans.length}`}
                </p>
              )}
            </div>
          </div>

          {!allArtisans || allArtisans.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Pending Applications</h3>
              <p className="text-white/60">All artisan applications have been reviewed.</p>
            </div>
          ) : filteredArtisans.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-16 w-16 text-white/40 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
              <p className="text-white/60">No artisans match your search "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredArtisans.map((artisan) => {
                const isPending = artisan.approvalStatus === "pending";
                const isApproved = artisan.approvalStatus === "approved";
                const isRejected = artisan.approvalStatus === "rejected";
                
                return (
                <Card key={artisan.id} className="bg-zinc-900 border-2 border-green/50 hover:border-gold transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gold">
                          {artisan.firstName} {artisan.lastName}
                        </CardTitle>
                        <CardDescription className="text-white/70">
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gold" />
                              {artisan.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gold" />
                              {artisan.yearsExperience} years experience
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {isPending && <Badge className="bg-orange-500/20 text-orange-400 border border-orange-400">Pending Review</Badge>}
                        {isApproved && <Badge className="bg-green/20 text-green border border-green">Approved</Badge>}
                        {isRejected && <Badge className="bg-red-500/20 text-red-400 border border-red-400">Rejected</Badge>}
                        {artisan.subscriptionTier && (
                          <Badge className="bg-gold/20 text-gold border border-gold/50">{artisan.subscriptionTier}</Badge>
                        )}
                      </div>
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
                  
                  <CardFooter className="flex gap-3 border-t border-green/30 pt-4">
                    <Button
                      onClick={() => handleApprove(artisan)}
                      disabled={approveMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 font-bold bg-green hover:bg-green-dark text-white"
                      data-testid={`button-approve-${artisan.id}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {approveMutation.isPending ? "Approving..." : "Approve"}
                    </Button>
                    
                    <Button
                      onClick={() => setSelectedArtisan(artisan)}
                      disabled={rejectMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 font-bold bg-red-600 hover:bg-red-700 text-white"
                      data-testid={`button-reject-${artisan.id}`}
                    >
                      <XCircle className="w-4 h-4" />
                      {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                    </Button>
                  </CardFooter>
                </Card>
              );
              })}
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
                  onClick={() => {
                    if (!rejectionReason.trim()) {
                      toast({
                        title: "Missing Rejection Reason",
                        description: "Please provide a reason for rejecting this artisan",
                        variant: "destructive",
                      });
                      return;
                    }
                    if (!adminName.trim()) {
                      toast({
                        title: "Missing Admin Name",
                        description: "Please enter your name in the admin name field above",
                        variant: "destructive",
                      });
                      return;
                    }
                    rejectMutation.mutate({ 
                      id: selectedArtisan.id, 
                      rejectionReason: rejectionReason.trim(), 
                      rejectedBy: adminName 
                    });
                  }}
                  disabled={rejectMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                  data-testid="button-confirm-rejection"
                >
                  {rejectMutation.isPending ? "Rejecting..." : "Reject"}
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