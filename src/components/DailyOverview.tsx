import React from 'react';
import { getTodayScores } from '../utils/storage';
import { generateDailySummary } from '../utils/formatters';
import { GameScore } from '../types/games';

interface DailyOverviewProps {
  refresh: number; // Trigger re-render when scores change
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({ refresh }) => {
  const scores = getTodayScores();
  const summary = generateDailySummary(scores);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch (error) {
      console.error('Failed to copy summary:', error);
    }
  };

  const renderScore = (score: GameScore) => {
    const emoji = score.won ? '✅' : '❌';
    return (
      <div key={score.game} className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-3">
        <div>
          <h3 className="text-lg font-medium capitalize">{score.game}</h3>
          <p className="text-sm text-gray-600">
            Score: {score.score}/{score.maxScore}
          </p>
        </div>
        <div className="text-2xl">{emoji}</div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Today's Games</h2>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Copy Summary
        </button>
      </div>

      {Object.keys(scores).length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No games played today
        </div>
      ) : (
        <div>
          {Object.values(scores).map(renderScore)}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Daily Summary</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {summary}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
