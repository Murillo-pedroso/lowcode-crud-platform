import express from "express";
import TableMetadata from "../models/TableMetadata";

const router = express.Router();
const timeLog = (req: any, res: any, next: () => void) => {
  console.log("Time: ", Date.now());
  next();
};
router.use(timeLog);

// Endpoint para criar uma nova "tabela"
router.post("/", async (req, res) => {
  try {
    const { tableName, fields } = req.body;

    // Cria um novo documento de metadados
    const tableMetadata = new TableMetadata({
      tableName,
      fields,
    });

    // Salva os metadados no MongoDB
    await tableMetadata.save().then((response) => {
      console.log(response);
    });

    res.status(201).json({ message: "Tabela criada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tabela", error });
  }
});

router.get("/", (req, res) => {
  res.send("hello from tableRoutes");
});

module.exports = router;
