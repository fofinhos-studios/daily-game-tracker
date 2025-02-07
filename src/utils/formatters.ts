import { format } from 'date-fns';
import { GameScore } from '../types/games';

export const formatDate = (date: string): string => {
  const [day, month, year] = date.split('/');
  return format(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)), 'dd/MM/yyyy');
};

export const generateDailySummary = (scores: Record<string, GameScore>): string => {
  if (Object.keys(scores).length === 0) {
    return 'No games played today';
  }

  const date = Object.values(scores)[0].date;
  let summary = `📊 My Daily Games (${date})\n`;

  // Order games consistently
  const orderedGames = ['guessthegame', 'framed', 'gamedle', 'conexo'];

  orderedGames.forEach(game => {
    if (scores[game]) {
      const score = scores[game];
      const emoji = getGameEmoji(game);
      summary += `${emoji} ${capitalizeFirstLetter(game)}: ${score.score}/${score.maxScore}${score.won ? ' ✅' : ''}\n`;
    }
  });

  return summary.trim();
};

const getGameEmoji = (game: string): string => {
  switch (game) {
    case 'guessthegame':
      return '🎮';
    case 'framed':
      return '🎥';
    case 'gamedle':
      return '🕹️';
    case 'conexo':
      return '🌈';
    default:
      return '🎲';
  }
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
