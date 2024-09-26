import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const tableRoutes = require("./routes/tableRoutes");

dotenv.config();

const app = express();
const port = 5000;

// Configurar o middleware para processar JSON
app.use(express.json());

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("hello from express");
});

// Usar as rotas para tabelas
app.use("/tables/metadata", tableRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
