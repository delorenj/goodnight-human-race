# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
"Goodnight, Human Race" is a Google AI Studio app that explains complex topics through whimsical stories about tiny cats, complete with AI-generated illustrations.

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture
- **Frontend**: Vanilla TypeScript with Vite build system
- **AI Integration**: Google Generative AI (Gemini 2.0 Flash) for story and image generation
- **UI Pattern**: Horizontal scrolling slideshow with snap-scroll behavior
- **State Management**: Simple state object with real-time streaming updates

## Key Implementation Details
- **API Key**: Requires `GEMINI_API_KEY` environment variable (loaded via Vite's `import.meta.env`)
- **Main Logic**: All application logic is in `index.tsx` with a single state management pattern
- **Streaming**: Uses Gemini's streaming API to progressively update the UI
- **Image Generation**: Each story sentence gets a corresponding minimal black ink illustration
- **Error Handling**: Comprehensive error states with user-friendly messages

## Code Structure
- `index.tsx`: Main application logic, state management, and AI integration
- `index.css`: Custom design system with light/dark mode support
- `index.html`: Entry point with font imports and root element
- Uses TypeScript strict mode with path alias `@/` for imports