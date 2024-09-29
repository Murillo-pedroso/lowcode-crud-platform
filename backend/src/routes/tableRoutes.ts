import express from "express";
import { v4 as uuidv4 } from "uuid"; // To generate a unique sys_id
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
      res.status(200).json({ message: "No data found." });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Error while fetching data.", error });
  }
});

// PUT
router.put("/:table_id/:id", async (req, res) => {
  try {
    const { data } = req.body; // Data to be inserted in the record
    const table_id = req.params.table_id;
    const id = req.params.id;

    // Search for the table with the provided sys_id
    const existingTable = await TableMetadata.findOne({ _id: table_id }).lean();
    if (!existingTable) {
      res.status(400).json({ message: "Table not found." });
      return;
    }
    const existingRecord = await TableData.findOne({ _id: id });

    if (!existingRecord) {
      res.status(400).json({ message: "Record not found." });
      return;
    }

    // Validate fields based on metadata
    const fieldsMetadata = existingTable?.fields; // Table metadata
    if (!fieldsMetadata) {
      res.status(400).json({ message: "Error." });
      return;
    }
    const fieldNames = fieldsMetadata.map((field: { name: any }) => field.name);

    // 1. Check for fields in JSON that are not defined in the table
    for (const key in data) {
      if (!fieldNames.includes(key)) {
        res.status(400).json({ message: `Field '${key}' is not allowed.` });
        return;
      }
    }

    // 2. Validate required fields and their types
    for (const field of fieldsMetadata) {
      const fieldName = field.name;
      const fieldType = field.type;

      // Check if the field is required
      if (data[fieldName] === undefined) {
        res.status(400).json({ message: `Field '${fieldName}' is required.` });
      }

      // Check the field type
      if (typeof data[fieldName] !== fieldType) {
        res.status(400).json({
          message: `Field '${fieldName}' must be of type '${fieldType}'.`,
        });
        return;
      }
    }

    const update = {
      table_id, // sys_id of the table
      data,
    };
    // Insert the new record in the `tabledata` collection
    const response = await existingRecord.updateOne(update, {
      new: true,
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error while updating record.", error });
  }
});

// POST
router.post("/:table_id", async (req, res) => {
  try {
    const { data } = req.body; // Data to be inserted in the record
    const table_id = req.params.table_id;

    // Search for the table with the provided sys_id
    const existingTable = await TableMetadata.findOne({ _id: table_id }).lean();
    if (!existingTable) {
      res.status(400).json({ message: "Table not found." });
      return;
    }

    // Validate fields based on metadata
    const fieldsMetadata = existingTable?.fields; // Table metadata
    if (!fieldsMetadata) {
      res.status(400).json({ message: "Error." });
      return;
    }
    const fieldNames = fieldsMetadata.map((field: { name: any }) => field.name);

    // 1. Check for fields in JSON that are not defined in the table
    for (const key in data) {
      if (!fieldNames.includes(key)) {
        res.status(400).json({ message: `Field '${key}' is not allowed.` });
        return;
      }
    }

    // 2. Validate required fields and their types
    for (const field of fieldsMetadata) {
      const fieldName = field.name;
      const fieldType = field.type;

      // Check if the field is required
      if (data[fieldName] === undefined) {
        res.status(400).json({ message: `Field '${fieldName}' is required.` });
      }

      // Check the field type
      if (typeof data[fieldName] !== fieldType) {
        res.status(400).json({
          message: `Field '${fieldName}' must be of type '${fieldType}'.`,
        });
        return;
      }
    }

    // Insert the new record in the `tabledata` collection
    const tableData = new TableData({
      table_id, // sys_id of the table
      data,
    });

    await tableData.save();

    res.status(201).json(tableData);
  } catch (error) {
    res.status(500).json({ message: "Error while creating record.", error });
  }
});

// GET BY ID
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
    res.status(500).json({ message: "Error while fetching data.", error });
  }
});

// DELETE
router.delete("/:sys_id", async (req, res) => {
  try {
    const sys_id = req.params.sys_id;
    const data = await TableData.deleteOne({ sys_id });
    if (data.deletedCount > 0) {
      res.status(200).json({ message: "Successfully deleted." });
    } else {
      res.status(400).json({ message: "sys_id not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while deleting record.", error });
  }
});

module.exports = router;
