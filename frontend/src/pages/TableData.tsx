import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogContent,
  TextField,
} from "@mui/material";

interface Field {
  name: string;
  label: string;
  type: string;
}

interface TableMetadata {
  _id: string;
  tableName: string;
  tableLabelName: string;
  fields: Field[];
}

const TableData: React.FC = () => {
  const { tableId } = useParams();
  const [meta, setMeta] = useState<TableMetadata | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newRow, setNewRow] = useState<Record<string, any>>({});

  const loadData = () => {
    axios
      .get(`http://localhost:5000/tables/${tableId}`)
      .then((res) => {
        setMeta(res.data.tableMetaData[0]);
        setData(res.data.tableData);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, [tableId]);

  const handleCreate = () => {
    axios
      .post(`http://localhost:5000/tables/${tableId}`, { data: newRow })
      .then(() => {
        setOpen(false);
        setNewRow({});
        loadData();
      })
      .catch((err) => console.error(err));
  };

  if (!meta) return <Typography>Carregando...</Typography>;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        {meta.tableLabelName}
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Novo Registro
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            {meta.fields.map((f) => (
              <TableCell key={f.name}>{f.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              {meta.fields.map((f) => (
                <TableCell key={f.name}>{row[f.name]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {meta.fields.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              fullWidth
              margin="dense"
              onChange={(e) =>
                setNewRow({ ...newRow, [f.name]: e.target.value })
              }
            />
          ))}
          <Button variant="contained" onClick={handleCreate}>
            Salvar
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TableData;
