import mongoose, { Schema, Document } from "mongoose";

interface ITableData extends Document {
  table_sys_id: string;
  data: { [key: string]: any }; // Objeto genérico para armazenar os dados dinamicamente
}

const TableDataSchema: Schema = new Schema({
  table_sys_id: { type: String, required: true },
  data: { type: Object, required: true },
});

const TableData = mongoose.model<ITableData>("TableData", TableDataSchema);

export default TableData;
