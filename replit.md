# Skills Connect - Artisan Marketplace Platform

## Overview

Skills Connect is a full-stack web application that connects customers with trusted local artisans across South Africa. The platform serves as a marketplace where users can search for verified professionals in various trades like builders, plumbers, electricians, and more. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence.

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
Skills Connect implements a three-tier artisan system with offline payment handling:

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
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```