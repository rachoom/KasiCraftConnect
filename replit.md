# SKILLS CONNECT - Far East Rand Artisan Marketplace Platform

## Overview

SKILLS CONNECT is a full-stack web application connecting customers with local artisans in the Brakpan and Far East Rand regions. The platform facilitates searching for and connecting with verified professionals in various trades, featuring a modern React frontend, a Node.js/Express backend, and an external Supabase PostgreSQL database. The brand name "SKILLS CONNECT" is displayed using a distinctive bold gold typography on black background, with "Far East Rand" as a subtitle to emphasize the local geographic service area. The platform aims to be the premier marketplace for artisan services in the Far East Rand region.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
- Form error messages styled with dark red background (bg-red-950/60), red border, and padding for high visibility.
- Email buttons on artisan profiles use golden border (border-2 border-gold) and golden text matching brand colors.
- **Rating/Review System Removed**: All star ratings, review counts, and review sections removed from the platform as this feature is not yet available.
- Modern React 18 frontend with TypeScript.
- Shadcn/ui component library based on Radix UI, styled with Tailwind CSS and custom CSS variables.
- Framer Motion for smooth animations and transitions.
- **PERMANENT DARK THEME**: Black background (#000000) enforced site-wide for ALL users regardless of system preferences. Dark theme CSS variables are set as default in `:root` to ensure consistent appearance.
- **Brand Colors - Black/Gold/Green Theme**:
  - **Warm Amber Gold** (#D4A54A / hsl(40, 60%, 55%)): Primary gold color used throughout site for branding, headings, borders, and CTA buttons
  - **Deep Forest Green** (#1a4d2e / hsl(146, 50%, 20%)): Used for ALL borders and accents (typically at 30% opacity for subtle styling)
  - **White**: Body text with varying opacity (text-white, text-white/80, text-white/60)
  - NO gray text allowed on dark backgrounds for maximum contrast and visibility
- **Branding**:
  - Header displays "SKILLS CONNECT" using the official brand image (bold uppercase bright yellow typography) at size h-24 sm:h-28 md:h-32 lg:h-40 (96px to 160px) for maximum visibility and legibility
  - Logo icon REMOVED from header - only brand text image displayed for cleaner layout
  - "Far East Rand" subtitle positioned horizontally to the RIGHT of brand logo, vertically centered for clean layout
  - Brand consistency maintained across all platforms with exact font and colors matching brand image (#E0B82E)
  - "Register as an Artisan" button uses bright yellow background (bg-gold) with black text for high contrast
  - Header height increased to h-28 md:h-32 lg:h-40 (112px to 160px) to accommodate large branding
- Hero section features darker overlay (95% opacity) for optimal text readability against background images.
- Redesigned homepage with a simplified hero section, green-bordered service category cards with background images, and a "Featured Artisans" section with circular avatars and direct contact options.
- Featured Artisans cards redesigned with:
  - Golden borders (border-2 border-gold/80) matching reference design
  - Profile images in circles with User icon placeholders
  - Featured badge for verified/premium artisans
  - Contact information displayed (phone, email) with icons
  - "Call Now" button (gold background, black text) and "Email" button (outlined)
  - No rating/review elements (feature not yet available)
- Mobile-responsive navigation with a hamburger menu for smaller viewports.
- All cards use `bg-zinc-900` with thin `border-2 border-green/30` for consistent styling with deep forest green borders at 30% opacity.
- Status badges use green for success states, maintaining the black/gold/green theme consistency.
- Footer features green top border (`border-t-2 border-green/30`) separating it from page content.
- All custom CSS color utilities properly use `hsl()` wrapper around CSS variables for correct color rendering.

### Technical Implementations
- **Frontend**: React 18, Wouter for routing, TanStack Query for state management, Vite for building.
- **Backend**: Node.js with Express.js (TypeScript), Drizzle ORM for database interactions.
- **Database**: External Supabase PostgreSQL with `camelCase` to `snake_case` conversion in the storage layer.
- **Authentication**: Session-based user authentication, and a secure admin authentication system with email/password, JWT, email verification, and Google OAuth support.
- **Artisan Tiers**: Implemented a three-tier subscription system (Unverified, Verified, Verified + Marketing) with offline payment handling and admin approval workflows, influencing search prioritization.
- **Registration**: Dual registration paths for artisans: instant for unverified, and detailed application with document uploads for verified tiers.
- **Search**: Location autofill/autocomplete functionality, restricted to Ekurhuleni areas (Brakpan, Benoni, Springs, Nigel, Daveyton).
- **Deployment**: Node.js 20 runtime, PostgreSQL 16, `npm run dev` for local development, `npm run build` for production, deployed to Autoscale on port 80.

### Feature Specifications
- Artisan profiles display tier-specific badges and restrict features based on subscription level.
- Admin panel for reviewing and approving artisan applications.
- "Trusted Partners" section on the homepage featuring sponsored cards.
- Cleaned-up header navigation with "Artisans", "Contact", and "Register as an Artisan" links.
- Updated footer with Services, Coverage Area (Brakpan locations), and Contact Us columns.
- All service routes including Painters properly configured to avoid 404 errors.
- ViewProfiles filter order: Service → Location → Status → Search.
- Logo increased to w-12 h-12 (mobile) and w-14 h-14 (desktop) for better visibility.

## External Dependencies

- **@neondatabase/serverless**: For serverless PostgreSQL connections.
- **drizzle-orm**: Type-safe ORM for PostgreSQL.
- **@tanstack/react-query**: For server state management in React.
- **@radix-ui/**: Headless UI components used by Shadcn/ui.
- **wouter**: Lightweight client-side router for React.
- **framer-motion**: Animation library for UI transitions.
- **Supabase PostgreSQL**: External database provider.
- **Vite**: Frontend build tool.
- **TypeScript**: For type safety across the stack.
- **Tailwind CSS**: Utility-first CSS framework.
- **ESBuild**: Backend bundler.