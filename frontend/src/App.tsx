import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import Tables from "./pages/Tables"
import TableData from "./pages/TableData";
import axios from "axios";

interface TableMetadata {
  _id: string;
  tableName: string;
  tableLabelName: string;
}

const drawerWidth = 240;

const App: React.FC = () => {
  const [tables, setTables] = useState<TableMetadata[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/tables/metadata")
      .then((res) => setTables(res.data))
      .catch((err) => console.error("Erro ao carregar tabelas", err));
  }, []);

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        {/* Menu lateral */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <List>
            <ListItem>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Menu
              </Typography>
            </ListItem>
            <ListItem  component={Link} to="/tables">
              <ListItemText primary="Tabelas" />
            </ListItem>

            {tables.map((t) => (
              <ListItem      
                key={t._id}
                component={Link}
                to={`/tables/${t._id}`}
              >
                <ListItemText primary={t.tableLabelName} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Conteúdo */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/tables" element={<Tables />} />
            <Route path="/tables/:tableId" element={<TableData />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
