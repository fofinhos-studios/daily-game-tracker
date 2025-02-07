import { useState } from 'react';
import { ResultInput } from './components/ResultInput';
import { DailyOverview } from './components/DailyOverview';
import { History } from './components/History';

function App() {
  const [refresh, setRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');

  const handleScoreAdded = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Daily Game Tracker
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ResultInput onScoreAdded={handleScoreAdded} />

        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('today')}
                className={`${
                  activeTab === 'today'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Today's Games
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                History
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'today' ? (
              <DailyOverview refresh={refresh} />
            ) : (
              <History />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 text-center text-gray-500 text-sm">
          Track all your daily game scores in one place
        </div>
      </footer>
    </div>
  );
}

export default App;
