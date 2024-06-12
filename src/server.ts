import express from "express";
import cors from "cors";
import { routes } from "./routes"; // Supondo que você tem um arquivo de rotas

const app = express();
const port = 3001;

// Configura o middleware CORS
app.use(cors({
  origin: '*', // Permite todas as origens. Ajuste conforme necessário.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

app.use(express.json());

// Aplica as rotas
routes.map((route) => app.use(route.path, route.router));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
