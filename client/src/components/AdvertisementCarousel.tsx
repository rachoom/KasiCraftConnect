import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Advertisement } from "@shared/schema";

export default function AdvertisementCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  const { data: ads = [] } = useQuery<Advertisement[]>({
    queryKey: ["/api/advertisements"],
    queryFn: async () => {
      const response = await fetch("/api/advertisements");
      if (!response.ok) throw new Error("Failed to fetch advertisements");
      return response.json();
    },
  });

  const activeAds = ads.filter((ad) => ad.isActive);

  useEffect(() => {
    if (activeAds.length === 0 || autoplayPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeAds.length, autoplayPaused]);

  if (activeAds.length === 0) {
    return null;
  }

  const currentAd = activeAds[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
    setAutoplayPaused(true);
    setTimeout(() => setAutoplayPaused(false), 8000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    setAutoplayPaused(true);
    setTimeout(() => setAutoplayPaused(false), 8000);
  };

  return (
    <div className="w-full bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Container */}
        <div className="relative bg-zinc-900 border-2 border-green/30 rounded-lg overflow-hidden h-96 group">
          {/* Main Ad Display */}
          <div className="w-full h-full relative">
            {currentAd.imageUrl ? (
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-full h-full object-cover"
                data-testid={`img-ad-carousel-${currentAd.id}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gold/10 to-gold-dark/10">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gold mb-2">{currentAd.title}</h3>
                  <p className="text-white/80">{currentAd.description}</p>
                </div>
              </div>
            )}

            {/* Overlay with text for image ads */}
            {currentAd.imageUrl && (
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-gold mb-2">{currentAd.title}</h3>
                  <p className="text-white/90">{currentAd.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gold/80 hover:bg-gold text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous ad"
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gold/80 hover:bg-gold text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next ad"
            data-testid="button-carousel-next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {activeAds.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setAutoplayPaused(true);
                  setTimeout(() => setAutoplayPaused(false), 8000);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-gold w-6"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to ad ${index + 1}`}
                data-testid={`button-carousel-dot-${index}`}
              />
            ))}
          </div>
        </div>

        {/* Ad Counter */}
        <div className="mt-4 text-center text-white/60 text-sm">
          Ad {currentIndex + 1} of {activeAds.length}
        </div>
      </div>
    </div>
  );
}
