import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askMedicalAssistant = async (question: string): Promise<string> => {
  if (!apiKey) {
    return "Clé API manquante. Impossible de contacter l'assistant.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: `Tu es un assistant médical personnel concis et prudent. 
        Tes réponses doivent être courtes (max 2 phrases) et en français.
        Le contexte est une application pour gérer la prise de Doliprane (Paracétamol) et d'Ibuprofène.
        Rappelle toujours qu'il faut consulter un médecin en cas de doute.
        Ne donne pas de diagnostic médical précis, mais des conseils généraux sur la posologie et les interactions.`,
      }
    });

    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Une erreur est survenue lors de la consultation de l'assistant.";
  }
};