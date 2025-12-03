export type MedicationName = 'Doliprane' | 'Ibuprofène';

export interface MedicationState {
  lastTaken: number | null; // Timestamp in ms
}

export interface HistoryEntry {
  id: string;
  medication: MedicationName;
  timestamp: number;
}

export interface AppState {
  doliprane: MedicationState;
  ibuprofene: MedicationState;
  history: HistoryEntry[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}