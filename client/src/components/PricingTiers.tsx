import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Basic",
    price: "FREE",
    description: "Access to unverified artisans",
    features: [
      "Up to 3 unverified artisan contacts",
      "Basic profile information",
      "Location-based matching",
      "Email support",
      "No verification guarantee"
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Premium",
    price: "R99",
    period: "per search",
    description: "Verified professionals only",
    features: [
      "Up to 5 verified artisans",
      "ID & qualification verified",
      "Detailed profiles & portfolios",
      "Customer reviews & ratings",
      "Priority matching algorithm",
      "Phone & chat support"
    ],
    buttonText: "Choose Premium",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Enterprise",
    price: "R299",
    period: "per month",
    description: "For businesses & contractors",
    features: [
      "Unlimited verified artisans",
      "Background checks included",
      "Advanced filtering options",
      "Project management tools",
      "Bulk hiring discounts",
      "Dedicated account manager"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false
  }
];

export default function PricingTiers() {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-black-soft mb-4">Service Tiers</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the level of service that best fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`rounded-2xl p-8 transition-colors ${
                tier.popular 
                  ? "bg-gradient-to-br from-gold to-gold-dark text-white relative overflow-hidden" 
                  : "bg-white border-2 border-gray-200 hover:border-gold/30"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-4 right-4 bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  POPULAR
                </div>
              )}
              
              <div className="text-center mb-8">
                <h4 className={`text-2xl font-bold mb-2 ${tier.popular ? "text-white" : "text-black-soft"}`}>
                  {tier.name}
                </h4>
                <div className={`text-4xl font-bold mb-1 ${tier.popular ? "text-white" : "text-black-soft"}`}>
                  {tier.price}
                </div>
                {tier.period && (
                  <div className={`mb-4 ${tier.popular ? "text-white/80" : "text-gray-600"}`}>
                    {tier.period}
                  </div>
                )}
                <p className={tier.popular ? "text-white/90" : "text-gray-600"}>
                  {tier.description}
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className={`w-5 h-5 mr-3 ${tier.popular ? "text-white" : "text-green-500"}`} />
                    <span className={tier.popular ? "text-white" : "text-gray-700"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.popular ? "secondary" : tier.buttonVariant}
                className={`w-full ${
                  tier.popular 
                    ? "bg-white text-gold-dark hover:bg-gray-100 cosmic-selection" 
                    : tier.buttonVariant === "outline" 
                    ? "border-2 border-gold text-gold hover:bg-gold hover:text-white cosmic-selection"
                    : "bg-gold hover:bg-gold-dark text-black cosmic-glow-static"
                }`}
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
