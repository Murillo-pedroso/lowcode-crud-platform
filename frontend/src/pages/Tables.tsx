import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { AddCircle } from "@mui/icons-material";

interface Field {
  name: string;
  label: string;
  type: string;
  mandatory: boolean;
}

interface TableMetadata {
  _id?: string;
  tableName: string;
  tableLabelName: string;
  fields: Field[];
}

const Tables: React.FC = () => {
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [newTable, setNewTable] = useState<TableMetadata>({
    tableName: "",
    tableLabelName: "",
    fields: [],
  });

  const loadTables = () => {
    axios
      .get("http://localhost:5000/tables/metadata")
      .then((res) => setTables(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleAddField = () => {
    setNewTable({
      ...newTable,
      fields: [
        ...newTable.fields,
        { name: "", label: "", type: "string", mandatory: false },
      ],
    });
  };

  const handleCreate = () => {
    axios
      .post("http://localhost:5000/tables/metadata", newTable)
      .then(() => {
        setNewTable({ tableName: "", tableLabelName: "", fields: [] });
        loadTables();
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Tabelas Criadas
      </Typography>

      {tables.map((t) => (
        <Paper key={t._id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">
            {t.tableLabelName} ({t.tableName})
          </Typography>
        </Paper>
      ))}

      <Box mt={4}>
        <Typography variant="h6">Nova Tabela</Typography>
        <TextField
          fullWidth
          label="Nome da Tabela"
          value={newTable.tableName}
          onChange={(e) =>
            setNewTable({ ...newTable, tableName: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Label da Tabela"
          value={newTable.tableLabelName}
          onChange={(e) =>
            setNewTable({ ...newTable, tableLabelName: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Campos
        </Typography>
        {newTable.fields.map((f, index) => (
          <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
            <Grid item xs={3}>
              <TextField
                label="Nome"
                value={f.name}
                onChange={(e) => {
                  const fields = [...newTable.fields];
                  fields[index].name = e.target.value;
                  setNewTable({ ...newTable, fields });
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Label"
                value={f.label}
                onChange={(e) => {
                  const fields = [...newTable.fields];
                  fields[index].label = e.target.value;
                  setNewTable({ ...newTable, fields });
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Tipo"
                value={f.type}
                onChange={(e) => {
                  const fields = [...newTable.fields];
                  fields[index].type = e.target.value;
                  setNewTable({ ...newTable, fields });
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Obrigatório"
                value={f.mandatory ? "Sim" : "Não"}
                onClick={() => {
                  const fields = [...newTable.fields];
                  fields[index].mandatory = !fields[index].mandatory;
                  setNewTable({ ...newTable, fields });
                }}
              />
            </Grid>
          </Grid>
        ))}
        <Button startIcon={<AddCircle />} onClick={handleAddField}>
          Adicionar Campo
        </Button>

        <Box mt={2}>
          <Button variant="contained" onClick={handleCreate}>
            Criar Tabela
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Tables;
