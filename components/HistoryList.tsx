import React from 'react';
import { HistoryEntry } from '../types';
import { History, Calendar } from 'lucide-react';

interface HistoryListProps {
  history: HistoryEntry[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4 text-slate-700">
        <History className="w-5 h-5" />
        <h2 className="font-bold text-lg">Historique</h2>
      </div>

      <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        <div className="space-y-3">
          {history.map((entry) => (
            <div 
              key={entry.id} 
              className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${entry.medication === 'Doliprane' ? 'bg-blue-500' : 'bg-pink-500'}`} />
                <span className="font-medium text-slate-800">{entry.medication}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Calendar className="w-3 h-3" />
                {formatDate(entry.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};