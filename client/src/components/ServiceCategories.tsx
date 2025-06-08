import { useLocation } from "wouter";
import { getServiceIcon } from "@/lib/utils";

const services = [
  {
    id: "builders",
    name: "Builders",
    description: "Construction & renovation experts",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: "plumbers",
    name: "Plumbers",
    description: "Water & drainage specialists",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: "electricians",
    name: "Electricians",
    description: "Electrical installation & repair",
    image: "https://images.unsplash.com/photo-1609010697446-11f2155278f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: "carpenters",
    name: "Carpenters",
    description: "Custom woodwork & furniture",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: "tilers",
    name: "Tilers",
    description: "Floor & wall tiling experts",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: "cleaners",
    name: "Cleaners",
    description: "Home & office cleaning services",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  },
  {
    id: "landscapers",
    name: "Landscapers",
    description: "Garden design & maintenance",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  }
];

export default function ServiceCategories() {
  const [, setLocation] = useLocation();

  const selectService = (serviceId: string) => {
    setLocation(`/search?service=${serviceId}&location=&tier=basic`);
  };

  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-black-soft mb-4">Popular Services</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our most requested artisan services and find the perfect professional for your project.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className="group cursor-pointer"
              onClick={() => selectService(service.id)}
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cosmic-selection">
                <div className="absolute inset-0 opacity-45 group-hover:opacity-60 transition-opacity">
                  <img 
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                    <i className={`${getServiceIcon(service.id)} text-2xl text-gold-dark`} />
                  </div>
                  <h4 className="font-semibold text-lg text-black-soft mb-2">{service.name}</h4>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              </div>
            </div>
          ))}

          <div 
            className="group cursor-pointer"
            onClick={() => selectService("all")}
          >
            <div className="relative bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-white cosmic-glow">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-plus text-2xl text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">View All</h4>
                <p className="text-white/80 text-sm">Browse all available services</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
