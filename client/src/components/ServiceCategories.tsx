import { motion } from "framer-motion";
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
  },
  {
    id: "mechanics",
    name: "Mechanics",
    description: "Vehicle repair & maintenance",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function ServiceCategories() {
  const [, setLocation] = useLocation();

  const selectService = (serviceId: string) => {
    setLocation(`/service/${serviceId}`);
  };

  return (
    <section id="services" className="py-16 lg:py-24 bg-gray-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-black-soft mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Verified Artisans
          </motion.h3>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Browse our most requested artisan services and find the perfect professional for your project.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              variants={itemVariants}
              className="group cursor-pointer"
              onClick={() => selectService(service.id)}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
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
            </motion.div>
          ))}

          <motion.div 
            className="group cursor-pointer"
            onClick={() => selectService("all")}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-white cosmic-glow">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-plus text-2xl text-white" />
                </div>
                <h4 className="font-semibold text-lg mb-2">More Services Coming</h4>
                <p className="text-white/80 text-sm">We're expanding our service categories</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
