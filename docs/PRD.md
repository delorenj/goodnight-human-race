# Product Requirements Document: Goodnight, Human Race v2.0

## Executive Summary

Enhance the existing "Goodnight, Human Race" application to allow customizable story themes, add irreverent humor, implement story persistence with Google Cloud services, and enable personal API key management.

## Project Overview

### Current State

- Single-page web app that explains complex topics through tiny cat metaphors
- Uses Google's Gemini AI for story and illustration generation
- Fixed theme (tiny cats) with predefined examples

### Future State

- Customizable story themes (e.g., "Cute monsters", "A naughty sledgehammer named Tonny")
- Irreverent humor that playfully contrasts children's book simplicity with serious topics
- Story persistence and retrieval via Google Cloud services
- Personal API key management for broader accessibility
- simple child-like music and sound effects to enhance user experience
- Slides will have either the default music or a "mood" track based on the context of the current slide. For example, a slide about a black hole might switch to a dramatic, suspenseful track on the slide where a cat is falling into a black hole. On a slide where a cat is rescued, it might switch to a happy, uplifting track.

## Core Features

### 1. Dynamic Theme System

**User Story**: As a user, I want to specify both a topic AND a theme for my story so I can enjoy different narrative styles.

**Requirements**:

- Add a second input field for "Story Theme" (placeholder: "e.g., Cute monsters, A naughty sledgehammer named Tonny")
- Default theme: "Tiny cats" (for backwards compatibility)
- Theme should influence both narrative style and illustration prompts
- Theme examples button showing creative possibilities

### 2. Irreverent Humor Integration

**User Story**: As a user, I want stories that subtly poke fun at the children's book format while explaining serious topics.

**Requirements**:

- Modify AI prompts to inject self-aware, irreverent humor
- Maintain innocent surface-level narrative while adding layers of adult humor
- Balance between educational content and entertainment
- Examples of humor style:
  - "The quantum particles danced with glee like they were at the Particle Junior Prom while their particle dates we standing alone drinking punch with the teachers."
  - "And like the big chungus it is, the black hole swallowed everything up in its path."

### 3. Story Persistence & History

**User Story**: As a user, I want to save and revisit my generated stories.

**Google Cloud Implementation**:

- **Firestore**: NoSQL database for story metadata and content
- **Cloud Storage**: Store generated images as files
- **Firebase Authentication**: Simple anonymous auth for story ownership

**Data Model**:

```typescript
interface Story {
  id: string;
  userId: string;
  title: string;
  topic: string;
  theme: string;
  content: StorySlide[];
  createdAt: timestamp;
  thumbnailUrl?: string;
}

interface User {
  id: string;
  apiKey?: string; // optional user-provided API key
  createdAt: timestamp;
}

interface Settings {
  apiKey?: string; // user-provided API key
  useIdeogram: boolean; // Optional setting for using ideogram images
  soundEnabled: boolean;
}

interface StorySlide {
  text: string;
  imageUrl: string;
  bgmUrl?: string;
  sfxUrl?: string;
  sfxDelay?: number; // delay in seconds before sound effect plays
  slideNumber: number;
  totalSlides: number;
  isLastSlide: boolean; // indicates if this is the last slide in the story
  isFirstSlide: boolean; // indicates if this is the first slide in the story
  isLoading: boolean; // indicates if the slide is currently loading
}
```

**UI Requirements**:

- Collapsible sidebar (left) showing story history
- Story entries display: title, theme icon
- Click to load previous story
- Delete option for each story
- Search/filter functionality (future enhancement)

### 4. Personal API Key Management

**User Story**: As a user, I want to use my own Gemini API key so I can use the app without restrictions.

**Requirements**:

- Settings modal/panel accessible via gear icon
- Secure client-side storage (localStorage with encryption)
- API key validation before saving
- Clear instructions with link to Google AI Studio
- Fallback to app's default key (if available) with usage limits
- Visual indicator showing which key is active

