import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [service, setService] = useState("");
  const [location, setLocationValue] = useState("");

  const handleSearch = () => {
    if (service && location) {
      setLocation(`/search?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}&tier=basic`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-hero-overlay text-white overflow-hidden">
      {/* Background overlay with subtle pattern */}
      <div className="absolute inset-0 opacity-15 bg-black/70">
        <div 
          className="absolute top-0 left-0 w-1/3 h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
          }}
        />
        <div 
          className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
          }}
        />
        <div 
          className="absolute bottom-0 left-1/3 w-1/3 h-1/2 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')"
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Find Trusted <span className="text-gold">Artisans</span><br />
            In Your Neighborhood
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
            Connect with verified skilled professionals for all your home and business needs.
            From builders to cleaners, we've got you covered.
          </p>
          
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="What service do you need?"
                  className="pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-gray-900"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Your location"
                  className="pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent text-gray-900"
                  value={location}
                  onChange={(e) => setLocationValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <Button 
              className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-4 px-8 rounded-xl text-lg cosmic-glow"
              onClick={handleSearch}
            >
              Find Artisans Near Me
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
