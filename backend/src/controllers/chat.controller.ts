import { Request, Response } from "express";
import {
  getConversationHistory,
  saveConversationHistory,
  sendQueryToGemini,
} from "@/services/chatbot.service";
import { AuthRequest } from "@/middleware/auth.middleware";

export const handleGeminiQuery = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    const userId = req.user?.cedula; // La cédula ya está en req.user

    if (!userId) {
      return res
        .status(400)
        .json({ message: "No se encontró el ID de usuario" });
    }

    // Obtener historial existente
    const conversationHistory = await getConversationHistory(userId);

    // Añadir nueva consulta
    conversationHistory.push({ role: "user", text: query });

    // Enviar consulta a Gemini
    const responseText = await sendQueryToGemini(query, conversationHistory);

    // Añadir respuesta de Gemini al historial
    conversationHistory.push({ role: "model", text: responseText });

    // Guardar historial actualizado en Firestore
    await saveConversationHistory(userId, conversationHistory);

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error al manejar la consulta:", error);
    res.status(500).json({ message: "Error en la consulta a Gemini" });
  }
};
