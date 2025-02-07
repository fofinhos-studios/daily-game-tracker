import React, { useState } from 'react';
import { format, subDays } from 'date-fns';
import { getScoresByDate } from '../utils/storage';
import { GameScore } from '../types/games';

export const History: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | 'all'>('all');

  // Get last 7 days of scores
  const getDaysScores = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(new Date(), i), 'dd/MM/yyyy');
      const scores = getScoresByDate(date);
      if (Object.keys(scores).length > 0) {
        days.push({ date, scores });
      }
    }
    return days;
  };

  const daysWithScores = getDaysScores();

  const renderGameScore = (score: GameScore) => {
    const emoji = score.won ? '✅' : '❌';
    return (
      <div key={score.game} className="flex items-center space-x-2 text-sm">
        <span className="capitalize">{score.game}:</span>
        <span>
          {score.score}/{score.maxScore}
        </span>
        <span>{emoji}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">History</h2>
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Games</option>
          <option value="guessthegame">GuessTheGame</option>
          <option value="framed">Framed</option>
          <option value="gamedle">Gamedle</option>
          <option value="conexo">Conexo</option>
        </select>
      </div>

      {daysWithScores.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No game history available
        </div>
      ) : (
        <div className="space-y-4">
          {daysWithScores.map(({ date, scores }) => {
            const filteredScores = Object.values(scores).filter(
              (score) => selectedGame === 'all' || score.game === selectedGame
            );

            if (filteredScores.length === 0) return null;

            return (
              <div key={date} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium mb-2">{date}</h3>
                <div className="space-y-2">
                  {filteredScores.map(renderGameScore)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
