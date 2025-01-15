import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";

const router = Router();

router.post("/query", async (req, res) => {
  try {
    const { query } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query }] }],
        }),
      }
    );

    const data = await geminiResponse.json();
    res.json({ response: data });
  } catch (error) {
    console.error("Error al conectar con Gemini:", error);
    res.status(500).json({ message: "Error en la consulta a Gemini" });
  }
});

export default router;
