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
                <circle cx="20" cy="20" r="18" fill="#D4A574" stroke="#1a1a1a" strokeWidth="2"/>
                <path d="M12 28 L20 16 L28 28 Z" fill="#1a1a1a"/>
                <circle cx="20" cy="22" r="3" fill="#D4A574"/>
                <path d="M16 12 L20 8 L24 12 L20 16 Z" fill="#1a1a1a"/>
                <circle cx="20" cy="12" r="1.5" fill="#D4A574"/>
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
