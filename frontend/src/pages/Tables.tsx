import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  Divider,
  Chip,
  Switch,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { AddCircle, Delete } from "@mui/icons-material";
import { api } from "../api/axios";

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

  const loadTables = async () => {
    try {
      const res = await api.get("/tables/metadata");
      setTables(res.data);
    } catch (err) {
      console.error("Erro ao carregar tabelas:", err);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleAddField = () => {
    setNewTable((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: "", label: "", type: "string", mandatory: false }],
    }));
  };

  const handleRemoveField = (index: number) => {
    const fields = [...newTable.fields];
    fields.splice(index, 1);
    setNewTable({ ...newTable, fields });
  };

  const handleCreate = async () => {
    if (!newTable.tableName || !newTable.tableLabelName) return alert("Preencha todos os campos!");
    try {
      await api.post("/tables/metadata", newTable);
      setNewTable({ tableName: "", tableLabelName: "", fields: [] });
      loadTables();
    } catch (err) {
      console.error("Erro ao criar tabela:", err);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      {/* Seção: Tabelas existentes */}
      <Typography variant="h5" color="#2E8B57" fontWeight="bold" mb={2}>
        🗂️ Tabelas Criadas
      </Typography>

      {tables.length === 0 ? (
        <Typography color="text.secondary" mb={4}>
          Nenhuma tabela criada ainda.
        </Typography>
      ) : (
        <Grid container spacing={2} mb={4}>
          {tables.map((t) => (
            <Grid item xs={12} sm={6} md={4} key={t._id}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  height: "100%",
                  borderLeft: "4px solid #2E8B57",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="#2E8B57">
                    {t.tableLabelName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t.tableName}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {t.fields.slice(0, 3).map((f, i) => (
                    <Chip key={i} label={f.label} size="small" color="success" />
                  ))}
                  {t.fields.length > 3 && (
                    <Chip label={`+${t.fields.length - 3} campos`} size="small" color="default" />
                  )}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Seção: Criar nova tabela */}
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" color="#2E8B57" mb={2} fontWeight="bold">
          ➕ Criar Nova Tabela
        </Typography>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome técnico da Tabela (ex: tb_client)"
              value={newTable.tableName}
              onChange={(e) => setNewTable({ ...newTable, tableName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Rótulo da Tabela (ex: Clientes)"
              value={newTable.tableLabelName}
              onChange={(e) => setNewTable({ ...newTable, tableLabelName: e.target.value })}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" color="#2E8B57" mb={1}>
          Campos
        </Typography>

        {newTable.fields.length === 0 && (
          <Typography color="text.secondary" mb={2}>
            Nenhum campo adicionado ainda.
          </Typography>
        )}

        {newTable.fields.map((f, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              borderColor: "#d0d0d0",
              borderRadius: 2,
              bgcolor: "#fafafa",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Nome"
                  fullWidth
                  value={f.name}
                  onChange={(e) => {
                    const fields = [...newTable.fields];
                    fields[index].name = e.target.value;
                    setNewTable({ ...newTable, fields });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Label"
                  fullWidth
                  value={f.label}
                  onChange={(e) => {
                    const fields = [...newTable.fields];
                    fields[index].label = e.target.value;
                    setNewTable({ ...newTable, fields });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={f.type}
                    label="Tipo"
                    onChange={(e) => {
                      const fields = [...newTable.fields];
                      fields[index].type = e.target.value;
                      setNewTable({ ...newTable, fields });
                    }}
                  >
                    <MenuItem value="string">Texto (string)</MenuItem>
                    <MenuItem value="number">Número (number)</MenuItem>
                    <MenuItem value="boolean">Verdadeiro/Falso (boolean)</MenuItem>
                    <MenuItem value="date">Data (date)</MenuItem>
                    <MenuItem value="datetime">Data e Hora (datetime)</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="phone">Telefone</MenuItem>
                    <MenuItem value="reference">Referência (FK)</MenuItem>
                    <MenuItem value="enum">Opções pré-definidas (enum)</MenuItem>
                    <MenuItem value="text">Texto longo (text)</MenuItem>
                    <MenuItem value="decimal">Decimal (decimal)</MenuItem>
                    <MenuItem value="json">Objeto JSON (json)</MenuItem>
                    <MenuItem value="uuid">Identificador (uuid)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2">Obrigatório</Typography>
                  <Switch
                    color="success"
                    checked={f.mandatory}
                    onChange={() => {
                      const fields = [...newTable.fields];
                      fields[index].mandatory = !fields[index].mandatory;
                      setNewTable({ ...newTable, fields });
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton color="error" onClick={() => handleRemoveField(index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button
          startIcon={<AddCircle />}
          onClick={handleAddField}
          variant="outlined"
          sx={{
            borderColor: "#2E8B57",
            color: "#2E8B57",
            "&:hover": { bgcolor: "rgba(46,139,87,0.1)", borderColor: "#2E8B57" },
            mb: 3,
          }}
        >
          Adicionar Campo
        </Button>

        <Divider sx={{ mb: 2 }} />

        <Button
          variant="contained"
          onClick={handleCreate}
          sx={{
            bgcolor: "#2E8B57",
            "&:hover": { bgcolor: "#256b45" },
          }}
        >
          Criar Tabela
        </Button>
      </Paper>
    </Box>
  );
};

export default Tables;
