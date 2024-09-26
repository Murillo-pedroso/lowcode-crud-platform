import express from "express";
import { v4 as uuidv4 } from "uuid"; // Para gerar um sys_id único
import TableData from "../models/TableData";
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
    const data = await TableData.find({});
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
router.put("/:sys_id", async (req, res) => {
  try {
    const { tableName, tableLabelName, fields } = req.body;

    const filter = { sys_id: req.params.sys_id };
    const update = {
      tableName: tableName,
      tableLabelName: tableLabelName,
      fields: fields,
    };

    const data = await TableData.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ message: "sys_id was not found." });
    }
    // Cria um novo documento de metadados
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar registro.", error });
  }
});

//POST
router.post("/:sys_id", async (req, res) => {
  try {
    const { data } = req.body; // Dados a serem inseridos no registro
    const sys_id = req.params.sys_id;

    // Procurar a tabela com o sys_id fornecido
    const existingTable = await TableMetadata.findOne({ sys_id }).lean();
    if (!existingTable) {
      res.status(400).json({ message: "Tabela não encontrada." });
    }

    // Validar os campos com base na metadata
    const fieldsMetadata = existingTable?.fields; // Metadados da tabela
    if (!fieldsMetadata) {
      res.status(400).json({ message: "error" });
      return;
    }
    const fieldNames = fieldsMetadata.map((field: { name: any }) => field.name);

    // 1. Verificar se existem campos a mais no JSON do que os definidos na tabela
    for (const key in data) {
      if (!fieldNames.includes(key)) {
        res.status(400).json({ message: `Campo '${key}' não é permitido.` });
      }
    }

    // 2. Validar os campos obrigatórios e seus tipos
    for (const field of fieldsMetadata) {
      const fieldName = field.name;
      const fieldType = field.type;

      // Verificar se o campo é obrigatório
      if (data[fieldName] === undefined) {
        res
          .status(400)
          .json({ message: `Campo '${fieldName}' é obrigatório.` });
      }

      // Verificar o tipo do campo
      if (typeof data[fieldName] !== fieldType) {
        res.status(400).json({
          message: `Campo '${fieldName}' deve ser do tipo '${fieldType}'.`,
        });
      }
    }

    // 3. Adicionar um sys_id único ao registro
    const newData = {
      ...data,
      sys_id: uuidv4(), // Gerar um ID único para o novo registro
    };

    // Inserir o novo registro na coleção `tabledata`
    const tableData = new TableData({
      sys_id, // sys_id da tabela
      data: newData,
    });

    await tableData.save();

    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar o registro.", error });
  }
});

//GET BY ID
router.get("/:sys_id", async (req, res) => {
  try {
    const sys_id = req.params.sys_id;
    const data = await TableData.findOne({ sys_id });
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ message: "sys_id was not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao encontrar registro.", error });
  }
});

//DELETE
router.delete("/:sys_id", async (req, res) => {
  try {
    const sys_id = req.params.sys_id;
    const data = await TableData.deleteOne({ sys_id });
    if (data.deletedCount > 0) {
      res.status(200).json({ message: "successfully deleted." });
    } else {
      res.status(400).json({ message: "sys_id was not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao encontrar registro.", error });
  }
});

module.exports = router;
