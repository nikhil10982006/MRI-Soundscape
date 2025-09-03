# MRI Soundscape - Patient Comfort Solutions

## Overview

MRI Soundscape is an AI-powered audio therapy platform designed to improve patient comfort during MRI scans by generating adaptive soundscapes that mask the harsh noise produced by MRI machines. The application combines sophisticated audio processing technology with a user-friendly interface to provide healthcare facilities with a comprehensive solution for reducing patient anxiety and improving scan completion rates.

The system generates customizable soundscapes (ocean waves, forest ambience, rain, instrumental music) that intelligently target and mask problematic frequency ranges specific to MRI noise patterns. Healthcare providers can create personalized audio sessions for patients, track usage analytics, and monitor the effectiveness of different soundscape types.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **Tailwind CSS + shadcn/ui**: Utility-first styling with pre-built accessible component library
- **Wouter Router**: Lightweight client-side routing for single-page application navigation
- **TanStack Query**: Server state management for API data fetching and caching

### Audio Processing System
- **Web Audio API**: Native browser audio processing for real-time sound generation and manipulation
- **Custom AudioProcessor Class**: Handles audio buffer management, frequency analysis, and real-time effects
- **Audio Visualizer**: Canvas-based frequency visualization for user feedback
- **Soundscape Generation**: Procedural audio generation for different therapeutic sound types

### Backend Architecture
- **Express.js Server**: RESTful API with TypeScript for type safety
- **Memory Storage Pattern**: In-memory data storage with interface abstraction for future database integration
- **Session Management**: Stateless session handling for soundscape customization and user tracking
- **Analytics Collection**: Event-driven analytics system for usage tracking and effectiveness measurement

### Data Management
- **Drizzle ORM**: Type-safe database abstraction layer configured for PostgreSQL
- **Schema-First Design**: Centralized data models in shared directory for type consistency
- **Zod Validation**: Runtime type validation for API requests and responses
- **Database Migrations**: Version-controlled schema changes through Drizzle migrations

### Component Architecture
- **Atomic Design Pattern**: Reusable UI components organized by complexity (atoms, molecules, organisms)
- **Custom Hooks**: Encapsulated business logic and state management (useToast, useMobile)
- **Context Providers**: Global state management for theme, tooltips, and query client
- **Responsive Design**: Mobile-first approach with adaptive layouts and touch-friendly interfaces

## External Dependencies

### Core Technologies
- **React 18**: Frontend framework with concurrent rendering features
- **TypeScript**: Static type checking for improved developer experience and code reliability
- **Vite**: Modern build tool with hot module replacement and optimized bundling
- **Express.js**: Lightweight web server framework for Node.js

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Headless component primitives for accessibility and keyboard navigation
- **shadcn/ui**: Pre-styled component library built on Radix primitives
- **Lucide React**: Consistent icon library with tree-shaking support

### Database and Validation
- **Drizzle ORM**: Modern TypeScript ORM with excellent type inference
- **PostgreSQL**: Primary database (configured via Neon serverless)
- **Zod**: Schema validation library for runtime type checking
- **@neondatabase/serverless**: Serverless PostgreSQL driver for edge deployment

### Audio and Media
- **Web Audio API**: Native browser audio processing capabilities
- **Canvas API**: For audio visualization and frequency analysis display
- **Date-fns**: Date manipulation and formatting utilities

### State Management
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **@hookform/resolvers**: Integration layer for Zod validation with React Hook Form

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution engine for development server
- **PostCSS**: CSS processing pipeline with Autoprefixer
- **Replit Integration**: Development environment plugins and runtime error handling