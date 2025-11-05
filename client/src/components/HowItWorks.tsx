import { motion } from "framer-motion";
import { Search, Star, Handshake } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3
    }
  }
};

const stepVariants = {
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
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const steps = [
  {
    icon: Search,
    title: "Search & Describe",
    description: "Tell us what service you need and your location. No account required - just search and find.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  },
  {
    icon: Star,
    title: "Get Top Matches",
    description: "We'll show you the top 3 verified artisans in your area with their ratings and contact details.",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  },
  {
    icon: Handshake,
    title: "Connect & Hire",
    description: "Contact your chosen artisan directly and get your project started with confidence.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            How Skills Connect Works
          </motion.h3>
          <motion.p 
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Get connected with trusted artisans in just three simple steps.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="relative text-center p-6 border-2 border-lime-400 rounded-lg overflow-hidden"
              variants={stepVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              data-testid={`step-card-${index + 1}`}
            >
              <div className="absolute inset-0 opacity-20">
                <img 
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <motion.div 
                  className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "rgba(218, 165, 32, 0.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <step.icon className="w-10 h-10 text-gold" />
                </motion.div>
                <h4 className="text-xl font-semibold text-white mb-4">{step.title}</h4>
                <p className="text-white/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
