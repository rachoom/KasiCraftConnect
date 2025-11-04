import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, Star, Crown, Zap, Users, TrendingUp, Camera, FileText } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FadeInSection from "@/components/FadeInSection";
import UnverifiedRegistrationForm from "@/components/UnverifiedRegistrationForm";
import VerifiedApplicationForm from "@/components/VerifiedApplicationForm";

export default function JoinArtisan() {
  const [selectedPath, setSelectedPath] = useState<'unverified' | 'verified' | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to form when a tier is selected
  useEffect(() => {
    if (selectedPath && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedPath]);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-8">
              <Link href="/">
                <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gold mb-4">
                Join Skills Connect as an Artisan
              </h1>
              <p className="text-xl text-white max-w-3xl mx-auto">
                Choose the path that's right for you and start connecting with clients today
              </p>
            </div>

            {/* Tier Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Unverified (Free) Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  setSelectedPath('unverified');
                }}
                className="cursor-pointer"
                data-testid="card-unverified"
              >
                <Card className={`h-full border border-gold/30 transition-all ${
                  selectedPath === 'unverified' 
                    ? 'bg-gold/10 shadow-xl' 
                    : 'hover:border-gold/50 bg-black'
                }`}>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white/40" />
                    </div>
                    <CardTitle className="text-3xl text-gold">
                      Unverified Listing
                    </CardTitle>
                    <p className="text-4xl font-bold text-white mt-2">FREE</p>
                    <p className="text-sm text-white/80 mt-1">Get started instantly</p>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-white/60" />
                        <span>Basic profile listing</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-white/60" />
                        <span>Contact information display</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-white/60" />
                        <span>Included in skill categories</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-white/60" />
                        <span>Profile marked as "Unverified"</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                      data-testid="button-select-unverified"
                    >
                      Get Started Free
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Verified Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  setSelectedPath('verified');
                }}
                className="cursor-pointer relative"
                data-testid="card-verified"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gold text-black px-4 py-1 rounded-full text-sm font-bold">
                    RECOMMENDED
                  </span>
                </div>
                
                <Card className={`h-full border border-gold/30 transition-all ${
                  selectedPath === 'verified' 
                    ? 'bg-gold/10 shadow-xl' 
                    : 'hover:border-gold/50 bg-black'
                }`}>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gold" />
                    </div>
                    <CardTitle className="text-3xl text-gold">
                      Verified Artisan
                    </CardTitle>
                    <p className="text-4xl font-bold text-gold mt-2">R100<span className="text-lg">/month</span></p>
                    <p className="text-sm text-white/80 mt-1">Build trust with clients</p>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-white">
                        <Star className="w-5 h-5 text-gold" />
                        <span className="font-semibold">All Unverified features, plus:</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <TrendingUp className="w-5 h-5 text-gold" />
                        <span><strong>Priority placement</strong> in search results</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <CheckCircle className="w-5 h-5 text-gold" />
                        <span>Prominent <strong>"Verified"</strong> badge</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <Camera className="w-5 h-5 text-gold" />
                        <span>Detailed profile with photo gallery</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <FileText className="w-5 h-5 text-gold" />
                        <span>Access to customer review system</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gold hover:bg-yellow-600 text-black font-bold"
                      data-testid="button-select-verified"
                    >
                      Apply for Verification
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Premium Marketing Tier - Separate section */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="border border-gold/30 bg-gradient-to-br from-gold/10 to-black">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Crown className="w-8 h-8 text-purple-400" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-purple-400">Verified + Marketing</h3>
                          <span className="text-3xl font-bold text-purple-400">R299<span className="text-lg">/month</span></span>
                        </div>
                        
                        <p className="text-white mb-4">
                          Everything in Verified tier, plus dedicated marketing support to grow your business
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-3 mb-6">
                          <div className="flex items-center gap-2 text-white">
                            <Zap className="w-5 h-5 text-purple-400" />
                            <span>Featured placement on homepage</span>
                          </div>
                          <div className="flex items-center gap-2 text-white">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                            <span>Social media promotion</span>
                          </div>
                          <div className="flex items-center gap-2 text-white">
                            <Star className="w-5 h-5 text-purple-400" />
                            <span>Email marketing campaigns</span>
                          </div>
                          <div className="flex items-center gap-2 text-white">
                            <CheckCircle className="w-5 h-5 text-purple-400" />
                            <span>Priority customer support</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => setSelectedPath('verified')}
                          className="bg-purple-500 hover:bg-purple-600 text-white font-bold"
                          data-testid="button-select-premium"
                        >
                          Apply for Premium Marketing
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Registration Forms */}
            {selectedPath === 'unverified' && (
              <motion.div
                ref={formRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="border border-gold/30 bg-black">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gold">
                      Create Your Free Unverified Profile
                    </CardTitle>
                    <p className="text-white/80">Fill in the form below to get started instantly</p>
                  </CardHeader>
                  <CardContent>
                    <UnverifiedRegistrationForm />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {selectedPath === 'verified' && (
              <motion.div
                ref={formRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <Card className="border border-gold/30 bg-black">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gold">
                      Apply for Verified Status
                    </CardTitle>
                    <p className="text-white/80">
                      Submit your application with supporting documents. We'll review within 2-3 business days.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <VerifiedApplicationForm />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </FadeInSection>
        </div>
      </main>
    </div>
  );
}
