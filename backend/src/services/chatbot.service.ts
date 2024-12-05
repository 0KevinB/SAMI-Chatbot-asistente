// src/services/chatbot.service.ts
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Servicio para interactuar con la API de OpenAI y manejar consultas de chatbot
 */
export class ChatbotService {
  /**
   * Método que maneja una consulta enviada por el usuario
   * @param query Consulta enviada por el usuario
   * @returns Respuesta generada por el modelo GPT-4
   */
  static async handleQuery(query: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: query }],
    });
    return response.choices[0].message?.content;
  }
}
