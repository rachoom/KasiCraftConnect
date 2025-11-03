# Artisan Connect Far East Rand - Design Guidelines

## Design Approach
Premium marketplace aesthetic inspired by high-end service platforms (Thumbtack, Houzz) with a sophisticated dark theme. Focus on trust-building through professional presentation, clear service categorization, and prominent artisan showcasing.

## Typography
**Font Stack:** Inter for UI elements, Playfair Display for premium headings
- **Hero Headline:** Playfair Display, 56px/64px desktop, 36px/42px mobile, weight 700, white (#FFFFFF)
- **Section Headings:** Playfair Display, 40px/48px desktop, 28px/34px mobile, weight 600, Royal Gold (#DAA520)
- **Card Titles:** Inter, 24px/32px, weight 600, white
- **Body Text:** Inter, 16px/24px, weight 400, white with 90% opacity
- **Button Text:** Inter, 16px/20px, weight 600, uppercase tracking-wide
- **Labels/Meta:** Inter, 14px/20px, weight 500

## Layout System
**Spacing Units:** Tailwind scale - consistent use of 4, 6, 8, 12, 16, 24, 32 units
- **Section Padding:** py-24 desktop, py-16 mobile
- **Container Max Width:** max-w-7xl with px-6 horizontal padding
- **Card Spacing:** gap-8 desktop, gap-6 mobile
- **Component Inner Padding:** p-8 desktop, p-6 mobile

## Component Library

### Hero Section
Full-viewport hero (min-h-screen) with large background image showing artisan at work. Dark gradient overlay (black to transparent, 70% opacity top to bottom). Centered content with hero headline, subheading (20px Inter, white 80% opacity), and CTA button group. Primary CTA "Find Artisans" with blurred background (blur-md, bg-gold/20), gold border (border-2 border-gold), gold text, px-10 py-4. Secondary CTA "List Your Services" with similar blur treatment, white border, white text.

### Service Category Grid
4-column grid desktop (grid-cols-4), 2-column tablet (md:grid-cols-2), single column mobile. Each card: aspect-ratio-square, background image with dark overlay (bg-black/60), rounded-2xl. Hover state: overlay lightens to bg-black/40, scale-105 transform. Content positioned bottom-left with p-6: category icon (40px, gold), category name (24px Inter semibold, white), service count (14px, white 70% opacity).

### Featured Artisan Cards
3-column grid desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), single column mobile. Card structure: golden border (border-2 border-gold), rounded-3xl, bg-black, p-6. Top section: circular avatar (w-24 h-24 rounded-full, border-4 border-gold/30), name (20px Inter semibold), trade specialty (14px, gold). Middle: 5-star rating system (gold stars, 16px), review count, years of experience badge (bg-gold/10, text-gold, rounded-full px-4 py-2). Bottom: dual CTA buttons side-by-side - "Call Now" (bg-gold, text-black, rounded-xl px-6 py-3), "Email" (border-2 border-gold, text-gold, same padding).

### Service Highlights Section
Between categories and artisans. 3-column feature cards: icon in gold circle (w-16 h-16, bg-gold/10, border border-gold/30), feature title (20px white), description (16px white 80% opacity). Features: "Verified Professionals", "Instant Booking", "Satisfaction Guarantee".

### Trusted Partners Section
"Our Trusted Partners" heading centered. 6-column grid desktop (grid-cols-6), 3-column tablet, 2-column mobile. Cards: square aspect ratio, bg-zinc-900, rounded-xl, p-6, centered content. Partner logo placeholder (grayscale filter), "Sponsored" badge top-right (bg-gold/20, text-gold, text-xs, px-3 py-1, rounded-full, absolute top-2 right-2).

### Testimonials Carousel
Full-width section with bg-zinc-950. Single testimonial display: centered quote (28px Playfair italic, white), customer name and trade (16px Inter, gold), 5-star rating. Navigation dots below (gold active, white/30 inactive).

### Footer
Multi-column layout: Brand column (logo, "Far East Rand Home Worx" in Playfair 24px gold, tagline 14px white 70%), Quick Links column, Service Areas column, Contact column. All column headings 16px Inter semibold gold. Links 14px white 70% with hover:text-gold. Bottom bar: copyright, social icons (gold on hover), trust badges. Background: bg-zinc-950, border-top border-zinc-800.

## Images

**Hero Image:** High-quality photo of skilled craftsperson working (carpenter, metalworker, or artisan in action), warm natural lighting, showing tools and craftsmanship, 1920x1080 minimum. Position: center-center, object-cover.

**Service Category Cards (8 images needed):** 
- Carpentry: close-up of woodworking
- Plumbing: modern fixtures installation
- Electrical: professional wiring work
- Painting: interior painting scene
- Landscaping: garden transformation
- Roofing: professional on roof
- Masonry: brickwork detail
- General Handyman: toolkit/multiple skills

Each 800x800, bright professional photography with enough negative space for text overlay at bottom-left.

**Artisan Avatars:** Professional headshot photos, circular crop, diverse representation, 400x400.

**Partner Logos:** Monochrome/grayscale company logos, transparent background, 200x200.

All images optimized for web, WebP format preferred, with fallbacks.