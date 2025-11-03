# Artisan Connect Far East Rand - Artisan Marketplace Platform

## Overview

Artisan Connect Far East Rand is a full-stack web application connecting customers with local artisans in the Brakpan and Far East Rand regions. The platform facilitates searching for and connecting with verified professionals in various trades, featuring a modern React frontend, a Node.js/Express backend, and an external Supabase PostgreSQL database. The platform rebranded from "Skills Connect" to "Artisan Connect Far East Rand" with a focus on local geographic service, aiming to be the premier marketplace for artisan services in the region.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
- Modern React 18 frontend with TypeScript.
- Shadcn/ui component library based on Radix UI, styled with Tailwind CSS and custom CSS variables.
- Framer Motion for smooth animations and transitions.
- Global dark theme (`bg-black`) with Royal Gold (`#DAA520`) accents and lime green elements for CTAs.
- Redesigned homepage with a simplified hero section, gold-bordered service category cards with background images, and a "Featured Artisans" section with circular avatars and direct contact options.
- Mobile-responsive navigation with a hamburger menu for smaller viewports.

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