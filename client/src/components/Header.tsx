import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-black-soft cursor-pointer">
                Kasi <span className="text-gold">Connect</span>
              </h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
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
            <Button variant="ghost" className="text-gray-600 hover:text-gold">
              Sign In
            </Button>
            <Link href="/register-artisan">
              <Button className="bg-gold hover:bg-gold-dark text-black">
                Join as Artisan
              </Button>
            </Link>
          </div>
          
          <button className="md:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
