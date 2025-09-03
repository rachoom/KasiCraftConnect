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
      
      <main>
        {/* Main Landing Section - Search Focused */}
        <section className="py-16 min-h-[80vh] bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              {/* Service Header */}
              <div className="text-center mb-12">
                <div className="text-8xl mb-8">{service.icon}</div>
                <h1 className="text-4xl md:text-6xl font-bold text-black-soft mb-6">
                  Find {service.title} in Your Area
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                  {service.description}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-6 text-gold mb-12">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    <span className="font-semibold">Verified Professionals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6" />
                    <span className="font-semibold">Rated & Reviewed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span className="font-semibold">Trusted by Thousands</span>
                  </div>
                </div>
              </div>

              {/* Main Search Form */}
              <div className="max-w-3xl mx-auto">
                <Card className="shadow-2xl border-2 border-gold/20">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-3xl text-center text-black-soft font-bold">
                      Get Started
                    </CardTitle>
                  </CardHeader>
                <CardContent className="space-y-8 p-8">
                  {/* Location Input - Primary Focus */}
                  <div className="space-y-4">
                    <Label htmlFor="location" className="text-xl font-semibold text-black-soft">
                      Where do you need the service?
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold w-6 h-6" />
                      <Input
                        id="location"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="Enter your location (e.g., Johannesburg, Cape Town, Pretoria)"
                        className="pl-14 py-4 text-lg border-2 border-gray-200 focus:border-gold rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Date Picker - Secondary Focus */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-black-soft">
                      When do you need the service?
                    </Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal py-4 text-lg border-2 border-gray-200 hover:border-gold rounded-lg"
                        >
                          <CalendarIcon className="mr-3 h-6 w-6 text-gold" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select a date (optional)"}
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

                  {/* Tier Selection - Compact */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-black-soft">Choose your service tier:</Label>
                    <div className="grid gap-3 md:grid-cols-3">
                      {tiers.map((tier) => (
                        <Card 
                          key={tier.id}
                          className={`cursor-pointer transition-all border-2 ${
                            selectedTier === tier.id 
                              ? 'border-gold bg-gold/10 shadow-lg' 
                              : 'border-gray-200 hover:border-gold/50 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedTier(tier.id)}
                        >
                          <CardContent className="p-5 text-center">
                            <h3 className="font-bold text-lg text-black-soft">{tier.name}</h3>
                            <p className="text-2xl font-bold text-gold mb-2">{tier.price}</p>
                            <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                            <ul className="text-xs text-gray-500 space-y-1">
                              {tier.features.slice(0, 2).map((feature, index) => (
                                <li key={index}>• {feature}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Search Button - Prominent */}
                  <Button 
                    onClick={handleSearch}
                    className="w-full bg-gold hover:bg-gold/90 text-black font-bold py-6 text-xl rounded-lg shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                  >
                    <Search className="w-6 h-6 mr-3" />
                    Find {service.title}
                  </Button>
                </CardContent>
              </Card>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Quick Service Overview - Minimal */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeInSection>
              <h2 className="text-2xl font-bold text-black-soft mb-8">
                Common {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Services
              </h2>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {service.services.map((serviceItem, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <p className="font-medium text-black-soft text-sm">{serviceItem}</p>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}