import express from "express";
import TableMetadata from "../models/TableMetadata";

const router = express.Router();
const timeLog = (req: any, res: any, next: () => void) => {
  console.log("Time: ", Date.now());
  next();
};
router.use(timeLog);

// GET
router.get("/", async (req, res) => {
  try {
    const data = await TableMetadata.find({});
    if (data) {
      res.status(200).json(data);
      return;
    } else {
      res.status(200).json({ message: "No data was found." });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tabela", error });
  }
});

//PUT
router.put("/:id", async (req, res) => {
  try {
    const { tableName, tableLabelName, fields } = req.body;

    const filter = { _id: req.params.id };
    const update = {
      tableName: tableName,
      tableLabelName: tableLabelName,
      fields: fields,
    };

    const data = await TableMetadata.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ message: "id was not found." });
    }
    // Cria um novo documento de metadados
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar registro.", error });
  }
});

//POST
router.post("/", async (req, res) => {
  try {
    const { tableName, tableLabelName, fields } = req.body;

    const existingTable = await TableMetadata.findOne({ tableName });
    if (existingTable) {
      res.status(400).json({ message: "O nome da tabela já existe." });
      return;
    }
    // Cria um novo documento de metadados
    const tableMetadata = new TableMetadata({
      tableName,
      tableLabelName,
      fields,
    });

    // Salva os metadados no MongoDB
    const data = await tableMetadata.save();

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tabela", error });
  }
});

//GET BY ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await TableMetadata.findOne({ _id: id });
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ message: "id was not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao encontrar registro.", error });
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await TableMetadata.deleteOne({ _id: id });
    if (data.deletedCount > 0) {
      res.status(200).json({ message: "successfully deleted." });
    } else {
      res.status(400).json({ message: "id was not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao encontrar registro.", error });
  }
});

module.exports = router;
