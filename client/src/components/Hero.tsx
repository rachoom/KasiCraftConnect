import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] bg-black text-white overflow-hidden flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
          alt="Artisan at work"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/93 to-black/95"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <motion.div 
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find Local Artisans in the{" "}
            <motion.span 
              className="text-gold"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(218, 165, 32, 0.5)",
                  "0 0 25px rgba(218, 165, 32, 0.8)",
                  "0 0 10px rgba(218, 165, 32, 0.5)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Far East Rand
            </motion.span>
            , Free.
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white mb-12 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect directly with verified professionals in Brakpan and surrounding areas. 
            No middleman fees. Just quality work from trusted local artisans.
          </motion.p>
          
          <motion.div 
            className="flex justify-center items-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/profiles">
              <Button 
                size="lg"
                className="bg-gold hover:bg-yellow-600 text-black font-bold px-10 py-6 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200 cosmic-glow-static"
              >
                Find Artisans
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
