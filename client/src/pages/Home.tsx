import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
import HowItWorks from "@/components/HowItWorks";
import FeaturedArtisans from "@/components/FeaturedArtisans";
import PricingTiers from "@/components/PricingTiers";
import AdSpaces from "@/components/AdSpaces";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <ServiceCategories />
      <HowItWorks />
      <FeaturedArtisans />
      <PricingTiers />
      <AdSpaces />
      <Footer />
    </div>
  );
}
