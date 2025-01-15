import { db } from "@/config/firebase";

// Obtener historial de conversaciones
export const getConversationHistory = async (userId: string) => {
  const docRef = db.collection("chatHistory").doc(userId);
  const doc = await docRef.get();

  if (!doc.exists) {
    return []; // Si no hay historial, devolver array vacío
  }

  return doc.data()?.history || [];
};

// Guardar historial de conversación
export const saveConversationHistory = async (
  userId: string,
  history: any[]
) => {
  const docRef = db.collection("chatHistory").doc(userId);
  await docRef.set({ history });
};

// Enviar consulta a Gemini
export const sendQueryToGemini = async (query: string, history: any[]) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: history.concat({ parts: [{ text: query }] }),
      }),
    }
  );

  const data: any = await geminiResponse.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text || "Respuesta no disponible"
  );
};
