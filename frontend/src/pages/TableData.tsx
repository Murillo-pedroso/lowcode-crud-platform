import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { api } from "../api/axios";

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
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tables/${tableId}`);
      setMeta(res.data.tableMetaData[0]);
      setData(res.data.tableData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tableId]);

  const handleCreate = async () => {
    try {
      await api.post(`/tables/${tableId}`, { data: newRow });
      setOpen(false);
      setNewRow({});
      loadData();
    } catch (err) {
      console.error("Erro ao criar registro:", err);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );

  if (!meta)
    return (
      <Typography color="text.secondary" textAlign="center">
        Nenhuma tabela encontrada.
      </Typography>
    );

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        spacing={2}
      >
        <Box>
          <Typography variant="h5" color="#2E8B57" fontWeight="bold">
            {meta.tableLabelName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({meta.tableName})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "#2E8B57",
            "&:hover": { bgcolor: "#256b45" },
            alignSelf: { xs: "stretch", sm: "center" },
          }}
        >
          Novo Registro
        </Button>
      </Stack>

      {/* Tabela de dados */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: 2,
          p: { xs: 1, sm: 2 },
        }}
      >
        {data.length === 0 ? (
          <Typography
            color="text.secondary"
            textAlign="center"
            py={4}
          >
            Nenhum registro encontrado.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f6f7" }}>
                {meta.fields.map((f) => (
                  <TableCell
                    key={f.name}
                    sx={{ fontWeight: "bold", color: "#2E8B57" }}
                  >
                    {f.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id} hover>
                  {meta.fields.map((f) => (
                    <TableCell key={f.name}>
                      {String(row[f.name] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Diálogo de criação */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: "#2E8B57", fontWeight: "bold" }}>
          Novo Registro
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {meta.fields.map((f) => (
              <TextField
                key={f.name}
                label={f.label}
                type={f.type === "number" ? "number" : "text"}
                fullWidth
                onChange={(e) =>
                  setNewRow({ ...newRow, [f.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: "#555" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              bgcolor: "#2E8B57",
              "&:hover": { bgcolor: "#256b45" },
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableData;
