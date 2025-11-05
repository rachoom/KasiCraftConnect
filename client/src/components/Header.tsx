import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoUrl from "@assets/logo_1762199548948.png";
import brandLogoUrl from "@assets/skills connect site name (2)_1762351707480.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header 
      className="shadow-sm border-b border-green/20 bg-black sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <motion.div 
            className="flex items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3 transition-all duration-300 transform hover:scale-105">
              <img 
                src={logoUrl} 
                alt="Skills Connect Logo Icon" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <div className="flex flex-col">
                <img 
                  src={brandLogoUrl} 
                  alt="SKILLS CONNECT" 
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                />
                <span className="text-xs sm:text-sm text-gold font-light mt-0.5">Far East Rand</span>
              </div>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <motion.nav 
            className="hidden lg:flex items-center space-x-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="/#services" className="text-gold hover:text-yellow-300 transition-all duration-300 font-semibold hover:bg-gold/20 px-3 py-2 rounded-lg transform hover:scale-105 shadow-sm hover:shadow-md inline-flex items-center">
              Services
            </a>
            <Link href="/profiles" className="text-gold hover:text-yellow-300 transition-all duration-300 font-semibold hover:bg-gold/20 px-3 py-2 rounded-lg transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer inline-flex items-center">
              Artisans
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="text-gold hover:text-yellow-300 font-semibold hover:bg-gold/20 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                Contact
              </Button>
            </Link>
            <Link href="/artisan">
              <Button className="bg-gold hover:bg-gold-dark text-black cosmic-glow-static px-6 py-2 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Register as an Artisan
              </Button>
            </Link>
          </motion.nav>
          
          {/* Mobile Menu Button - Visible only on mobile */}
          <motion.button 
            className="lg:hidden text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black border-t border-green/20"
          >
            <nav className="px-4 py-4 space-y-3">
              <a 
                href="/#services" 
                className="block text-gold hover:text-yellow-300 transition-all duration-300 font-semibold hover:bg-gold/20 px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <Link 
                href="/profiles" 
                className="block text-gold hover:text-yellow-300 transition-all duration-300 font-semibold hover:bg-gold/20 px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Artisans
              </Link>
              <Link 
                href="/contact" 
                className="block text-gold hover:text-yellow-300 transition-all duration-300 font-semibold hover:bg-gold/20 px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/artisan" 
                className="block"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full bg-gold hover:bg-gold-dark text-black cosmic-glow-static font-bold shadow-lg">
                  Register as an Artisan
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
