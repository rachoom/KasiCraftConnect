import { useLocation, Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Search, Users, Shield, Star, ArrowLeft, Building2 } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeInSection from "@/components/FadeInSection";

const serviceInfo = {
  builders: {
    title: "Builders",
    description: "Connect with professional builders and construction experts in your area",
    icon: "🏗️",
    services: ["New Construction", "Home Renovation", "Extensions", "Roofing", "Foundations", "General Building"]
  },
  plumbers: {
    title: "Plumbers",
    description: "Find trusted plumbing professionals for all your water and drainage needs",
    icon: "🔧",
    services: ["Emergency Repairs", "Pipe Installation", "Drain Cleaning", "Water Heater Services", "Bathroom Renovation", "Kitchen Plumbing"]
  },
  electricians: {
    title: "Electricians",
    description: "Reliable electrical contractors for safe and professional installations",
    icon: "⚡",
    services: ["Electrical Installation", "Wiring", "Lighting", "Power Points", "Safety Inspections", "Emergency Repairs"]
  },
  painters: {
    title: "Painters",
    description: "Professional painting services for interior and exterior projects",
    icon: "🎨",
    services: ["Interior Painting", "Exterior Painting", "Wallpaper Installation", "Spray Painting", "Decorative Finishes", "Surface Preparation"]
  },
  carpenters: {
    title: "Carpenters",
    description: "Skilled carpenters for custom woodwork and furniture projects",
    icon: "🪵",
    services: ["Custom Furniture", "Kitchen Cabinets", "Built-in Wardrobes", "Decking", "Wooden Flooring", "Door Installation"]
  },
  tilers: {
    title: "Tilers",
    description: "Professional tiling specialists for floors, walls, and bathrooms",
    icon: "🏠",
    services: ["Floor Tiling", "Wall Tiling", "Bathroom Tiling", "Kitchen Backsplash", "Outdoor Tiling", "Tile Repairs"]
  },
  cleaners: {
    title: "Cleaners", 
    description: "Trusted cleaning services for homes and offices",
    icon: "🧽",
    services: ["House Cleaning", "Office Cleaning", "Deep Cleaning", "Move-in/Move-out", "Carpet Cleaning", "Window Cleaning"]
  },
  landscapers: {
    title: "Landscapers",
    description: "Expert landscaping and garden maintenance services",
    icon: "🌿",
    services: ["Garden Design", "Lawn Maintenance", "Tree Services", "Irrigation", "Landscaping", "Garden Cleanup"]
  },
  mechanics: {
    title: "Mechanics",
    description: "Professional vehicle repair and maintenance specialists",
    icon: "🔧",
    services: ["Engine Repair", "Brake Service", "Oil Changes", "Transmission Service", "Diagnostics", "General Maintenance"]
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

const locations = [
  "Johannesburg, Gauteng", "Cape Town, Western Cape", "Durban, KwaZulu-Natal", "Pretoria, Gauteng",
  "Sandton, Johannesburg", "Rosebank, Johannesburg", "Soweto, Johannesburg", "Alexandra, Johannesburg",
  "Melville, Johannesburg", "Randburg, Johannesburg", "Midrand, Johannesburg", "Fourways, Johannesburg",
  "Roodepoort, Johannesburg", "Germiston, Johannesburg", "Benoni, Johannesburg", "Edenvale, Johannesburg",
  "Kempton Park, Johannesburg", "Boksburg, Johannesburg", "Johannesburg CBD, Johannesburg",
  "Springs, Ekurhuleni", "Alberton, Ekurhuleni", "Benoni, Ekurhuleni", "Daveyton, Ekurhuleni",
  "Germiston, Ekurhuleni", "Boksburg, Ekurhuleni", "Kempton Park, Ekurhuleni", "Edenvale, Ekurhuleni",
  "Brakpan, Ekurhuleni", "Nigel, Ekurhuleni", "Tembisa, Ekurhuleni", "Duduza, Ekurhuleni",
  "Thokoza, Ekurhuleni", "Katlehong, Ekurhuleni", "Vosloorus, Ekurhuleni"
];

export default function ServiceLanding() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedTier, setSelectedTier] = useState("basic");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const getStartedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to Get Started section on page load
  useEffect(() => {
    if (getStartedRef.current) {
      getStartedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleLocationChange = (value: string) => {
    setSearchLocation(value);
    if (value.length > 0) {
      const filtered = locations.filter(l => 
        l.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (selectedLocation: string) => {
    setSearchLocation(selectedLocation);
    setShowLocationSuggestions(false);
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
    <div className="min-h-screen bg-black">
      <Header />
      
      <main>
        {/* Direct Landing on Get Started Form */}
        <section className="pt-2 pb-4 min-h-screen bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <Link href="/">
                <Button variant="outline" className="mb-4 border-green/30 text-gold hover:bg-gold/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              {/* Get Started Form - Primary Focus */}
              <div ref={getStartedRef} className="max-w-4xl mx-auto">
                <Card className="shadow-2xl border border-green/30 bg-black">
                  <CardHeader className="pb-3 bg-black text-white rounded-t-lg">
                    <div className="text-center">
                      <Building2 className="w-16 h-16 mb-3 mx-auto text-gold" />
                      <CardTitle className="text-3xl font-bold mb-3 text-white">
                        Get Started - Find Verified {service.title}
                      </CardTitle>
                      <p className="text-base text-white mb-4 max-w-2xl mx-auto">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap justify-center items-center gap-4 text-gold">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          <span className="font-semibold text-sm">Verified Professionals</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          <span className="font-semibold text-sm">Rated & Reviewed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          <span className="font-semibold text-sm">Trusted Service</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                <CardContent className="space-y-4 p-6 bg-black">
                  {/* Location and Date Side by Side - Compact */}
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-base font-semibold text-white">
                        Where do you need the service?
                      </Label>
                      <div className="relative" ref={locationInputRef}>
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold w-4 h-4 z-10" />
                        <Input
                          id="location"
                          value={searchLocation}
                          onChange={(e) => handleLocationChange(e.target.value)}
                          onFocus={() => setShowLocationSuggestions(searchLocation.length > 0)}
                          placeholder="Enter your location"
                          className="pl-9 py-2 text-sm bg-zinc-800 border border-green/30 text-white placeholder:text-white/60 focus:border-gold rounded-lg"
                          data-testid="input-location"
                        />
                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-zinc-800 border border-green/30 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                            {locationSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                className="w-full text-left px-4 py-3 text-white hover:bg-gold/20 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                onClick={() => selectLocation(suggestion)}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-white">
                        When do you need the service?
                      </Label>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal py-2 text-sm bg-zinc-800 border border-green/30 text-white hover:bg-zinc-700 hover:border-gold rounded-lg"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-gold" />
                            {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select date (optional)"}
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

                  {/* Services Selection - Ultra Compact */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-white">
                      Select Services You Need
                    </Label>
                    <div className="grid gap-1 grid-cols-2 md:grid-cols-4 max-h-32 overflow-y-auto">
                      {service.services.map((serviceItem, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-zinc-800 rounded hover:bg-zinc-700 transition-colors">
                          <input
                            type="checkbox"
                            id={`service-${index}`}
                            checked={selectedServices.includes(serviceItem)}
                            onChange={() => handleServiceToggle(serviceItem)}
                            className="w-3 h-3 text-gold bg-zinc-700 border-green/30 rounded focus:ring-gold focus:ring-1"
                          />
                          <label 
                            htmlFor={`service-${index}`} 
                            className="text-white font-medium cursor-pointer flex-1 text-xs leading-tight"
                          >
                            {serviceItem}
                          </label>
                        </div>
                      ))}
                    </div>
                    {selectedServices.length > 0 && (
                      <p className="text-xs text-white/80">
                        {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>

                  {/* Search Button */}
                  <div className="pt-2">
                    <Button 
                      onClick={handleSearch}
                      className="w-full bg-gold hover:bg-gold/90 text-black font-bold py-3 text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find Verified {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
                    </Button>
                    
                    {searchLocation && (
                      <p className="mt-2 text-xs text-white/80 text-center">
                        Searching in {searchLocation}
                        {selectedServices.length > 0 && ` for ${selectedServices.slice(0, 2).join(', ')}${selectedServices.length > 2 ? '...' : ''}`}
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