# Daily Game Tracker Design Document

## Overview
Daily Game Tracker is a web application that allows users to:
1. Paste their daily game results from various games (Wordle, Framed, GuessTheGame, etc.)
2. Automatically parse and store their scores
3. View their historical performance
4. Generate a daily summary of all their game scores

## Technical Stack

### Frontend
- **Framework**: React + TypeScript
  - Lightweight and widely used
  - TypeScript for better type safety and development experience
- **Styling**: TailwindCSS
  - Utility-first CSS framework for rapid UI development
  - No need for separate CSS files
- **State Management**: React Context + localStorage
  - Simple state management for user data
  - localStorage for persistent storage without need for backend initially

### Backend (Future Extension)
- Initially stateless, using localStorage
- Can be extended later with:
  - Node.js + Express
  - MongoDB for user data
  - JWT for authentication

## Core Features

### 1. Game Result Parser
- Regex-based parser for each supported game
- Example patterns:
```typescript
interface GamePattern {
  name: string;
  pattern: RegExp;
  scoreExtractor: (match: RegExpMatchArray) => GameScore;
}

interface GameScore {
  game: string;
  date: string;
  score: number;
  maxScore: number;
  won: boolean;
  shareText: string;
}
```

### 2. Supported Games
Initial support for:
- Conexo: "Joguei conexo.ws DD/MM/YYYY e consegui em N tentativas."
- Framed: "Framed #N 🎥 [emojis]"
- Gamedle: "🕹️ Gamedle: DD/MM/YYYY [emojis]"
- GuessTheGame: "#GuessTheGame #N 🎮 [emojis]"

### 3. Data Storage
```typescript
interface UserData {
  scores: {
    [date: string]: {
      [game: string]: GameScore;
    };
  };
}
```

### 4. Key Components

#### ResultInput Component
- Textarea for pasting game results
- Auto-detection of game type
- Immediate parsing and score display
- Error handling for invalid formats

#### DailyOverview Component
- Shows all games played today
- Visual representation of scores
- Generate sharable summary

#### History Component
- Calendar view of past games
- Statistics and trends
- Filterable by game type

#### ShareGenerator Component
- Generates a clean, formatted summary
- Example output:
```
📊 My Daily Games (07/02/2024)
🎮 GuessTheGame: 6/6
🎥 Framed: 6/6
🕹️ Gamedle: 3/6
🌈 Conexo: 5/6
```

## User Flow
1. User visits site
2. Pastes game result in input area
3. System automatically:
   - Identifies game type
   - Parses score and date
   - Stores result
4. User can:
   - View today's scores
   - Generate summary
   - View history

## Implementation Phases

### Phase 1: MVP
- Basic UI with TailwindCSS
- Result parsing for supported games
- localStorage data persistence
- Daily summary generation

### Phase 2: Enhanced Features
- User accounts
- Score statistics
- Game trends
- Social sharing

### Phase 3: Backend Integration
- User authentication
- Cloud data storage
- API for game results
- Friends and sharing features

## Development Setup
```bash
# Project setup
npm create vite@latest daily-game-tracker -- --template react-ts
cd daily-game-tracker
npm install

# Dependencies
npm install tailwindcss postcss autoprefixer
npm install @heroicons/react
npm install date-fns
```

## File Structure
```
src/
  components/
    ResultInput.tsx
    DailyOverview.tsx
    History.tsx
    ShareGenerator.tsx
  utils/
    parsers.ts      # Game-specific parsing logic
    storage.ts      # localStorage handling
    formatters.ts   # Date and text formatting
  types/
    games.ts        # TypeScript interfaces
  App.tsx
  main.tsx
```

## Security Considerations
- Input sanitization for pasted content
- Rate limiting for future API
- Secure storage of user data
- XSS prevention in rendered content

## Testing Strategy
- Unit tests for parsers
- Integration tests for components
- E2E tests for critical flows
- Test cases for various game result formats

## Future Enhancements
1. Browser extension for auto-capture
2. Mobile app version
3. Social features (friends, leaderboards)
4. Additional game support
5. Score analytics and insights
6. Achievements system

## Performance Considerations
1. Efficient regex patterns
2. Lazy loading of historical data
3. Caching of parsed results
4. Optimized localStorage usage
5. Compressed data storage format
