import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black-soft text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <h5 className="text-2xl font-bold text-gold">
                SKILLS CONNECT
              </h5>
            </div>
            <p className="text-white mb-6">
              Connecting you to reliable, vetted professionals across Far East Rand. Your safety and satisfaction are our priority.
            </p>
            <div className="bg-gold/10 border border-green/30 rounded-lg px-4 py-2 inline-flex items-center">
              <span className="text-gold text-sm font-semibold">🇿🇦 Proudly South African</span>
            </div>
          </div>

          <div>
            <h6 className="font-semibold text-lg mb-4 text-gold">Services</h6>
            <ul className="space-y-3 text-white">
              <li><Link href="/service/electricians" className="hover:text-gold transition-colors">⚡ Electricians</Link></li>
              <li><Link href="/service/builders" className="hover:text-gold transition-colors">🏗️ Builders</Link></li>
              <li><Link href="/service/plumbers" className="hover:text-gold transition-colors">🔧 Plumbers</Link></li>
              <li><Link href="/service/tilers" className="hover:text-gold transition-colors">🏠 Tilers</Link></li>
              <li><Link href="/service/cleaners" className="hover:text-gold transition-colors">🧹 Cleaners</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-lg mb-4 text-gold">Coverage Area</h6>
            <ul className="space-y-3 text-white">
              <li className="flex items-center"><span className="text-gold mr-2">📍</span> Brakpan</li>
              <li className="flex items-center"><span className="text-gold mr-2">📍</span> Benoni</li>
              <li className="flex items-center"><span className="text-gold mr-2">📍</span> Springs</li>
              <li className="flex items-center"><span className="text-gold mr-2">📍</span> Nigel</li>
              <li className="flex items-center"><span className="text-gold mr-2">📍</span> Daveyton</li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-lg mb-4 text-gold">Contact Us</h6>
            <ul className="space-y-3 text-white">
              <li className="flex items-center"><span className="text-gold mr-2">📞</span> +27 11 123 4567</li>
              <li className="flex items-center"><span className="text-gold mr-2">📧</span> info@skillsconnect.co.za</li>
              <li className="flex items-center mt-4"><span className="text-gold mr-2">✓</span> Verified & Insured</li>
            </ul>
          </div>
        </div>

        <div className="border-t border border-green/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm mb-4 md:mb-0">
              © 2024 SKILLS CONNECT - Far East Rand. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-white/80">
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
