import { GoogleGenAI, Type } from "@google/genai";
import { Ticket } from "@/types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkSystemStatus = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Responde solo con la palabra OK si recibes este mensaje.',
    });
    return response.text?.includes('OK');
  } catch (error) {
    console.error("System check failed:", error);
    return false;
  }
};

export const analyzeDeviceIssue = async (model: string, description: string) => {
  try {
    const prompt = `Actua como un técnico experto en reparación de celulares. 
    Analiza el siguiente problema para un dispositivo "${model}".
    Descripción del problema: "${description}".
    
    Proporciona una respuesta estructurada en JSON con:
    1. Categoría del problema (ej. Pantalla, Batería, Software, Placa).
    2. Precio estimado en USD (solo el número).
    3. Tiempo estimado de reparación (texto breve).
    4. Lista de 3 acciones sugeridas o piezas a revisar.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            estimatedPrice: { type: Type.NUMBER },
            estimatedTime: { type: Type.STRING },
            suggestedActions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing issue with Gemini:", error);
    return null;
  }
};

export const generateReportSummary = async (tickets: Ticket[]) => {
  try {
    const recentTickets = tickets.slice(0, 50).map(t => ({
      model: t.deviceModel,
      issue: t.issueDescription,
      status: t.status,
      price: t.priceQuote
    }));

    const prompt = `Analiza estos datos recientes de reparaciones en el taller:
    ${JSON.stringify(recentTickets)}
    
    Genera un resumen ejecutivo breve (máximo 1 párrafo) sobre tendencias, problemas más comunes esta semana y rendimiento general. Sé profesional y directo.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating report with Gemini:", error);
    return "No se pudo generar el resumen inteligente en este momento.";
  }
};