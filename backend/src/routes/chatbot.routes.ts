import { Router } from 'express';
import { ChatbotService } from '../services/chatbot.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/query', authMiddleware, async (req, res) => {
  try {
    const { query } = req.body;
    const response = await ChatbotService.handleQuery(query);
    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;