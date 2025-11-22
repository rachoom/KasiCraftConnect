import { motion } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
import FeaturedArtisans from "@/components/FeaturedArtisans";
import TrustedPartners from "@/components/TrustedPartners";
import Footer from "@/components/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <motion.div 
      className="min-h-screen bg-black"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <Header />
      <motion.div variants={fadeInUp}>
        <Hero />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <ServiceCategories />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <FeaturedArtisans />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <TrustedPartners />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <Footer />
      </motion.div>
    </motion.div>
  );
}
