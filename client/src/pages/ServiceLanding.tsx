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
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Extract service type from current URL
  const currentPath = window.location.pathname;
  const serviceType = currentPath.split('/').pop() || 'builders';
  const service = serviceInfo[serviceType as keyof typeof serviceInfo] || serviceInfo.builders;

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      alert("Please enter a location to search for artisans.");
      return;
    }

    const searchParams = new URLSearchParams({
      service: serviceType,
      location: searchLocation,
      tier: selectedTier,
      ...(selectedDate && { date: selectedDate.toISOString() }),
      ...(selectedServices.length > 0 && { services: selectedServices.join(',') })
    });

    setLocation(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Direct Landing on Get Started Form */}
        <section className="py-4 min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              {/* Get Started Form - Primary Focus */}
              <div className="max-w-5xl mx-auto">
                <Card className="shadow-xl border-2 border-gold/20">
                  <CardHeader className="pb-4 bg-gradient-to-r from-black-soft to-gray-800 text-white rounded-t-lg">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{service.icon}</div>
                      <CardTitle className="text-2xl font-bold mb-2">
                        Get Started - Find {service.title}
                      </CardTitle>
                      <p className="text-sm text-gray-200 mb-2">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap justify-center items-center gap-3 text-gold">
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium text-xs">Verified</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span className="font-medium text-xs">Rated</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="font-medium text-xs">Trusted</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* Location and Date Side by Side */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Location Input */}
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-lg font-semibold text-black-soft">
                        Where do you need the service?
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold w-5 h-5" />
                        <Input
                          id="location"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          placeholder="Enter your location"
                          className="pl-10 py-3 text-base border-2 border-gray-200 focus:border-gold rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-black-soft">
                        When do you need the service?
                      </Label>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal py-3 text-base border-2 border-gray-200 hover:border-gold rounded-lg"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5 text-gold" />
                            {selectedDate ? format(selectedDate, "PPP") : "Select date (optional)"}
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
                  </div>

                  {/* Services Selection with Checkboxes - Compact */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold text-black-soft">
                      Common {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Services
                    </Label>
                    <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {service.services.map((serviceItem, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            id={`service-${index}`}
                            checked={selectedServices.includes(serviceItem)}
                            onChange={() => handleServiceToggle(serviceItem)}
                            className="w-4 h-4 text-gold bg-gray-100 border-gray-300 rounded focus:ring-gold focus:ring-2"
                          />
                          <label 
                            htmlFor={`service-${index}`} 
                            className="text-black-soft font-medium cursor-pointer flex-1 text-sm"
                          >
                            {serviceItem}
                          </label>
                        </div>
                      ))}
                    </div>
                    {selectedServices.length > 0 && (
                      <p className="text-xs text-gray-600 mt-1">
                        Selected: {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Search Button - Integrated */}
                  <div className="pt-4">
                    <Button 
                      onClick={handleSearch}
                      className="w-full bg-gold hover:bg-gold/90 text-black font-bold py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Find Verified {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
                    </Button>
                    
                    {searchLocation && (
                      <p className="mt-2 text-sm text-gray-600 text-center">
                        Searching for {serviceType} in {searchLocation}
                        {selectedServices.length > 0 && ` specializing in ${selectedServices.slice(0, 2).join(', ')}${selectedServices.length > 2 ? '...' : ''}`}
                      </p>
                    )}
                  </div>
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