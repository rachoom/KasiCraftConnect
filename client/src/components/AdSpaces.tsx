import { Badge } from "@/components/ui/badge";
import { Wrench, Building, Truck } from "lucide-react";

const adSpaces = [
  {
    title: "Hardware Store",
    description: "Premium tools and building materials",
    icon: Wrench
  },
  {
    title: "Builders Warehouse",
    description: "Construction supplies & equipment rental",
    icon: Building
  },
  {
    title: "Material Delivery",
    description: "Fast delivery to your project site",
    icon: Truck
  }
];

export default function AdSpaces() {
  return (
    <section className="py-16 bg-gray-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-black-soft mb-4">Trusted Hardware Partners</h3>
          <p className="text-gray-600">Get everything you need for your project from our verified suppliers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {adSpaces.map((ad, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-300 text-center hover:border-green/30 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ad.icon className="w-8 h-8 text-gold-dark" />
              </div>
              <h4 className="font-semibold text-lg text-black-soft mb-2">{ad.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{ad.description}</p>
              <Badge variant="secondary" className="text-xs text-white/60 bg-gray-100">
                SPONSORED
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
