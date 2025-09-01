export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-black-soft mb-4">How Skills Connect Works</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get connected with trusted artisans in just three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-gold-dark">1</span>
            </div>
            <h4 className="text-xl font-semibold text-black-soft mb-4">Search & Describe</h4>
            <p className="text-gray-600 leading-relaxed">
              Tell us what service you need and your location. No account required - just search and find.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-gold-dark">2</span>
            </div>
            <h4 className="text-xl font-semibold text-black-soft mb-4">Get Top Matches</h4>
            <p className="text-gray-600 leading-relaxed">
              We'll show you the top 3 verified artisans in your area with their ratings and contact details.
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-gold-dark">3</span>
            </div>
            <h4 className="text-xl font-semibold text-black-soft mb-4">Connect & Hire</h4>
            <p className="text-gray-600 leading-relaxed">
              Contact your chosen artisan directly and get your project started with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
