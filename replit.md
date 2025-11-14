# Aceso - AI Mental Health Companion

## Overview

Aceso is an AI-powered mental health and emotional wellness companion application. The platform enables users to record daily thoughts through text or voice input, track mood patterns over time, receive AI-driven emotional analysis, engage with an empathetic AI assistant, and access personalized coping strategies. The application emphasizes emotional safety, gentle design, and non-judgmental support while encouraging professional help when appropriate.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI Framework**: Shadcn/ui component library built on Radix UI primitives, providing accessible, customizable components with a "new-york" style configuration. Tailwind CSS handles all styling with custom design tokens for colors, spacing, and typography.

**Design Philosophy**: The application follows a "reference-based approach" inspired by wellness apps like Headspace, Calm, and Bearable. Core principles include emotional comfort first, gentle clarity, progressive trust, and generous spacing. Typography uses DM Sans and Inter fonts for a clean, humanist aesthetic. The color system employs soft, muted tones with gentle contrasts to avoid harsh visual elements.

**Routing**: Wouter library for lightweight client-side routing with pages for Dashboard, Journal, Insights, AI Assistant, Coping Strategies, and Connect (therapist connection).

**State Management**: TanStack Query (React Query) for server state management with aggressive caching strategies (staleTime: Infinity) to minimize unnecessary refetches. Local component state uses React hooks.

**Theme System**: Custom theme provider supporting light and dark modes with localStorage persistence. CSS custom properties define color tokens that adapt to theme changes.

### Backend Architecture

**Runtime**: Node.js with Express.js handling HTTP routing and middleware.

**API Design**: RESTful API with JSON payloads. Key endpoints include:
- POST /api/journal - Create journal entries with emotion analysis
- GET /api/journal - Retrieve journal entries
- GET /api/insights - Fetch mood insights and analytics
- POST /api/chat - Interact with AI assistant
- GET /api/strategies - Retrieve personalized coping strategies

**Development Mode**: Vite middleware integration for hot module replacement and seamless frontend-backend development experience.

**Storage Layer**: Abstracted storage interface (IStorage) currently implemented with in-memory storage (MemStorage class). The architecture supports future migration to persistent database storage without changing application logic.

### Data Storage Solutions

**Database ORM**: Drizzle ORM configured for PostgreSQL with schema definitions in shared/schema.ts. The schema defines journal entries with support for text content, input mode (text/voice), timestamps, JSON-based emotion analysis, and mood ratings.

**Database Provider**: Neon serverless PostgreSQL configured via @neondatabase/serverless driver.

**Schema Design**: 
- Journal entries table stores content, metadata, and embedded emotion analysis as JSONB
- Emotion analysis includes primary/secondary emotions, sentiment scoring, confidence levels, intensity, themes, and AI-generated summaries
- UUID primary keys generated server-side

**Migration Strategy**: Drizzle Kit handles schema migrations with a "push" workflow for rapid development.

### External Dependencies

**AI Services**:
- **Google Gemini AI** (gemini-2.5-flash model): Powers the conversational text-based AI assistant with system instructions for empathetic, supportive responses. Maintains conversation history (last 5 messages) for context. Configured to detect crisis situations and recommend professional resources.
- **OpenAI** (gpt-5 model): Handles emotional analysis of journal entries, providing structured JSON responses with emotion classification, sentiment scoring, confidence levels, intensity measurement, theme extraction, and supportive summaries.
- **Vapi AI** (@vapi-ai/web SDK): Provides real-time voice conversation capabilities for the AI assistant. Integrates with OpenAI's GPT-4o-mini model for conversation and OpenAI's Nova voice for natural speech. Uses Deepgram Nova-2 for voice transcription. Voice sessions support mute/unmute controls, volume monitoring, and live transcription display in the chat interface. API key configured via VAPI_API_KEY environment variable and exposed to frontend as VITE_VAPI_API_KEY through client/.env.

**Authentication**: Currently not implemented. The application assumes single-user or development mode without user authentication.

**Third-Party UI Libraries**:
- Radix UI for accessible component primitives
- Recharts for data visualization (mood trends, emotion distribution charts)
- date-fns for date formatting and manipulation
- Lucide React for iconography
- class-variance-authority and clsx for dynamic styling

**Development Tools**:
- TypeScript for type safety across frontend, backend, and shared code
- ESBuild for production server bundling
- Tailwind CSS with PostCSS for styling
- Replit-specific plugins for development banner and cartographer integration

**Browser APIs**: Web Speech API (SpeechRecognition) for voice input functionality in journal entries and assistant chat.