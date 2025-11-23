import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Advertisement } from "@shared/schema";

export default function TrustedPartners() {
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

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    if (activeAds.length === 0 || autoplayPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeAds.length, autoplayPaused]);

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

  // If no ads, don't render section
  if (activeAds.length === 0) {
    return null;
  }

  const currentAd = activeAds[currentIndex];

  return (
    <section className="py-16 lg:py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-gold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Featured Partner Opportunities
          </motion.h3>
          <motion.p 
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover our featured business partnerships and promotions
          </motion.p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div 
          className="relative bg-zinc-900 border-2 border-green/30 rounded-lg overflow-hidden h-96 group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          data-testid="card-partners-carousel"
        >
          {/* Main Ad Display */}
          <div className="w-full h-full relative">
            {currentAd.imageUrl ? (
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-full h-full object-cover"
                data-testid={`img-partner-carousel-${currentAd.id}`}
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
              <div className="absolute inset-0 bg-black/50 flex items-end p-8">
                <div className="w-full">
                  <h3 className="text-2xl font-bold text-gold mb-2">{currentAd.title}</h3>
                  <p className="text-white/90 mb-4">{currentAd.description}</p>
                  
                  {/* Contact Information */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {currentAd.contactPhone && (
                      <a
                        href={`tel:${currentAd.contactPhone}`}
                        className="flex items-center gap-2 text-gold hover:text-gold-dark transition-colors"
                        data-testid={`link-phone-${currentAd.id}`}
                      >
                        <span className="font-semibold">{currentAd.contactPhone}</span>
                      </a>
                    )}
                    {currentAd.contactEmail && (
                      <a
                        href={`mailto:${currentAd.contactEmail}`}
                        className="flex items-center gap-2 text-gold hover:text-gold-dark transition-colors"
                        data-testid={`link-email-${currentAd.id}`}
                      >
                        <span className="font-semibold">{currentAd.contactEmail}</span>
                      </a>
                    )}
                  </div>

                  {currentAd.linkUrl && (
                    <a
                      href={currentAd.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gold hover:bg-gold-dark text-black font-semibold px-6 py-2 rounded transition-colors"
                      data-testid={`link-partner-${currentAd.id}`}
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Display contact info for non-image ads */}
            {!currentAd.imageUrl && (
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-gold-dark/10 flex flex-col items-center justify-center p-8">
                <div className="text-center max-w-lg">
                  <h3 className="text-2xl font-bold text-gold mb-3">{currentAd.title}</h3>
                  <p className="text-white/80 mb-6">{currentAd.description}</p>
                  
                  {/* Contact Information */}
                  <div className="flex flex-col gap-3 mb-6">
                    {currentAd.contactPhone && (
                      <a
                        href={`tel:${currentAd.contactPhone}`}
                        className="text-gold hover:text-gold-dark font-semibold transition-colors"
                        data-testid={`link-phone-${currentAd.id}`}
                      >
                        📞 {currentAd.contactPhone}
                      </a>
                    )}
                    {currentAd.contactEmail && (
                      <a
                        href={`mailto:${currentAd.contactEmail}`}
                        className="text-gold hover:text-gold-dark font-semibold transition-colors"
                        data-testid={`link-email-${currentAd.id}`}
                      >
                        ✉️ {currentAd.contactEmail}
                      </a>
                    )}
                  </div>

                  {currentAd.linkUrl && (
                    <a
                      href={currentAd.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gold hover:bg-gold-dark text-black font-semibold px-6 py-2 rounded transition-colors"
                      data-testid={`link-partner-${currentAd.id}`}
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gold/80 hover:bg-gold text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous partner"
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gold/80 hover:bg-gold text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next partner"
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
                aria-label={`Go to partner ${index + 1}`}
                data-testid={`button-carousel-dot-${index}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Ad Counter */}
        <div className="mt-6 text-center text-white/60 text-sm">
          Ad {currentIndex + 1} of {activeAds.length}
        </div>
      </div>
    </section>
  );
}
