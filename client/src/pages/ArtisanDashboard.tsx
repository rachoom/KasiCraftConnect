import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeInSection from "@/components/FadeInSection";
import { User, Mail, Phone, MapPin, Briefcase, LogOut, Shield, Clock, CheckCircle, AlertCircle, Star, Calendar } from "lucide-react";
import type { Artisan } from "@shared/schema";

export default function ArtisanDashboard() {
  const [, setLocation] = useLocation();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('artisan_token');
    if (!token) {
      setLocation('/artisan/login');
      return;
    }
  }, [setLocation]);

  // Fetch artisan profile data
  const { data: artisanData, isLoading, error } = useQuery<Artisan>({
    queryKey: ['/api/artisan/profile'],
    queryFn: async () => {
      const token = localStorage.getItem('artisan_token');
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch('/api/artisan/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleLogout = () => {
    localStorage.removeItem('artisan_token');
    localStorage.removeItem('artisan_user');
    setLocation('/');
  };

  // Handle authentication error
  useEffect(() => {
    if (error) {
      console.error('Profile fetch error:', error);
      // If authentication fails, redirect to login
      if (error.message.includes('401') || error.message.includes('Authentication')) {
        localStorage.removeItem('artisan_token');
        localStorage.removeItem('artisan_user');
        setLocation('/artisan/login');
      }
    }
  }, [error, setLocation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/3" />
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !artisanData) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Profile</h2>
              <p className="text-gray-600 mb-6">
                There was an error loading your profile. Please try logging in again.
              </p>
              <Button onClick={() => setLocation('/artisan/login')}>
                Back to Login
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper function to get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return { color: 'bg-green/10 text-green-dark', icon: CheckCircle, text: 'Approved' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending Review' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Unknown' };
    }
  };

  const approvalInfo = getStatusInfo(artisanData.approvalStatus || 'pending');
  const ApprovalIcon = approvalInfo.icon;

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black-soft mb-2">
                Welcome, {artisanData.firstName} {artisanData.lastName}!
              </h1>
              <p className="text-lg text-gray-600">
                Manage your artisan profile and grow your business
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
              </Button>
            </div>

            {/* Profile Cards Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile Information Card */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-black-soft">
                      <User className="w-5 h-5 mr-2 text-gold" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-700">{artisanData.email}</span>
                      </div>
                      {artisanData.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-700">{artisanData.phone}</span>
                        </div>
                      )}
                      {artisanData.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-700">{artisanData.location}</span>
                        </div>
                      )}
                      {artisanData.yearsExperience && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-700">{artisanData.yearsExperience} years experience</span>
                        </div>
                      )}
                    </div>
                    
                    {artisanData.services && artisanData.services.length > 0 && (
                      <div>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                          <h4 className="font-medium text-black-soft">Services Offered:</h4>
                          <div className="flex flex-wrap gap-2">
                            {artisanData.services.map((service: string, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-gold/20 text-black">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {artisanData.description && (
                      <div>
                        <Separator className="my-4" />
                        <div className="space-y-2">
                          <h4 className="font-medium text-black-soft">About:</h4>
                          <p className="text-gray-600 leading-relaxed">{artisanData.description}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Status and Actions Sidebar */}
              <div className="space-y-6">
                {/* Account Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-black-soft">
                      <Shield className="w-5 h-5 mr-2 text-gold" />
                      Account Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Verification:</span>
                        <Badge className={approvalInfo.color}>
                          <ApprovalIcon className="w-3 h-3 mr-1" />
                          {artisanData.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Approval:</span>
                        <Badge className={approvalInfo.color}>
                          <ApprovalIcon className="w-3 h-3 mr-1" />
                          {approvalInfo.text}
                        </Badge>
                      </div>

                      {artisanData.rating && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Rating:</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{parseFloat(artisanData.rating).toFixed(1)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps Card */}
                {artisanData.approvalStatus !== 'approved' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-black-soft">
                        <Clock className="w-5 h-5 mr-2 text-gold" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm text-gray-600">
                        {artisanData.approvalStatus === 'pending' && (
                          <>
                            <p>Your profile is currently under review by our admin team.</p>
                            <p>You'll receive an email notification once the review is complete.</p>
                            <p className="font-medium text-gold">Average review time: 2-3 business days</p>
                          </>
                        )}
                        {artisanData.approvalStatus === 'rejected' && (
                          <>
                            <p className="text-red-600">Your profile was not approved.</p>
                            <p>Please contact support for more information about resubmitting your application.</p>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }