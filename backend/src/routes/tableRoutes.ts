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
router.get("/:table_id", async (req, res) => {
  try {
    const data = await TableData.find({ table_id: req.params.table_id });
    const tableMetaData = await TableMetadata.find({
      _id: req.params.table_id,
    });
    if (data) {
      const tableData = data.map((item) => {
        let temp = {
          _id: item._id,
          ...item.data,
        };
        return temp;
      });
      const response = {
        tableMetaData,
        tableData,
      };
      res.status(200).json(response);
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
router.put("/:table_id/:id", async (req, res) => {
  try {
    const { data } = req.body; // Dados a serem inseridos no registro
    const table_id = req.params.table_id;
    const id = req.params.id;

    // Procurar a tabela com o sys_id fornecido
    const existingTable = await TableMetadata.findOne({ _id: table_id }).lean();
    if (!existingTable) {
      res.status(400).json({ message: "Tabela não encontrada." });
      return;
    }
    const existingRecord = await TableData.findOne({
      _id: id,
    });

    if (!existingRecord) {
      res.status(400).json({ message: "Record not found." });
      return;
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
        return;
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
        return;
      }
    }

    const update = {
      table_id, // sys_id da tabela
      data,
    };
    // Inserir o novo registro na coleção `tabledata`
    const response = await existingRecord.updateOne(update, {
      new: true,
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar registro.", error });
  }
});

//POST
router.post("/:table_id", async (req, res) => {
  try {
    const { data } = req.body; // Dados a serem inseridos no registro
    const table_id = req.params.table_id;

    // Procurar a tabela com o sys_id fornecido
    const existingTable = await TableMetadata.findOne({ _id: table_id }).lean();
    if (!existingTable) {
      res.status(400).json({ message: "Tabela não encontrada." });
      return;
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
        return;
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
        return;
      }
    }

    // 3. Adicionar um sys_id único ao registro

    // Inserir o novo registro na coleção `tabledata`
    const tableData = new TableData({
      table_id, // sys_id da tabela
      data,
    });

    await tableData.save();

    res.status(201).json(tableData);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar o registro.", error });
  }
});

//GET BY ID
router.get("/:table_id/:id", async (req, res) => {
  try {
    const data = await TableData.find({
      _id: req.params.id,
    });

    const tableMetaData = await TableMetadata.find({
      _id: req.params.table_id,
    });

    if (!tableMetaData) {
      res.status(400).json({ message: "Table not found." });
    }
    if (data) {
      const tableData = data.map((item) => {
        let temp = {
          _id: item._id,
          ...item.data,
        };
        return temp;
      });
      const response = {
        tableMetaData,
        tableData,
      };
      res.status(200).json(response);
      return;
    } else {
      res.status(400).json({ message: "No data found." });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tabela", error });
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