## Technical Architecture

### Frontend Enhancements

- **State Management**: Migrate from simple state object to Zustand
- **Routing**: Add simple client-side routing for story permalinks
- **Components**: Refactor monolithic index.tsx into modular components:
  - StoryGenerator
  - StorySidebar
  - StoryViewer
  - SettingsModal
  - ThemeSelector

### Google Cloud Services Stack

1. **Firebase (for simplicity and integration)**:

   - Firestore for story data
   - Firebase Storage for images
   - Firebase Auth (anonymous users)
   - Firebase Hosting (optional, for deployment)

2. **Setup Requirements**:
   - Firebase project initialization
   - Firestore security rules (users can only access their own stories)
   - Storage bucket configuration
   - Environment variables for Firebase config

### API Design

```typescript
// Story Operations
createStory(topic: string, theme: string): Promise<Story>
getMyStories(): Promise<Story[]>
getStory(storyId: string): Promise<Story>
deleteStory(storyId: string): Promise<void>

// User Operations
initializeUser(): Promise<User>
saveApiKey(encryptedKey: string): Promise<void>
```

## UI/UX Specifications

### Layout Updates

```
+------------------+--------------------------------+
|                  |                                |
|   Story          |         Story Viewer           |
|   Sidebar        |                                |
|   (Collapsible)  |   +------------------------+  |
|                  |   |    Query & Theme Input |  |
|   - Story 1      |   +------------------------+  |
|   - Story 2      |                                |
|   - Story 3      |   +------------------------+  |
|   ...            |   |                        |  |
|                  |   |    Story Slideshow     |  |
|   [Settings ⚙]   |   |                        |  |
|                  |   +------------------------+  |
+------------------+--------------------------------+
```

### Visual Design

- Components are all ShadCN
- Maintain existing whimsical aesthetic
- Add theme-based color accents
- Smooth transitions for sidebar toggle
- Loading states for story retrieval
- Empty states for new users

## Implementation Phases

### Phase 1: Theme System & Humor

- Add theme input field
- Update AI prompts for humor
- Modify image generation prompts
- Test various theme/topic combinations

### Phase 2: Google Cloud Setup

- Initialize Firebase project
- Configure Firestore and Storage
- Implement anonymous authentication
- Set up security rules

### Phase 3: Story Persistence

- Implement story saving logic
- Build story sidebar component
- Add story loading functionality
- Handle image storage and retrieval

### Phase 4: API Key Management

- Create settings UI
- Implement secure key storage
- Add key validation
- Update API client configuration

### Phase 5: Polish & Testing

- Performance optimization
- Error handling improvements
- Comprehensive testing
- Documentation updates

## Success Metrics

- User engagement: Average stories created per session
- Story revisit rate: % of stories viewed more than once
- Theme diversity: Variety of themes used
- API key adoption: % of users providing their own keys
- Performance: Story generation and load times meet user expectations

## Security Considerations

- API keys encrypted in localStorage
- Firebase security rules preventing cross-user access
- Rate limiting for default API key
- Input sanitization for theme and topic fields
- Content moderation for inappropriate themes

## Future Enhancements

- Social sharing capabilities
- Story templates and prompts
- Collaborative story creation
- Export to PDF/eBook format
- Voice narration using Google Cloud Text-to-Speech
- Multi-language support
- Premium features with Cloud Functions

## Development Guidelines

- Maintain backwards compatibility with existing stories
- Keep the app's whimsical character
- Prioritize mobile responsiveness
- Follow Google Cloud best practices
- Document all Firebase configurations
- Include comprehensive error messages

## Acceptance Criteria

1. Users can specify custom themes that meaningfully affect story output
2. Generated stories contain subtle, appropriate humor
3. All stories are automatically saved and retrievable
4. Users can manage their own API keys securely
5. The app remains performant with 100+ saved stories
6. All features work on mobile devices
7. Google Cloud services are properly configured and secured
