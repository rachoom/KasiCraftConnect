import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Zap, Hammer, Wrench, Home, Sparkles, MapPin, Phone, Mail, Shield, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-2 border-green/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="pb-6 border-b border-gold/30 md:border-b-0 md:pr-4">
              <div className="h-1 bg-gradient-to-r from-gold via-green to-gold rounded-full shimmer-line mb-4"></div>
              <h5 className="text-2xl lg:text-3xl font-bold text-gold mb-2">
                SKILLS CONNECT
              </h5>
              <p className="text-green text-sm font-semibold">Far East Rand</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6 mt-6">
              Connecting you to reliable, vetted professionals across Far East Rand. Your safety and satisfaction are our priority.
            </p>
            <div className="flex items-center gap-3 bg-gradient-to-r from-gold/10 to-green/10 border-2 border-gold/30 rounded-lg px-3 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green"></div>
              <span className="text-gold text-xs font-semibold">Proudly South African</span>
            </div>
          </div>

          {/* Services Section */}
          <div className="border-b md:border-b-0 md:border-l md:border-l-gold/30 md:pl-4 pb-6 md:pb-0">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-gold to-green rounded-full"></div>
              <h6 className="font-bold text-lg text-gold">Services</h6>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/service/electricians" className="flex items-center gap-2 text-white/70 hover:text-gold transition-all duration-300 group">
                  <Zap className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>Electricians</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/service/builders" className="flex items-center gap-2 text-white/70 hover:text-gold transition-all duration-300 group">
                  <Hammer className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>Builders</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/service/plumbers" className="flex items-center gap-2 text-white/70 hover:text-gold transition-all duration-300 group">
                  <Wrench className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>Plumbers</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/service/tilers" className="flex items-center gap-2 text-white/70 hover:text-gold transition-all duration-300 group">
                  <Home className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>Tilers</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/service/cleaners" className="flex items-center gap-2 text-white/70 hover:text-gold transition-all duration-300 group">
                  <Sparkles className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>Cleaners</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/service/dressmakers" className="flex items-center gap-2 text-white/70 hover:text-gold transition-all duration-300 group">
                  <Sparkles className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>Dressmakers</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Coverage Area Section */}
          <div className="border-b md:border-b-0 md:border-l md:border-l-gold/30 md:pl-4 pb-6 md:pb-0">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-gold to-green rounded-full"></div>
              <h6 className="font-bold text-lg text-gold">Coverage Area</h6>
            </div>
            <ul className="space-y-3">
              {['Brakpan', 'Benoni', 'Springs', 'Nigel', 'Daveyton'].map((location) => (
                <li key={location} className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors group">
                  <MapPin className="w-4 h-4 text-green group-hover:text-gold transition-colors" />
                  <span className="text-sm">{location}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="border-b md:border-b-0 md:border-l md:border-l-gold/30 md:pl-4 pb-6 md:pb-0">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-gold to-green rounded-full"></div>
              <h6 className="font-bold text-lg text-gold">Get in Touch</h6>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <Phone className="w-4 h-4 text-gold mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-white/50 text-xs font-semibold">Call Us</p>
                  <a href="tel:0697026088" className="text-white/70 hover:text-gold transition-colors font-medium">069 702 6088</a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <Mail className="w-4 h-4 text-gold mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-white/50 text-xs font-semibold">Email Us</p>
                  <a href="mailto:admin@skillsconnect.co.za" className="text-white/70 hover:text-gold transition-colors font-medium text-sm">admin@skillsconnect.co.za</a>
                </div>
              </li>
              <li className="flex items-center gap-2 pt-2">
                <Shield className="w-4 h-4 text-green" />
                <span className="text-white/70 text-sm">Verified & Insured</span>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="border-b md:border-b-0 md:border-l md:border-l-gold/30 md:pl-4 pb-6 md:pb-0">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-gold to-green rounded-full"></div>
              <h6 className="font-bold text-lg text-gold">Connect</h6>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' }
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-gold/10 to-green/10 border border-gold/30 text-gold hover:bg-gold hover:text-black hover:scale-110 transition-all duration-300"
                  data-testid={`button-social-${label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent rounded-full shimmer-line my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/60 text-sm text-center md:text-left">
            © 2024 SKILLS CONNECT - Far East Rand. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
            <a href="#" className="text-white/60 hover:text-gold transition-colors">Privacy Policy</a>
            <span className="text-white/20">•</span>
            <a href="#" className="text-white/60 hover:text-gold transition-colors">Terms of Service</a>
            <span className="text-white/20">•</span>
            <a href="#" className="text-white/60 hover:text-gold transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
    </footer>
  );
}
