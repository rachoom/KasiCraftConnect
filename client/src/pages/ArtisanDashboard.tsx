import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import FadeInSection from "@/components/FadeInSection";
import { User, Mail, Phone, MapPin, Briefcase, LogOut } from "lucide-react";

export default function ArtisanDashboard() {
  const [, setLocation] = useLocation();
  const [artisanData, setArtisanData] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('artisan_token');
    const user = localStorage.getItem('artisan_user');
    
    if (!token) {
      setLocation('/artisan/login');
      return;
    }
    
    if (user) {
      try {
        setArtisanData(JSON.parse(user));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('artisan_token');
    localStorage.removeItem('artisan_user');
    setLocation('/');
  };

  if (!artisanData) {
    return (
      <div className="min-h-screen bg-gray-soft">
        <Header />
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-lg text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-soft">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-black-soft mb-2">
                  Welcome, {artisanData.firstName}!
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

            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-black-soft">
                    <User className="w-5 h-5 mr-2 text-gold" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  {artisanData.services && artisanData.services.length > 0 && (
                    <div className="flex items-start">
                      <Briefcase className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                      <div>
                        <span className="text-gray-700">Services: </span>
                        <span className="text-gray-600">
                          {artisanData.services.join(', ')}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-black-soft">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Verification Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      artisanData.verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {artisanData.verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Approval Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      artisanData.approvalStatus === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : artisanData.approvalStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {artisanData.approvalStatus === 'approved' ? 'Approved' : 
                       artisanData.approvalStatus === 'rejected' ? 'Rejected' : 'Pending Review'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-black-soft">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button 
                      variant="outline" 
                      className="p-6 h-auto flex flex-col items-center space-y-2"
                      onClick={() => setLocation('/artisan/profile')}
                    >
                      <User className="w-6 h-6 text-gold" />
                      <span>Edit Profile</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="p-6 h-auto flex flex-col items-center space-y-2"
                      onClick={() => setLocation('/artisan/subscription')}
                    >
                      <Briefcase className="w-6 h-6 text-gold" />
                      <span>Manage Subscription</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="p-6 h-auto flex flex-col items-center space-y-2"
                      onClick={() => setLocation('/artisan/documents')}
                    >
                      <Mail className="w-6 h-6 text-gold" />
                      <span>Upload Documents</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeInSection>
        </div>
      </main>
    </div>
  );
}