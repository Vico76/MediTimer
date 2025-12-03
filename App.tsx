import React, { useState, useEffect } from 'react';
import { MedicationCard } from './components/MedicationCard';
import { HistoryList } from './components/HistoryList';
import { AIAdvisor } from './components/AIAdvisor';
import { AppState, MedicationName } from './types';
import { Activity } from 'lucide-react';

const STORAGE_KEY = 'meditrack_data_v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    // Load from local storage on init
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure is correct even if loading old data
        return {
            doliprane: parsed.doliprane || { lastTaken: null },
            ibuprofene: parsed.ibuprofene || { lastTaken: null },
            history: Array.isArray(parsed.history) ? parsed.history : []
        };
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
    return {
      doliprane: { lastTaken: null },
      ibuprofene: { lastTaken: null },
      history: []
    };
  });

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addToHistory = (medication: MedicationName, timestamp: number) => {
    const newEntry = {
        id: timestamp.toString() + Math.random().toString(36).substr(2, 9),
        medication,
        timestamp
    };
    return [newEntry, ...(state.history || [])];
  };

  const takeDoliprane = () => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      doliprane: { lastTaken: now },
      history: addToHistory('Doliprane', now)
    }));
  };

  const takeIbuprofene = () => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      ibuprofene: { lastTaken: now },
      history: addToHistory('Ibuprofène', now)
    }));
  };

  const resetAll = () => {
    if(confirm("Voulez-vous vraiment réinitialiser tout l'historique ?")) {
        setState({
            doliprane: { lastTaken: null },
            ibuprofene: { lastTaken: null },
            history: [],
        });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center pt-8 pb-20 px-4 sm:px-0">
      
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-8 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">MediTimer</h1>
          <p className="text-slate-500 text-sm">Suivi des prises toutes les 6h</p>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm">
            <Activity className="w-6 h-6 text-indigo-500" />
        </div>
      </header>

      {/* Main Content Stack */}
      <main className="w-full max-w-md space-y-6">
        
        {/* Doliprane Card - Blue theme */}
        <MedicationCard 
          name="Doliprane"
          lastTaken={state.doliprane.lastTaken}
          onTake={takeDoliprane}
          colorClass="bg-blue-100"
          iconColor="text-blue-600"
        />

        {/* Ibuprofène Card - Pink/Red theme */}
        <MedicationCard 
          name="Ibuprofène"
          lastTaken={state.ibuprofene.lastTaken}
          onTake={takeIbuprofene}
          colorClass="bg-pink-100"
          iconColor="text-pink-600"
        />

        {/* History List */}
        <HistoryList history={state.history} />

        {/* Reset Button */}
        <button 
            onClick={resetAll}
            className="w-full py-3 text-sm text-slate-400 hover:text-red-500 transition-colors"
        >
            Tout réinitialiser
        </button>

      </main>

      <AIAdvisor />

    </div>
  );
};

export default App;