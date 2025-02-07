export interface GamePattern {
  name: string;
  pattern: RegExp;
  scoreExtractor: (match: RegExpMatchArray) => GameScore;
}

export interface GameScore {
  game: string;
  date: string;
  score: number;
  maxScore: number;
  won: boolean;
  shareText: string;
}

export interface UserData {
  scores: {
    [date: string]: {
      [game: string]: GameScore;
    };
  };
}

export type GameType = 'conexo' | 'framed' | 'gamedle' | 'guessthegame';

export interface ParsedResult {
  success: boolean;
  game?: GameType;
  score?: GameScore;
  error?: string;
}
