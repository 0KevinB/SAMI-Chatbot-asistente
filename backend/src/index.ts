import "module-alias/register";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import "tsconfig-paths/register";
import authRoutes from "./routes/auth.routes";
import fileRoutes from "./routes/file.routes";
import medicosRoutes from "./routes/medic.routes";
import pacientesRoutes from "./routes/patient.routes";
import citasRoutes from "./routes/citas.routes";
import chatbotRoutes from "./routes/chatbot.routes";
import historiasClinicas from "./routes/historia_clinica.routes";
import recetas from "./routes/recetas.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*", // Permite todos los orígenes (NO recomendado para producción)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/medics", medicosRoutes);
app.use("/api/patients", pacientesRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/historias-clinicas", historiasClinicas);
app.use("/api/recetas", recetas);

// Error handling
app.use(errorHandler);
app.get("/", (req, res) => {
  res.status(200).json({ message: "API está funcionando" });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
