import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, formatRating } from "@/lib/utils";
import { MapPin, Star } from "lucide-react";
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

  const featuredArtisans = artisans?.slice(0, 3) || [];

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
    <section className="py-16 lg:py-24 bg-gray-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-black-soft mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Featured Artisans
          </motion.h3>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Meet some of our top-rated professionals ready to help with your next project.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
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
              <Card className="bg-white shadow-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {artisan.profileImage || getInitials(artisan.firstName, artisan.lastName)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-black-soft">
                      {artisan.firstName} {artisan.lastName}
                    </h4>
                    <p className="text-gold-dark font-medium">
                      {artisan.services.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex text-gold mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {formatRating(artisan.rating || "0")} ({artisan.reviewCount} reviews)
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{artisan.description}</p>

                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{artisan.location}</span>
                </div>

                {artisan.verified && (
                  <Badge variant="outline" className="text-gold border-gold mb-4">
                    Verified
                  </Badge>
                )}

                <Link href={`/artisan/${artisan.id}`}>
                  <Button className="w-full bg-gold hover:bg-gold-dark text-black font-semibold">
                    Contact {artisan.firstName}
                  </Button>
                </Link>
              </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
