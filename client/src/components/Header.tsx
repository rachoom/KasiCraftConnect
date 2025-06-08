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
                  <radialGradient id="cosmicGold" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFD700"/>
                    <stop offset="50%" stopColor="#D4A574"/>
                    <stop offset="100%" stopColor="#B8860B"/>
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="20" cy="20" r="18" fill="url(#cosmicGold)" stroke="#1a1a1a" strokeWidth="1.5" filter="url(#glow)"/>
                <circle cx="20" cy="20" r="12" fill="none" stroke="#1a1a1a" strokeWidth="1" opacity="0.6"/>
                <circle cx="20" cy="20" r="6" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.4"/>
                <path d="M20 8 L22 14 L28 12 L22 16 L24 22 L20 18 L16 22 L18 16 L12 12 L18 14 Z" fill="#1a1a1a" opacity="0.8"/>
                <circle cx="20" cy="20" r="2" fill="#FFD700"/>
                <circle cx="15" cy="12" r="1" fill="#FFD700" opacity="0.7"/>
                <circle cx="28" cy="15" r="0.8" fill="#D4A574" opacity="0.6"/>
                <circle cx="12" cy="25" r="0.6" fill="#FFD700" opacity="0.5"/>
                <circle cx="30" cy="28" r="0.5" fill="#D4A574" opacity="0.4"/>
              </svg>
              <h1 className="text-2xl font-bold text-black-soft cursor-pointer">
                Kasi <span className="text-gold">Connect</span>
              </h1>
            </Link>
          </div>
          
          <nav className="hidden lg:flex space-x-8">
            <a href="#services" className="text-gray-600 hover:text-gold transition-colors">
              Services
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gold transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gold transition-colors">
              Pricing
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/contact">
              <Button variant="ghost" className="text-gray-600 hover:text-gold">
                Contact
              </Button>
            </Link>
            <Link href="/bulk-import">
              <Button variant="ghost" className="text-gray-600 hover:text-gold text-xs">
                Bulk Import
              </Button>
            </Link>
            <Link href="/register-artisan">
              <Button className="bg-gold hover:bg-gold-dark text-black">
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
