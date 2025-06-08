import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black-soft text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#D4A574" stroke="#ffffff" strokeWidth="2"/>
                <path d="M12 28 L20 16 L28 28 Z" fill="#ffffff"/>
                <circle cx="20" cy="22" r="3" fill="#D4A574"/>
                <path d="M16 12 L20 8 L24 12 L20 16 Z" fill="#ffffff"/>
                <circle cx="20" cy="12" r="1.5" fill="#D4A574"/>
              </svg>
              <h5 className="text-2xl font-bold">
                Kasi <span className="text-gold">Connect</span>
              </h5>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting communities with trusted local artisans across South Africa. 
              Find skilled professionals for all your home and business needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors">
                <Facebook className="w-5 h-5 text-gold" />
              </a>
              <a href="#" className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors">
                <Twitter className="w-5 h-5 text-gold" />
              </a>
              <a href="#" className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors">
                <Instagram className="w-5 h-5 text-gold" />
              </a>
              <a href="#" className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors">
                <Linkedin className="w-5 h-5 text-gold" />
              </a>
            </div>
          </div>

          <div>
            <h6 className="font-semibold text-lg mb-4">For Customers</h6>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/search" className="hover:text-gold transition-colors">Find Artisans</Link></li>
              <li><a href="#how-it-works" className="hover:text-gold transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-gold transition-colors">Pricing</a></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-lg mb-4">For Artisans</h6>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/register-artisan" className="hover:text-gold transition-colors">
                  Join Kasi Connect
                </Link>
              </li>
              <li><a href="#" className="hover:text-gold transition-colors">Artisan Resources</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Kasi Connect. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gold transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
