// src/services/chatbot.service.ts
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export class ChatbotService {
  // Método que maneja la consulta
  static async handleQuery(query: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: query }],
    });
    return response.choices[0].message?.content;
  }
}
