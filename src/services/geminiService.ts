import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkSystemStatus = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Responde solo con la palabra OK.',
    });
    return response.text?.includes('OK');
  } catch (error) {
    return false;
  }
};

export const analyzeDeviceIssue = async (model: string, description: string) => {
  try {
    const prompt = `Analiza problema para "${model}": "${description}".
    Responde JSON: category, estimatedPrice (number), estimatedTime, suggestedActions (array string).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};

export const generateReportSummary = async (tickets: any[]) => {
  try {
    const prompt = `Analiza estos tickets: ${JSON.stringify(tickets.slice(0,20))}. Resume tendencias en 1 parrafo.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "No disponible.";
  }
};