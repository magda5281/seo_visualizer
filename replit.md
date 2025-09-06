# replit.md

## Overview

This is a full-stack SEO analysis tool built with React, Express, and TypeScript. The application allows users to input URLs and receive comprehensive SEO analysis including meta tags, Open Graph data, Twitter Cards, and actionable recommendations. The tool provides visual previews of how the website appears in Google search results and social media platforms, along with a calculated SEO score and detailed improvement suggestions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with `/api/analyze` endpoint for SEO analysis
- **Data Processing**: Cheerio for HTML parsing and meta tag extraction
- **HTTP Client**: Axios for external website fetching with proper headers

### Data Storage Solutions
- **Development Storage**: In-memory storage using Map data structure for development/testing
- **Database Schema**: Drizzle ORM with PostgreSQL schema definition ready for production
- **Migration System**: Drizzle Kit for database migrations and schema management

### Core Features
- **SEO Analysis Engine**: Extracts and analyzes title tags, meta descriptions, Open Graph tags, and Twitter Cards
- **Scoring Algorithm**: Calculates SEO scores based on tag presence, character limits, and best practices
- **Preview Generation**: Creates visual previews for Google search results and social media platforms
- **Recommendation System**: Provides actionable suggestions for SEO improvements

### Development Experience
- **Type Safety**: Full TypeScript coverage with shared types between frontend and backend
- **Code Quality**: ESLint and Prettier for consistent code formatting
- **Hot Reload**: Vite HMR for fast development iteration
- **Error Handling**: Comprehensive error boundaries and API error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connector for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **axios**: HTTP client for external API requests
- **cheerio**: Server-side HTML parsing and manipulation
- **zod**: Runtime type validation and schema definition

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Icon library with consistent design

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **eslint**: Code linting and quality enforcement
- **drizzle-kit**: Database migration and schema management tools

### Form and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration between React Hook Form and validation libraries

### Build and Deployment
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution environment for development