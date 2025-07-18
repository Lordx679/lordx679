# Discord Projects Platform

## Overview

This is a full-stack web application for showcasing and managing Discord-related projects. The platform allows users to browse, search, and interact with various Discord projects including bots, servers, tools, and templates. It features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production bundling
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OAuth-based)
- **Session Management**: Express sessions with PostgreSQL storage

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Connection**: Neon serverless PostgreSQL
- **Schema Location**: Shared between client and server (`/shared/schema.ts`)

## Key Components

### Authentication System
- **Provider**: Replit OAuth integration
- **Session Storage**: PostgreSQL-backed sessions
- **User Management**: Automatic user creation/updates via OAuth
- **Admin System**: Role-based access control

### Project Management
- **Categories**: Bots, Servers, Tools, Templates, Designers
- **Features**: Search, filtering, likes, view tracking
- **Admin Controls**: Project creation, editing, publishing
- **Media Support**: GitHub integration, image uploads

### UI/UX Features
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Discord-inspired color scheme
- **Arabic Support**: RTL text direction
- **Interactive Components**: Modals, toasts, form validation

## Data Flow

1. **Authentication Flow**:
   - User redirects to Replit OAuth
   - Successful auth creates/updates user record
   - Session established with PostgreSQL storage

2. **Project Display Flow**:
   - Frontend queries projects API with filters
   - Backend retrieves from database with pagination
   - Real-time updates via TanStack Query

3. **Admin Operations**:
   - Role verification on protected routes
   - Form validation with Zod schemas
   - Database operations through Drizzle ORM

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless
- **Authentication**: Replit OAuth service
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS variables

### Development Tools
- **Build**: Vite with TypeScript
- **Database**: Drizzle Kit for migrations
- **Code Quality**: ESBuild for production builds

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `/dist/public`
2. **Backend**: ESBuild bundles server to `/dist/index.js`
3. **Database**: Drizzle pushes schema changes

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (automatically configured)
- `REPL_ID`: Replit environment identifier (automatically configured)

### Configuration Files
- `server/config.ts`: Contains GitHub OAuth credentials and session configuration
  - Update `GITHUB_CONFIG.clientId` with your GitHub OAuth App Client ID
  - Update `GITHUB_CONFIG.clientSecret` with your GitHub OAuth App Client Secret
  - Update `SESSION_CONFIG.secret` with a secure session secret for production

### Production Setup
- **Static Files**: Served from `/dist/public`
- **API Routes**: Express server handles `/api/*`
- **Database**: Automated schema synchronization
- **Sessions**: Persistent PostgreSQL storage

## Changelog
- July 02, 2025. Initial setup
- July 02, 2025. Updated authentication to use real user profile images instead of placeholder images
- July 02, 2025. Removed "GitHub" references from login buttons, using generic "تسجيل الدخول" instead
- July 02, 2025. Removed duplicate login button from landing page hero section
- July 02, 2025. Changed entire color scheme from Discord theme to modern purple/violet color palette
- July 02, 2025. Switched authentication system from Replit OAuth to GitHub OAuth only
- July 02, 2025. Set user lordx679 (ID: 190771533) as site admin with full permissions
- July 02, 2025. Redesigned to elegant dark theme with minimalist geometric elements inspired by modern SEO tools design
- July 02, 2025. Implemented real file upload system with multer for project files and images
- July 02, 2025. Fixed runtime error overlay issue by replacing category buttons with dropdown selector
- July 02, 2025. Added "مصممين" (Designers) category with custom delete confirmation modal
- July 03, 2025. Moved GitHub OAuth credentials from environment secrets to configuration file (server/config.ts) for easier hosting deployment
- July 03, 2025. Created comprehensive configuration system with environment-based config file (server/config.env.ts) containing all settings: database, auth, admin permissions, file uploads, security, and feature flags
- July 03, 2025. Updated all server files to use centralized configuration system instead of hardcoded values
- July 03, 2025. Enhanced admin system to support config-based admin user list alongside database admin flags
- July 04, 2025. Converted database system from PostgreSQL with Drizzle ORM to MongoDB with native driver
- July 04, 2025. Created MongoDB-compatible schema and storage layer with string-based IDs instead of numeric
- July 04, 2025. Implemented temporary in-memory storage for development until MongoDB connection is established
- July 04, 2025. Prepared project for Netlify deployment with comprehensive documentation and configuration files
- July 04, 2025. Created netlify.toml configuration, _redirects file for SPA routing, and API configuration system
- July 04, 2025. Added deployment guides in Arabic (NETLIFY-DEPLOYMENT-GUIDE.md) with step-by-step instructions
- July 04, 2025. Converted backend to Netlify Functions for complete single-platform deployment
- July 04, 2025. Created serverless API handlers in JavaScript for Netlify Functions compatibility
- July 04, 2025. Updated configuration to use /.netlify/functions as API endpoint with proper redirects
- July 04, 2025. Cleaned up duplicate configuration files - removed redundant server/config.ts and unified all settings in a single config file
- July 04, 2025. Updated session secret with secure production-ready value
- July 04, 2025. Created comprehensive .env file with all production environment variables including MongoDB connection, GitHub OAuth, and admin configuration
- July 04, 2025. Updated database URL to use correct MongoDB Atlas connection string with proper app name
- July 04, 2025. Fixed GitHub OAuth authentication by resolving session storage conflict between PostgreSQL and MongoDB
- July 04, 2025. Created new GitHub OAuth App (Client ID: Ov23lipN5ASsnC3ovIiv) with proper callback URLs for both Replit and Netlify
- July 04, 2025. Switched session storage from PostgreSQL to memory store for development compatibility with MongoDB backend
- July 04, 2025. Cleaned up project by removing documentation files, deployment guides, troubleshooting files, and unused assets to reduce project size and complexity

## User Preferences

Preferred communication style: Simple, everyday language.
User preference: Display real user profile pictures from their accounts instead of using placeholder images.
User preference: Remove specific "GitHub" text from login buttons.
User preference: Single login button instead of multiple buttons on landing page.
User preference: Modern purple/violet color scheme instead of Discord blue theme.
User preference: Use GitHub OAuth exclusively for authentication instead of multiple providers.
User preference: Elegant dark theme design with minimalist geometric elements inspired by modern SEO tools and professional dashboards.