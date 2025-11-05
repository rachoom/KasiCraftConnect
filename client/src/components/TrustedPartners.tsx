import { motion } from "framer-motion";
import { Store, Truck, Wrench } from "lucide-react";

const partners = [
  {
    id: 1,
    name: "Build-It Brakpan",
    type: "Hardware Store",
    icon: Store,
    description: "Complete building materials & hardware supplies",
    sponsored: true
  },
  {
    id: 2,
    name: "FastDeliver SA",
    type: "Material Delivery",
    icon: Truck,
    description: "Same-day delivery of building materials across Far East Rand",
    sponsored: true
  },
  {
    id: 3,
    name: "ToolHire Pro",
    type: "Tool Rental",
    icon: Wrench,
    description: "Professional-grade tool rentals for artisans & DIY",
    sponsored: true
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
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

export default function TrustedPartners() {
  return (
    <section className="py-16 lg:py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-gold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our Trusted Partners
          </motion.h3>
          <motion.p 
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Local businesses supporting our artisan community with quality materials and services.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {partners.map((partner) => {
            const Icon = partner.icon;
            return (
              <motion.div
                key={partner.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="relative bg-zinc-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green/30 hover:border-green/30 h-full">
                  {partner.sponsored && (
                    <div className="absolute top-4 right-4 bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full border border-green/30">
                      SPONSORED
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6 border-2 border-green/30">
                      <Icon className="w-10 h-10 text-gold" />
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white mb-2">
                      {partner.name}
                    </h4>
                    
                    <p className="text-gold font-semibold text-sm mb-4">
                      {partner.type}
                    </p>
                    
                    <p className="text-white/80 text-sm leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
