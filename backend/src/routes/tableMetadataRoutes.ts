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
      res.status(200).json({ message: "No data found." });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Error while fetching data.", error });
  }
});

// PUT
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
      res.status(400).json({ message: "ID not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while updating record.", error });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const { tableName, tableLabelName, fields } = req.body;

    const existingTable = await TableMetadata.findOne({ tableName });
    if (existingTable) {
      res.status(400).json({ message: "Table name already exists." });
      return;
    }

    // Create a new metadata document
    const tableMetadata = new TableMetadata({
      tableName,
      tableLabelName,
      fields,
    });

    // Save the metadata in MongoDB
    const data = await tableMetadata.save();

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error while creating table.", error });
  }
});

// GET BY ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await TableMetadata.findOne({ _id: id });
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ message: "ID not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while fetching record.", error });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await TableMetadata.deleteOne({ _id: id });
    if (data.deletedCount > 0) {
      res.status(200).json({ message: "Successfully deleted." });
    } else {
      res.status(400).json({ message: "ID not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while deleting record.", error });
  }
});

module.exports = router;
