import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <motion.header 
      className="shadow-sm border-b border-gold/20 bg-black"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3 transition-all duration-300 transform hover:scale-105">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DAA520"/>
                    <stop offset="50%" stopColor="#B8860B"/>
                    <stop offset="100%" stopColor="#8B6914"/>
                  </radialGradient>
                  <filter id="goldGlow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Basotho Hat Background */}
                <ellipse cx="20" cy="32" rx="16" ry="6" fill="url(#goldGradient)" opacity="0.4"/>
                <path d="M8 28 Q20 25 32 28 Q32 30 20 32 Q8 30 8 28 Z" fill="url(#goldGradient)" opacity="0.6"/>
                <circle cx="20" cy="20" r="18" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.7"/>
                
                {/* Central Star */}
                <path d="M20 4 L23 13 L32 13 L25.5 18.5 L28 27 L20 22 L12 27 L14.5 18.5 L8 13 L17 13 Z" 
                      fill="url(#goldGradient)" filter="url(#goldGlow)"/>
                <path d="M20 8 L22 15 L28 15 L23.5 19 L25 26 L20 22 L15 26 L16.5 19 L12 15 L18 15 Z" 
                      fill="#DAA520" opacity="0.8"/>
                <circle cx="20" cy="20" r="3" fill="#DAA520"/>
                
                {/* Decorative elements */}
                <circle cx="12" cy="12" r="1.5" fill="#DAA520" opacity="0.9"/>
                <circle cx="28" cy="12" r="1.5" fill="#B8860B" opacity="0.8"/>
                <circle cx="12" cy="28" r="1" fill="#DAA520" opacity="0.7"/>
                <circle cx="28" cy="28" r="1" fill="#B8860B" opacity="0.7"/>
              </svg>
              <h1 className="text-2xl font-light text-gold cursor-pointer tracking-wide" style={{fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"}}>
                Skills <span className="text-gold font-extralight">Connect</span>
              </h1>
            </Link>
          </motion.div>
          
          <motion.nav 
            className="hidden lg:flex space-x-8"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="#services" className="text-gold hover:text-yellow-300 transition-all duration-300 font-semibold hover:bg-gold/20 px-4 py-2 rounded-lg transform hover:scale-105 shadow-sm hover:shadow-md">
              Services
            </a>
            <a href="#how-it-works" className="text-gold hover:text-yellow-300 transition-all duration-300 font-semibold hover:bg-gold/20 px-4 py-2 rounded-lg transform hover:scale-105 shadow-sm hover:shadow-md">
              How It Works
            </a>
            <a href="#pricing" className="text-gold hover:text-yellow-300 transition-all duration-300 font-semibold hover:bg-gold/20 px-4 py-2 rounded-lg transform hover:scale-105 shadow-sm hover:shadow-md">
              Pricing
            </a>
          </motion.nav>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/contact">
              <Button variant="ghost" className="text-gold hover:text-yellow-300 font-semibold hover:bg-gold/20 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                Contact
              </Button>
            </Link>

            <Link href="/artisan">
              <Button className="bg-gold hover:bg-yellow-600 text-black hover:text-gray-800 cosmic-glow-static text-lg px-6 py-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Join as Artisan
              </Button>
            </Link>
          </motion.div>
          
          <motion.button 
            className="lg:hidden text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
