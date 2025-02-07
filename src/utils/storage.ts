import { GameScore, UserData } from '../types/games';

const STORAGE_KEY = 'daily-game-tracker-data';

export const getStoredData = (): UserData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to retrieve stored data:', error);
  }
  return { scores: {} };
};

export const saveScore = (score: GameScore): void => {
  try {
    const data = getStoredData();
    if (!data.scores[score.date]) {
      data.scores[score.date] = {};
    }
    data.scores[score.date][score.game] = score;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save score:', error);
    throw new Error('Failed to save score');
  }
};

export const getTodayScores = (): Record<string, GameScore> => {
  const today = new Date().toLocaleDateString('pt-BR').split('/').join('/');
  return getStoredData().scores[today] || {};
};

export const getScoresByDate = (date: string): Record<string, GameScore> => {
  return getStoredData().scores[date] || {};
};

export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw new Error('Failed to clear data');
  }
};
