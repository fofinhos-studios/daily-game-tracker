import React, { useState } from 'react';
import { parseGameResult } from '../utils/parsers';
import { saveScore } from '../utils/storage';

interface ResultInputProps {
  onScoreAdded: () => void;
}

export const ResultInput: React.FC<ResultInputProps> = ({ onScoreAdded }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePaste = async (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    setInput(text);
    handleSubmit(text);
  };

  const handleSubmit = (text: string) => {
    setError(null);
    setSuccess(false);

    const result = parseGameResult(text);

    if (!result.success || !result.score) {
      setError(result.error || 'Failed to parse game result');
      return;
    }

    try {
      saveScore(result.score);
      setSuccess(true);
      setInput('');
      onScoreAdded();
    } catch (error) {
      setError('Failed to save score');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="mb-4">
        <label
          htmlFor="gameResult"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Paste your game result
        </label>
        <textarea
          id="gameResult"
          className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'
          }`}
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste your game result here..."
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500 text-sm mb-4">
          Score saved successfully!
        </div>
      )}

      <button
        onClick={() => handleSubmit(input)}
        disabled={!input}
        className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
          input
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        Save Score
      </button>
    </div>
  );
};
