import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Search, Users, Shield, Star } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeInSection from "@/components/FadeInSection";

const serviceInfo = {
  builders: {
    title: "Verified Builders",
    description: "Connect with professional builders and construction experts in your area",
    icon: "🏗️",
    services: ["New Construction", "Home Renovation", "Extensions", "Roofing", "Foundations", "General Building"]
  },
  plumbers: {
    title: "Verified Plumbers",
    description: "Find trusted plumbing professionals for all your water and drainage needs",
    icon: "🔧",
    services: ["Emergency Repairs", "Pipe Installation", "Drain Cleaning", "Water Heater Services", "Bathroom Renovation", "Kitchen Plumbing"]
  },
  electricians: {
    title: "Verified Electricians",
    description: "Reliable electrical contractors for safe and professional installations",
    icon: "⚡",
    services: ["Electrical Installation", "Wiring", "Lighting", "Power Points", "Safety Inspections", "Emergency Repairs"]
  },
  carpenters: {
    title: "Verified Carpenters",
    description: "Skilled carpenters for custom woodwork and furniture projects",
    icon: "🪵",
    services: ["Custom Furniture", "Kitchen Cabinets", "Built-in Wardrobes", "Decking", "Wooden Flooring", "Door Installation"]
  },
  tilers: {
    title: "Verified Tilers",
    description: "Professional tiling specialists for floors, walls, and bathrooms",
    icon: "🏠",
    services: ["Floor Tiling", "Wall Tiling", "Bathroom Tiling", "Kitchen Backsplash", "Outdoor Tiling", "Tile Repairs"]
  },
  cleaners: {
    title: "Verified Cleaners", 
    description: "Trusted cleaning services for homes and offices",
    icon: "🧽",
    services: ["House Cleaning", "Office Cleaning", "Deep Cleaning", "Move-in/Move-out", "Carpet Cleaning", "Window Cleaning"]
  },
  landscapers: {
    title: "Verified Landscapers",
    description: "Expert landscaping and garden maintenance services",
    icon: "🌿",
    services: ["Garden Design", "Lawn Maintenance", "Tree Services", "Irrigation", "Landscaping", "Garden Cleanup"]
  }
};

const tiers = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    description: "Up to 3 artisan contacts",
    features: ["Basic contact information", "Limited profiles", "Standard support"]
  },
  {
    id: "premium", 
    name: "Premium",
    price: "R99",
    description: "Up to 5 verified artisans",
    features: ["Full verified profiles", "Direct contact details", "Priority support", "Quality guarantee"]
  },
  {
    id: "enterprise",
    name: "Enterprise", 
    price: "R299/month",
    description: "Unlimited access",
    features: ["Unlimited contacts", "Premium artisans only", "Dedicated support", "Project management tools"]
  }
];

export default function ServiceLanding() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedTier, setSelectedTier] = useState("basic");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Extract service type from current URL
  const currentPath = window.location.pathname;
  const serviceType = currentPath.split('/').pop() || 'builders';
  const service = serviceInfo[serviceType as keyof typeof serviceInfo] || serviceInfo.builders;

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      alert("Please enter a location to search for artisans.");
      return;
    }

    const searchParams = new URLSearchParams({
      service: serviceType,
      location: searchLocation,
      tier: selectedTier,
      ...(selectedDate && { date: selectedDate.toISOString() })
    });

    setLocation(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-black-soft via-gray-800 to-black py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center text-white">
                <div className="text-6xl mb-6">{service.icon}</div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {service.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
                  {service.description}
                </p>
                <div className="flex justify-center items-center gap-6 text-gold">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span>Verified Professionals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    <span>Rated & Reviewed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>Trusted by Thousands</span>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-black-soft">
                    Find {service.title} in Your Area
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Location Input */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Where do you need the service?</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="location"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="Enter your location (e.g., Johannesburg, Cape Town)"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label>When do you need the service?</Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setIsCalendarOpen(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Tier Selection */}
                  <div className="space-y-4">
                    <Label>Choose your service tier:</Label>
                    <div className="grid gap-4 md:grid-cols-3">
                      {tiers.map((tier) => (
                        <Card 
                          key={tier.id}
                          className={`cursor-pointer transition-all border-2 ${
                            selectedTier === tier.id 
                              ? 'border-gold bg-gold/5' 
                              : 'border-gray-200 hover:border-gold/50'
                          }`}
                          onClick={() => setSelectedTier(tier.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <h3 className="font-semibold text-black-soft">{tier.name}</h3>
                            <p className="text-2xl font-bold text-gold mb-2">{tier.price}</p>
                            <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                            <ul className="text-xs text-gray-500 space-y-1">
                              {tier.features.map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Search Button */}
                  <Button 
                    onClick={handleSearch}
                    className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-3"
                    size="lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Find {service.title}
                  </Button>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </section>

        {/* Services Offered Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-black-soft mb-4">
                  Services We Connect You With
                </h2>
                <p className="text-lg text-gray-600">
                  Our verified {serviceType} offer a wide range of professional services
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {service.services.map((serviceItem, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-black-soft mb-2">{serviceItem}</h3>
                      <p className="text-sm text-gray-600">Professional and reliable service</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-black-soft mb-4">
                  Why Choose Skills Connect?
                </h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="text-center">
                  <CardContent className="p-8">
                    <Shield className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-black-soft mb-3">Verified Professionals</h3>
                    <p className="text-gray-600">All our artisans are thoroughly vetted and verified for quality and reliability.</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-8">
                    <Star className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-black-soft mb-3">Rated & Reviewed</h3>
                    <p className="text-gray-600">Browse genuine reviews and ratings from previous customers to make informed decisions.</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-8">
                    <Users className="w-12 h-12 text-gold mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-black-soft mb-3">Local Experts</h3>
                    <p className="text-gray-600">Connect with skilled professionals in your area who understand local requirements.</p>
                  </CardContent>
                </Card>
              </div>
            </FadeInSection>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}