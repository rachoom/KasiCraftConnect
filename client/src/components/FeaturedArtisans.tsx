import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, User } from "lucide-react";
import type { Artisan } from "@shared/schema";

export default function FeaturedArtisans() {
  const { data: artisans, isLoading } = useQuery<Artisan[]>({
    queryKey: ["/api/artisans"],
  });

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-gray-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-black-soft mb-4">Featured Artisans</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium professionals who have earned their place in our spotlight
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-16 h-16 rounded-full mr-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredArtisans = artisans?.filter(artisan => artisan.isFeatured) || [];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
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
            Featured Artisans
          </motion.h3>
          <motion.p 
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Premium professionals who have earned their place in our spotlight
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 overflow-hidden w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuredArtisans.map((artisan) => (
            <motion.div
              key={artisan.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -3,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="bg-black shadow-xl border-2 border-gold/80 hover:border-gold transition-all duration-300 h-full rounded-xl">
              <CardContent className="p-6 flex flex-col h-full">
                {/* Profile Image with Featured Badge */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gold to-gold-dark border-2 border-gold/50">
                      {artisan.profileImage ? (
                        <img src={artisan.profileImage} alt={`${artisan.firstName} ${artisan.lastName}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-black/80" />
                        </div>
                      )}
                    </div>
                    {artisan.subscriptionTier === 'premium' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full border-2 border-black flex items-center justify-center">
                        <span className="text-[10px] font-bold text-black">P</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg text-gold truncate">
                        {artisan.firstName} {artisan.lastName}
                      </h4>
                      {(artisan.subscriptionTier === 'verified' || artisan.subscriptionTier === 'premium') && (
                        <Badge className="bg-gold text-black font-semibold text-xs px-2 py-0.5 rounded-full">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/70 text-sm">
                      {artisan.services.map(s => {
                        const serviceMap: Record<string, string> = {
                          'builders': 'Builder',
                          'plumbers': 'Plumber',
                          'electricians': 'Electrician',
                          'carpenters': 'Carpenter',
                          'tilers': 'Tiler',
                          'painters': 'Painter',
                          'cleaners': 'Cleaner',
                          'landscapers': 'Landscaper',
                          'mechanics': 'Mechanic'
                        };
                        return serviceMap[s] || s.charAt(0).toUpperCase() + s.slice(1);
                      }).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-white/70 mb-3">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="text-sm">{artisan.location}</span>
                </div>

                {/* Description */}
                <p className="text-white/80 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                  {artisan.yearsExperience && `${artisan.yearsExperience}+ years experience in `}
                  {artisan.description}
                </p>

                {/* Contact Information */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="truncate">{artisan.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="truncate text-xs">{artisan.email}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                  <a href={`tel:${artisan.phone}`} className="w-full" data-testid={`button-call-${artisan.id}`}>
                    <Button className="w-full bg-gold hover:bg-gold-dark text-black font-bold text-sm py-2.5 rounded-lg">
                      Call Now
                    </Button>
                  </a>
                  <a href={`mailto:${artisan.email}`} className="w-full" data-testid={`button-email-${artisan.id}`}>
                    <Button variant="outline" className="w-full border-gold/30 text-white hover:bg-gold/10 hover:border-gold font-semibold text-sm py-2.5 rounded-lg bg-black">
                      Email
                    </Button>
                  </a>
                </div>
              </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Link href="/contact">
            <span className="text-gold hover:text-yellow-400 underline font-semibold transition-colors">
              Contact us to be featured here
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
