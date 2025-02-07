import { GamePattern, GameScore, GameType, ParsedResult } from '../types/games';
import { format } from 'date-fns';

const countEmojis = (text: string, emoji: string): number => {
  return (text.match(new RegExp(emoji, 'g')) || []).length;
};

const gamePatterns: GamePattern[] = [
  {
    name: 'conexo',
    pattern: /Joguei conexo\.ws (\d{2}\/\d{2}\/\d{4}) e consegui em (\d+) tentativas\.\s*((?:[\u2B1B\u2B1C]|\uD83D[\uDFE5-\uDFE9])+)/,
    scoreExtractor: (match: RegExpMatchArray): GameScore => {
      const [_, date, attempts, emojis] = match;
      return {
        game: 'conexo',
        date,
        score: parseInt(attempts),
        maxScore: 6,
        won: true, // Conexo always shows successful attempts
        shareText: match[0]
      };
    }
  },
  {
    name: 'framed',
    pattern: /Framed #(\d+)\s*🎥\s*((?:🟥|🟩|⬛|⬜)+)/,
    scoreExtractor: (match: RegExpMatchArray): GameScore => {
      const [fullMatch, id, emojis] = match;
      const score = countEmojis(emojis, '🟥|🟩|⬛|⬜');
      const won = emojis.includes('🟩');
      return {
        game: 'framed',
        date: format(new Date(), 'dd/MM/yyyy'),
        score,
        maxScore: 6,
        won,
        shareText: fullMatch
      };
    }
  },
  {
    name: 'gamedle',
    pattern: /🕹️ Gamedle: (\d{2}\/\d{2}\/\d{4}) ((?:🟥|🟩|⬛|⬜)+)/,
    scoreExtractor: (match: RegExpMatchArray): GameScore => {
      const [fullMatch, date, emojis] = match;
      const score = countEmojis(emojis, '🟥|🟩|⬛|⬜');
      const won = emojis.includes('🟩');
      return {
        game: 'gamedle',
        date,
        score,
        maxScore: 6,
        won,
        shareText: fullMatch
      };
    }
  },
  {
    name: 'guessthegame',
    pattern: /#GuessTheGame #(\d+)\s*🎮\s*((?:🟥|🟩|⬛|⬜)+)/,
    scoreExtractor: (match: RegExpMatchArray): GameScore => {
      const [fullMatch, id, emojis] = match;
      const score = countEmojis(emojis, '🟥|🟩|⬛|⬜');
      const won = emojis.includes('🟩');
      return {
        game: 'guessthegame',
        date: format(new Date(), 'dd/MM/yyyy'),
        score,
        maxScore: 6,
        won,
        shareText: fullMatch
      };
    }
  }
];

export const parseGameResult = (text: string): ParsedResult => {
  try {
    for (const pattern of gamePatterns) {
      const match = text.match(pattern.pattern);
      if (match) {
        const score = pattern.scoreExtractor(match);
        return {
          success: true,
          game: pattern.name as GameType,
          score
        };
      }
    }
    return {
      success: false,
      error: 'Unrecognized game format'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse game result'
    };
  }
};
