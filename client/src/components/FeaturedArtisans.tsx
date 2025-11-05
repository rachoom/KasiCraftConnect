import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, formatRating } from "@/lib/utils";
import { MapPin, Star, Phone, Mail } from "lucide-react";
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
              Meet some of our top-rated professionals ready to help with your next project.
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

  const featuredArtisans = artisans?.slice(0, 4) || [];

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
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Meet some of our top-rated professionals ready to help with your next project.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
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
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="bg-zinc-900 shadow-xl border-2 border-gold/40 hover:border-gold/80 transition-all duration-300 h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gold to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3 border-4 border-green/30">
                    {artisan.profileImage || getInitials(artisan.firstName, artisan.lastName)}
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-xl text-white mb-1">
                      {artisan.firstName} {artisan.lastName}
                    </h4>
                    <p className="text-gold font-semibold text-sm">
                      {artisan.services.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center mb-3">
                  <div className="flex text-gold mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-300 text-sm">
                    {formatRating(artisan.rating || "0")} ({artisan.reviewCount})
                  </span>
                </div>

                <div className="flex items-center justify-center text-gray-400 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{artisan.location}</span>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow text-center">{artisan.description}</p>

                {artisan.verified && (
                  <Badge variant="outline" className="text-green-500 border-green-500 mb-4 mx-auto">
                    ✓ Verified
                  </Badge>
                )}

                <div className="flex gap-2 mt-auto">
                  <a href={`tel:${artisan.phone}`} className="flex-1">
                    <Button className="w-full bg-gold hover:bg-yellow-600 text-black font-bold text-sm py-2">
                      <Phone className="w-4 h-4 mr-1" /> Call
                    </Button>
                  </a>
                  <a href={`mailto:${artisan.email}`} className="flex-1">
                    <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold/20 font-bold text-sm py-2">
                      <Mail className="w-4 h-4 mr-1" /> Email
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
