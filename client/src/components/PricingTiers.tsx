import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useLocation } from "wouter";

const tiers = [
  {
    name: "Unverified",
    price: "FREE",
    description: "Start building your online presence",
    features: [
      "Instant profile creation",
      "Basic contact information",
      "Listed in search results",
      "Self-reported skills",
      "Free forever - no hidden costs"
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
    registrationPath: "/artisan#unverified"
  },
  {
    name: "Verified",
    price: "R100",
    period: "per month",
    description: "Build trust with verified credentials",
    features: [
      "Admin-verified credentials",
      "ID & qualification verification",
      "Green verified badge",
      "Priority in search results",
      "Customer review system",
      "Photo gallery showcase"
    ],
    buttonText: "Get Verified",
    buttonVariant: "default" as const,
    popular: true,
    registrationPath: "/artisan#verified"
  },
  {
    name: "Verified + Marketing",
    price: "R299",
    period: "per month",
    description: "Maximize your visibility & growth",
    features: [
      "All Verified tier benefits",
      "Highest priority placement",
      "Premium Marketing badge",
      "Featured in top results",
      "Enhanced profile visibility",
      "Exclusive marketing support"
    ],
    buttonText: "Go Premium",
    buttonVariant: "outline" as const,
    popular: false,
    registrationPath: "/artisan#premium"
  }
];

export default function PricingTiers() {
  const [, setLocation] = useLocation();

  const handleSelectTier = (path: string) => {
    setLocation(path);
  };

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Join Skills Connect</h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the plan that helps you grow your artisan business and connect with more customers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                tier.popular 
                  ? "bg-gradient-to-br from-gold to-gold-dark text-white relative overflow-hidden shadow-[0_0_30px_rgba(218,165,32,0.5)]" 
                  : "bg-gray-900 border-2 border-gold/50 hover:border-gold shadow-[0_0_20px_rgba(218,165,32,0.3)] hover:shadow-[0_0_30px_rgba(218,165,32,0.5)]"
              }`}
              data-testid={`tier-card-${tier.name.toLowerCase()}`}
            >
              {tier.popular && (
                <div className="absolute top-4 right-4 bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center mb-8">
                <h4 className={`text-2xl font-bold mb-2 ${tier.popular ? "text-white" : "text-gold"}`}>
                  {tier.name}
                </h4>
                <div className={`text-4xl font-bold mb-1 ${tier.popular ? "text-white" : "text-white"}`}>
                  {tier.price}
                </div>
                {tier.period && (
                  <div className={`mb-4 ${tier.popular ? "text-white/80" : "text-gray-400"}`}>
                    {tier.period}
                  </div>
                )}
                <p className={tier.popular ? "text-white/90" : "text-gray-300"}>
                  {tier.description}
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${tier.popular ? "text-white" : "text-green-500"}`} />
                    <span className={tier.popular ? "text-white" : "text-gray-200"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handleSelectTier(tier.registrationPath)}
                variant={tier.popular ? "secondary" : tier.buttonVariant}
                className={`w-full ${
                  tier.popular 
                    ? "bg-white text-gold-dark hover:bg-gray-100 cosmic-selection" 
                    : "border-2 border-gold text-gold hover:bg-gold hover:text-black cosmic-selection"
                }`}
                data-testid={`button-${tier.name.toLowerCase()}`}
              >
                {tier.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
