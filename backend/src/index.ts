import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import fileRoutes from './routes/file.routes';
// import medicosRoutes from './routes/medicos.routes';
// import pacientesRoutes from './routes/pacientes.routes';
// import citasRoutes from './routes/citas.routes';
import chatbotRoutes from './routes/chatbot.routes';
import historiasClinicas from './routes/historia_clinica.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/medicos', medicosRoutes);
// app.use('/api/pacientes', pacientesRoutes);
// app.use('/api/citas', citasRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/historias-clinicas', historiasClinicas);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});