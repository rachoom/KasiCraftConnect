import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeInSection from "@/components/FadeInSection";
import { User, UserPlus, ArrowLeft, CheckCircle, Star, Shield } from "lucide-react";

export default function ArtisanAuth() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-8">
              <Link href="/">
                <Button variant="ghost" className="text-gold hover:text-gold-dark mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-black-soft mb-4">
                Join Skills Connect as an Artisan
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Connect with customers across South Africa and grow your business with our trusted platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Login Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full border-2 border-transparent hover:border-green/30 transition-all">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gold" />
                    </div>
                    <CardTitle className="text-2xl text-black-soft">
                      Existing Artisan
                    </CardTitle>
                    <p className="text-gray-600">
                      Already have an account? Sign in to manage your profile
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green" />
                        <span>Manage your artisan profile</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green" />
                        <span>View customer inquiries</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green" />
                        <span>Update your services and rates</span>
                      </div>
                    </div>
                    
                    <Link href="/artisan/login">
                      <Button className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-3">
                        Sign In
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Register Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full border-2 border-transparent hover:border-green/30 transition-all">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-black-soft">
                      New Artisan
                    </CardTitle>
                    <p className="text-gray-600">
                      Create your artisan profile and start getting customers
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green" />
                        <span>Free profile creation</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green" />
                        <span>Verification process included</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green" />
                        <span>Connect with local customers</span>
                      </div>
                    </div>
                    
                    <Link href="/register-artisan">
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3">
                        Create Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Benefits Section */}
            <FadeInSection>
              <div className="bg-gradient-to-r from-gold/10 to-blue-50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-black-soft mb-8">
                  Why Choose Skills Connect?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-xl font-semibold text-black-soft mb-2">Verified Listings</h3>
                    <p className="text-gray-600">
                      Get verified status to appear in premium search results and attract quality customers
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-black-soft mb-2">Trusted Platform</h3>
                    <p className="text-gray-600">
                      Join South Africa's most trusted marketplace for skilled artisans and tradespeople
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-black-soft mb-2">Easy Management</h3>
                    <p className="text-gray-600">
                      Simple dashboard to manage your profile, view inquiries, and grow your business
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </FadeInSection>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}