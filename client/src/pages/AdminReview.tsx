import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { MapPin, Star, Phone, Mail, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Artisan } from "@shared/schema";

export default function AdminReview() {
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminName, setAdminName] = useState("");
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
            <h1 className="text-3xl font-bold text-black mb-4">Admin Review Panel</h1>
            <p className="text-gray-600">Review and approve pending artisan applications</p>
            
            {/* Admin Name Input */}
            <div className="mt-6 max-w-md">
              <Label htmlFor="adminName">Admin Name</Label>
              <Input
                id="adminName"
                type="text"
                placeholder="Enter your name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {!pendingArtisans || pendingArtisans.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Applications</h3>
              <p className="text-gray-600">All artisan applications have been reviewed.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {pendingArtisans.map((artisan) => (
                <Card key={artisan.id} className="border-2 border-orange-200 hover:border-gold transition-all duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-black">
                          {artisan.firstName} {artisan.lastName}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
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
                        <h4 className="font-semibold text-black mb-2">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {artisan.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="bg-gold/10 text-gold border-gold/20">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-black mb-2">Description</h4>
                        <p className="text-gray-700">{artisan.description}</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-black mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm text-gray-600">
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
                          <h4 className="font-semibold text-black mb-2">Documents</h4>
                          <div className="space-y-1 text-sm text-gray-600">
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
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                    
                    <Button
                      onClick={() => setSelectedArtisan(artisan)}
                      disabled={rejectMutation.isPending}
                      variant="destructive"
                      className="flex items-center gap-2"
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
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Reject Application</CardTitle>
                <CardDescription>
                  Provide a reason for rejecting {selectedArtisan.firstName} {selectedArtisan.lastName}'s application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
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
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReject(selectedArtisan)}
                  disabled={rejectMutation.isPending || !rejectionReason.trim()}
                  variant="destructive"
                  className="flex-1"
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