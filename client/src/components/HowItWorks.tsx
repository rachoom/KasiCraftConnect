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
            className="text-xl text-gray-300 max-w-2xl mx-auto"
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
          <motion.div 
            className="text-center p-6 border-2 border-green-500 rounded-lg"
            variants={stepVariants}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "rgba(218, 165, 32, 0.2)",
                transition: { duration: 0.2 }
              }}
            >
              <Search className="w-10 h-10 text-gold" />
            </motion.div>
            <h4 className="text-xl font-semibold text-white mb-4">Search & Describe</h4>
            <p className="text-gray-300 leading-relaxed">
              Tell us what service you need and your location. No account required - just search and find.
            </p>
          </motion.div>

          <motion.div 
            className="text-center p-6 border-2 border-green-500 rounded-lg"
            variants={stepVariants}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "rgba(218, 165, 32, 0.2)",
                transition: { duration: 0.2 }
              }}
            >
              <Star className="w-10 h-10 text-gold" />
            </motion.div>
            <h4 className="text-xl font-semibold text-white mb-4">Get Top Matches</h4>
            <p className="text-gray-300 leading-relaxed">
              We'll show you the top 3 verified artisans in your area with their ratings and contact details.
            </p>
          </motion.div>

          <motion.div 
            className="text-center p-6 border-2 border-green-500 rounded-lg"
            variants={stepVariants}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "rgba(218, 165, 32, 0.2)",
                transition: { duration: 0.2 }
              }}
            >
              <Handshake className="w-10 h-10 text-gold" />
            </motion.div>
            <h4 className="text-xl font-semibold text-white mb-4">Connect & Hire</h4>
            <p className="text-gray-300 leading-relaxed">
              Contact your chosen artisan directly and get your project started with confidence.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
