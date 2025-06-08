import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="royalGold" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DAA520"/>
                    <stop offset="50%" stopColor="#B8860B"/>
                    <stop offset="100%" stopColor="#8B6914"/>
                  </radialGradient>
                  <filter id="elegantGlow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Basotho Hat Background */}
                <ellipse cx="20" cy="32" rx="16" ry="6" fill="url(#royalGold)" opacity="0.3"/>
                <path d="M8 28 Q20 25 32 28 Q32 30 20 32 Q8 30 8 28 Z" fill="url(#royalGold)" opacity="0.5"/>
                <circle cx="20" cy="20" r="18" fill="none" stroke="url(#royalGold)" strokeWidth="1.5" opacity="0.6"/>
                
                {/* Central Star */}
                <path d="M20 4 L23 13 L32 13 L25.5 18.5 L28 27 L20 22 L12 27 L14.5 18.5 L8 13 L17 13 Z" 
                      fill="url(#royalGold)" filter="url(#elegantGlow)"/>
                <path d="M20 8 L22 15 L28 15 L23.5 19 L25 26 L20 22 L15 26 L16.5 19 L12 15 L18 15 Z" 
                      fill="#1a1a1a" opacity="0.7"/>
                <circle cx="20" cy="20" r="3" fill="#DAA520"/>
                
                {/* Decorative elements */}
                <circle cx="12" cy="12" r="1.5" fill="#DAA520" opacity="0.8"/>
                <circle cx="28" cy="12" r="1.5" fill="#B8860B" opacity="0.7"/>
                <circle cx="12" cy="28" r="1" fill="#DAA520" opacity="0.6"/>
                <circle cx="28" cy="28" r="1" fill="#B8860B" opacity="0.6"/>
              </svg>
              <h1 className="text-2xl font-bold text-black-soft cursor-pointer">
                Kasi <span className="text-gold">Connect</span>
              </h1>
            </Link>
          </div>
          
          <nav className="hidden lg:flex space-x-8">
            <a href="#services" className="text-gray-700 hover:text-gold transition-colors font-medium">
              Services
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-gold transition-colors font-medium">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gold transition-colors font-medium">
              Pricing
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/contact">
              <Button variant="ghost" className="text-gray-700 hover:text-gold font-medium">
                Contact
              </Button>
            </Link>

            <Link href="/register-artisan">
              <Button className="bg-gold hover:bg-gold-dark text-black cosmic-glow-static text-lg px-6 py-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Join as Artisan
              </Button>
            </Link>
          </div>
          
          <button className="lg:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
