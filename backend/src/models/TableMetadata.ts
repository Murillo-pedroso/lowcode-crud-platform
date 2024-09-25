import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Importar o uuid
// Interface para os metadados
interface ITableMetadata extends Document {
  tableName: string;
  fields: {
    name: string;
    type: string;
  }[];
  sys_id: string;
}

// Schema para os metadados das tabelas
const TableMetadataSchema: Schema = new Schema({
  tableName: { type: String, required: true },
  fields: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
  sys_id: { type: String, default: uuidv4 },
});

// Modelo para os metadados das tabelas
const TableMetadata = mongoose.model<ITableMetadata>(
  "TableMetadata",
  TableMetadataSchema
);

export default TableMetadata;
