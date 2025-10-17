import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Locate, ChevronDown } from "lucide-react";

const services = [
  "builders", "electricians", "plumbers", "carpenters", "painters", "tilers", "roofers", 
  "landscapers", "cleaners", "mechanics", "welders", "security", "catering", "photography"
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

export default function Hero() {
  const [, navigate] = useLocation();
  const [service, setService] = useState("");
  const [location, setLocationValue] = useState("");
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [servicesuggestions, setServiceSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const serviceInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serviceInputRef.current && !serviceInputRef.current.contains(event.target as Node)) {
        setShowServiceSuggestions(false);
      }
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    console.log("Search button clicked");
    console.log("Current form values:", { service, location });
    console.log("Service length:", service.length);
    console.log("Location length:", location.length);
    
    if (service.trim() && location.trim()) {
      const searchUrl = `/search?service=${encodeURIComponent(service.trim())}&location=${encodeURIComponent(location.trim())}&tier=basic`;
      console.log("Navigating to:", searchUrl);
      navigate(searchUrl);
    } else {
      console.log("Missing search parameters:", { 
        service: service || 'empty', 
        location: location || 'empty',
        serviceLength: service.length,
        locationLength: location.length
      });
      alert("Please enter both a service and location to search");
    }
  };

  const handleServiceChange = (value: string) => {
    setService(value);
    if (value.length > 0) {
      const filtered = services.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      );
      setServiceSuggestions(filtered);
      setShowServiceSuggestions(true);
    } else {
      setShowServiceSuggestions(false);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocationValue(value);
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

  const selectService = (selectedService: string) => {
    setService(selectedService);
    setShowServiceSuggestions(false);
  };

  const selectLocation = (selectedLocation: string) => {
    setLocationValue(selectedLocation);
    setShowLocationSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get location name
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&countrycode=za&limit=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              const locationName = `${result.components.suburb || result.components.neighbourhood || result.components.city_district || result.components.city || result.components.town}, ${result.components.state}`;
              setLocationValue(locationName);
            } else {
              // Fallback to Gauteng areas based on coordinates
              if (latitude >= -26.5 && latitude <= -25.5 && longitude >= 27.5 && longitude <= 28.5) {
                setLocationValue("Johannesburg, Gauteng");
              } else if (latitude >= -26.3 && latitude <= -26.0 && longitude >= 28.0 && longitude <= 28.5) {
                setLocationValue("Ekurhuleni, Gauteng");
              } else {
                setLocationValue("Gauteng, South Africa");
              }
            }
          } else {
            // Fallback location for Gauteng
            setLocationValue("Gauteng, South Africa");
          }
        } catch (error) {
          // Fallback location
          setLocationValue("Gauteng, South Africa");
        }
        setIsGeolocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationValue("Gauteng, South Africa");
        setIsGeolocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <section className="relative bg-hero-overlay text-white overflow-hidden">
      {/* Background overlay with subtle pattern */}
      <div className="absolute inset-0 opacity-15 bg-black/70">
        <motion.div 
          className="absolute top-0 left-0 w-1/3 h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
          }}
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/3 w-1/3 h-1/2 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
          }}
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Trusted <motion.span 
              className="text-gold"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(218, 165, 32, 0.5)",
                  "0 0 20px rgba(218, 165, 32, 0.8)",
                  "0 0 10px rgba(218, 165, 32, 0.5)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Skills
            </motion.span><br />
            In Your Area
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect with verified skilled professionals for all your home and business needs.
            From builders to cleaners, we've got you covered.
          </motion.p>
          
          <motion.div 
            className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            <h3 className="text-2xl font-bold text-green-500 text-center mb-6">
              Quick Search
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label htmlFor="service-input" className="block text-sm font-semibold text-gray-700 text-center">
                  Service Needed *
                </label>
                <div className="relative" ref={serviceInputRef}>
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <Input
                    id="service-input"
                    type="text"
                    placeholder="What service do you need?"
                    className="pl-12 pr-10 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-gray-900 cosmic-selection"
                    value={service}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowServiceSuggestions(service.length > 0)}
                  />
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  
                  {showServiceSuggestions && servicesuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                      {servicesuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-3 hover:bg-gold/10 transition-colors first:rounded-t-lg last:rounded-b-lg cosmic-selection"
                          onClick={() => selectService(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location-input" className="block text-sm font-semibold text-gray-700 text-center">
                  Your Location *
                </label>
                <div className="relative" ref={locationInputRef}>
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <Input
                    id="location-input"
                    type="text"
                    placeholder="Your location"
                    className="pl-12 pr-16 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-gray-900 cosmic-selection"
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowLocationSuggestions(location.length > 0)}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-gold/10 cosmic-glow-static"
                      onClick={handleGeolocation}
                      disabled={isGeolocating}
                    >
                      <Locate className={`w-4 h-4 text-gold ${isGeolocating ? 'animate-pulse' : ''}`} />
                    </Button>
                    <ChevronDown className="text-gray-400 w-4 h-4" />
                  </div>
                  
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                      {locationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-3 hover:bg-gold/10 transition-colors first:rounded-t-lg last:rounded-b-lg cosmic-selection"
                          onClick={() => selectLocation(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button 
              type="button"
              className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-4 px-8 rounded-xl text-lg cosmic-glow-static"
              onClick={handleSearch}
            >
              Find Artisans Near Me
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
