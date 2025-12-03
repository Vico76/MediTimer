import React, { useEffect, useState } from 'react';
import { MedicationName } from '../types';
import { Pill, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface MedicationCardProps {
  name: MedicationName;
  lastTaken: number | null;
  onTake: () => void;
  colorClass: string;
  iconColor: string;
}

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export const MedicationCard: React.FC<MedicationCardProps> = ({ 
  name, 
  lastTaken, 
  onTake, 
  colorClass,
  iconColor 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canTake, setCanTake] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      if (!lastTaken) {
        setCanTake(true);
        setTimeLeft(0);
        setProgress(0);
        return;
      }

      const now = Date.now();
      const elapsed = now - lastTaken;
      const remaining = SIX_HOURS_MS - elapsed;

      if (remaining <= 0) {
        setCanTake(true);
        setTimeLeft(0);
        setProgress(0);
      } else {
        setCanTake(false);
        setTimeLeft(remaining);
        // Calculate progress percentage (0 to 100)
        // If remaining is 6h, progress is 100%. If 0h, 0%.
        const percent = (remaining / SIX_HOURS_MS) * 100;
        setProgress(percent);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lastTaken]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getNextDoseTime = () => {
    if (!lastTaken) return 'Maintenant';
    const nextDate = new Date(lastTaken + SIX_HOURS_MS);
    return nextDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 shadow-lg transition-all duration-500 ${canTake ? 'bg-white' : 'bg-slate-50'}`}>
      {/* Background Pulse Animation for warning state */}
      {!canTake && (
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${canTake ? colorClass : 'bg-gray-200'}`}>
            <Pill className={`w-6 h-6 ${canTake ? iconColor : 'text-gray-500'}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{name}</h2>
            <p className="text-xs text-slate-500 font-medium">
              {canTake ? 'Disponible' : `Prochaine dose: ${getNextDoseTime()}`}
            </p>
          </div>
        </div>
        <div className="status-indicator">
           {canTake ? (
             <CheckCircle className="w-6 h-6 text-green-500" />
           ) : (
             <AlertCircle className="w-6 h-6 text-red-500" />
           )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        {!canTake ? (
            <div className="relative w-48 h-12 bg-gray-200 rounded-full overflow-hidden mb-4 shadow-inner">
               <div 
                 className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-1000 ease-linear"
                 style={{ width: `${progress}%` }}
               />
               <div className="absolute inset-0 flex items-center justify-center z-10">
                 <span className="text-sm font-mono font-bold text-slate-700 drop-shadow-sm flex items-center gap-2">
                   <Clock className="w-4 h-4" />
                   {formatTime(timeLeft)}
                 </span>
               </div>
            </div>
        ) : (
          <div className="h-16 flex items-center justify-center text-green-600 font-medium animate-bounce">
            Vous pouvez prendre ce médicament.
          </div>
        )}

        <button
          onClick={onTake}
          disabled={!canTake}
          className={`
            w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-300 transform active:scale-95
            ${canTake 
              ? `${colorClass.replace('bg-', 'bg-').replace('100', '500')} text-white hover:brightness-110 shadow-lg shadow-blue-200` 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
            }
          `}
        >
          {canTake ? 'Prendre une dose' : 'Attendre...'}
        </button>
      </div>
      
      {/* Dosage Info */}
      <div className="mt-2 text-center">
         <p className="text-[10px] text-slate-400">
           Respectez toujours un intervalle de 6 heures entre deux prises.
         </p>
      </div>
    </div>
  );
};