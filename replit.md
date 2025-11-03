# Artisan Connect Far East Rand - Artisan Marketplace Platform

## Overview

Artisan Connect Far East Rand is a full-stack web application that connects customers with trusted local artisans in the Brakpan area and surrounding Far East Rand regions. The platform serves as a marketplace where users can search for verified professionals in various trades like builders, plumbers, electricians, and more. The application features a modern React frontend with a Node.js/Express backend, utilizing external Supabase PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and build processes
- **Animations**: Framer Motion for page transitions and animations

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **Development Server**: tsx for TypeScript execution

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express backend
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   └── seed.ts           # Database seeding
├── shared/                # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── migrations/           # Database migrations
```

## Key Components

### Database Schema
The application uses three main entities:
- **Users**: Authentication and user management
- **Artisans**: Professional service providers with verification status
- **Search Requests**: Tracking of search queries and pricing tiers

### Authentication System
- Simple username/password authentication for regular users
- Session-based authentication with PostgreSQL session store
- **Secure admin authentication system** with:
  - Email/password login with verification
  - JWT-based session management
  - Email verification for new admin accounts
  - Google OAuth integration support
  - Protected admin routes with token validation

### Artisan Subscription Tiers
Artisan Connect Far East Rand implements a three-tier artisan system with offline payment handling:

- **Unverified (Free)**: 
  - Instant registration with basic information
  - Profiles clearly marked as "Unverified"
  - Lower priority in search results
  - No access to reviews or photo gallery
  - Ideal for artisans starting out

- **Verified (R100/month)**: 
  - Requires admin approval with document verification
  - ID document and qualification uploads required
  - Priority placement in search results
  - Verified badge on profile
  - Access to customer review system
  - Photo gallery for showcasing work

- **Verified + Marketing (R299/month)**: 
  - All verified tier benefits
  - Highest priority in search results
  - Premium Marketing badge
  - Enhanced visibility and marketing features

### Registration & Verification System
- **Unverified Registration**: Simple form with instant profile creation
- **Verified Application**: Detailed form with document uploads
  - ID document verification
  - Qualification certificate uploads
  - Company registration number (optional)
  - Admin review and approval workflow
- **Offline Payment**: Artisans pay subscription fees offline before/after approval
- **Approval Status**: pending → approved/rejected workflow with admin notes

## Data Flow

1. **User Search**: Users search for artisans by service type and location
2. **Tier-based Results**: Results are filtered based on selected pricing tier
3. **Artisan Profiles**: Detailed profiles show ratings, reviews, and contact information
4. **Direct Contact**: Users contact artisans directly via provided contact details
5. **Admin Management**: Admins can review, approve, or reject artisan applications

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **wouter**: Lightweight React router
- **framer-motion**: Animation library

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Replit Configuration
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: `npm run build` creates optimized bundles
- **Deployment**: Autoscale deployment target on port 80

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

### Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Assets**: Static files served from built frontend

## Changelog

```
Changelog:
- June 15, 2025. Initial setup
- June 15, 2025. Added comprehensive admin authentication system with email verification
- June 15, 2025. Implemented secure admin review and approval workflow for artisan applications
- June 15, 2025. Hidden admin access from public menu, now requires login at /admin/login
- September 1, 2025. Created artisan subscription system with database tables and document upload functionality
- September 1, 2025. Updated header styling to black background with gold text and elegant typography
- September 1, 2025. Implemented full artisan subscription workflow with premium/enterprise tiers
- September 1, 2025. Rebranded from "Kasi Connect" to "Skills Connect" with updated headline "Find Trusted Skills in your area"
- September 3, 2025. Fixed critical artisan authentication routing issue - specific routes now come before wildcard routes
- September 3, 2025. Resolved login endpoint conflicts and ensured proper API routing for artisan authentication
- September 3, 2025. Fixed header navigation visibility issues and made all navigation links accessible on all screen sizes
- October 16, 2025. Implemented three-tier artisan system: Unverified (Free), Verified (R100/month), Verified+Marketing (R299/month)
- October 16, 2025. Added subscriptionTier field to database and updated search prioritization to favor premium/verified artisans
- October 16, 2025. Created dual registration paths: instant for unverified, admin approval for verified tiers
- October 16, 2025. Built UnverifiedRegistrationForm and VerifiedApplicationForm with document upload support
- October 16, 2025. Updated artisan profiles to display tier-specific badges and restrict features by tier
- October 16, 2025. Removed "Pricing" navigation link and added backend routes for new registration flows
- October 16, 2025. Implemented search result prioritization: Premium > Verified > Unverified, then by rating
- October 16, 2025. Added Ekurhuleni pilot badge next to Skills Connect logo in header navigation
- October 16, 2025. Added "Quick Search" heading above home page search form for better UX
- October 16, 2025. Changed "View All" service card to "More Services Coming" with updated description
- October 16, 2025. Added green borders (border-green-500) around all three steps in "How It Works" section
- October 16, 2025. Applied golden glow hover effect (cosmic-glow-static class) to artisan profile cards in search results
- October 16, 2025. Changed verified badge color from gold to green (text-green-600 border-green-500) across the site
- October 16, 2025. Fixed critical database issue: added approvalStatus='approved' to all artisans so they appear in search results
- October 16, 2025. Updated seed.ts to include approvalStatus and subscriptionTier fields for all new artisan records
- October 16, 2025. Fixed React nesting warning by removing nested <a> tags in header navigation Link component
- October 16, 2025. Enhanced verified badge prominence: larger size with checkmark (✓ Verified) and green styling
- October 16, 2025. Added subtle green borders (border-green-500/50) to verified artisan cards for increased visual distinction
- October 16, 2025. Implemented unverified badge with info icon and tooltip explaining self-reported status
- October 16, 2025. Added sticky CTA banner at bottom of search results to convert artisans: "Are you a skilled artisan? Get listed for free!"
- October 17, 2025. Implemented global dark theme - changed all page backgrounds from white/light to black (bg-black) across entire site
- October 17, 2025. Added visual icons to "How It Works" section - Search (magnifying glass), Star (ratings), and Handshake (connect) icons with gold styling
- October 17, 2025. Implemented location autofill/autocomplete functionality on category pages (ServiceLanding) with dropdown suggestions
- October 17, 2025. Changed "Quick Search" heading color to light green (text-green-500) for enhanced visibility on dark background
- October 17, 2025. Fixed text readability across all pages - updated text colors to white/light gray for proper contrast on dark backgrounds
- October 17, 2025. Updated SearchResults page with readable artisan card text: white headings, light gray descriptions and details
- October 17, 2025. E2E tested and verified: dark theme, icons, autofill, and text readability all working correctly
- October 18, 2025. Fixed global navigation links: changed header anchor links from #services/#how-it-works to /#services/#how-it-works so they work from all pages, not just homepage
- October 18, 2025. Added Header and Footer components to Contact Us page for consistent site-wide navigation
- October 18, 2025. Restricted all location dropdowns to show only Ekurhuleni areas (removed Johannesburg, Cape Town, Durban, Pretoria)
- October 18, 2025. Added "Mechanics" service category across entire platform: ServiceCategories card, ServiceLanding page info, registration forms, and router (/service/mechanics)
- October 18, 2025. Changed Quick Search heading color from text-green-500 to text-lime-400 for brighter lime yellow-green appearance
- October 18, 2025. E2E tested and verified: navigation links, Contact page header/footer, Ekurhuleni-only locations, Mechanics category, and lime-400 color all working correctly
- October 18, 2025. Reworked Artisan Service Tiers (PricingTiers.tsx) - changed content from user-focused to artisan-focused with benefits of joining platform
- October 18, 2025. Updated tier cards: Unverified (Free), Verified (R100/month), Verified + Marketing (R299/month) with golden glowing borders and navigation to /artisan registration
- October 18, 2025. Changed service category card titles from black to golden color (text-gold) across all service cards on homepage
- October 18, 2025. Updated "How Skills Connect Works" cards - changed borders from green to lime-400 (matches Quick Search heading) and added background images
- October 18, 2025. E2E tested and verified: golden service titles, lime-400 borders with background images, golden tier cards with navigation, and unverified registration flow all working correctly
- November 3, 2025. Rebranded from "Skills Connect" to "Artisan Connect Far East Rand" - changed header branding and geographic focus from Ekurhuleni to Brakpan and Far East Rand
- November 3, 2025. Updated footer branding to "Far East Rand Home Worx" with coverage areas: Brakpan, Benoni, Springs, Nigel, Daveyton
- November 3, 2025. Migrated entire codebase to external Supabase database with full camelCase ↔ snake_case conversion system in storage layer
- November 3, 2025. Complete homepage redesign: simplified hero with "Find Local Artisans in the Far East Rand, Free." heading and two CTA buttons (removed search box)
- November 3, 2025. Redesigned service category cards with dark theme, golden borders, background images with overlays: Builders, Plumbers, Electricians, Painters, Tilers, Carpenters, Landscapers, Mechanics + "More Services Coming"
- November 3, 2025. Rebuilt Featured Artisans section to show 4 profile cards (instead of 3) with circular avatars, ratings, Call Now and Email buttons, golden borders on dark background
- November 3, 2025. Added "Contact us to be featured here" link below Featured Artisans section
- November 3, 2025. Created new Trusted Partners section with 3 sponsored cards: Hardware Store (Build-It Brakpan), Material Delivery (FastDeliver SA), Tool Rental (ToolHire Pro)
- November 3, 2025. Removed Quick Search section, PricingTiers component, and HowItWorks section from homepage
- November 3, 2025. Cleaned up header navigation: removed "How It Works" link, renamed "View Profiles" to "Artisans", updated CTA button to "Register as an Artisan"
- November 3, 2025. Updated footer with new structure: Services column, Coverage Area column with Brakpan locations, Contact Us column with phone/email
- November 3, 2025. Verified all homepage changes with architect review - homepage redesign complete and production-ready with Royal Gold (#DAA520) theme on black backgrounds
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```