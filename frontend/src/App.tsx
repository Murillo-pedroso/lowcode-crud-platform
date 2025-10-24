import React, { useEffect, useState } from "react";
import {
  AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem, ListItemText,
  Toolbar, Typography, Divider, useTheme, useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Tables from "./pages/Tables";
import TableData from "./pages/TableData";
import Home from "./pages/Home";
import axios from "axios";
import { api } from "./api/axios";

interface TableMetadata {
  _id: string;
  tableName: string;
  tableLabelName: string;
}

const drawerWidth = 240;

const App: React.FC = () => {
  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    api
      .get("/tables/metadata")
      .then((res) => setTables(res.data))
      .catch((err) => console.error("Erro ao carregar tabelas", err));
  }, []);

  const toggleDrawer = () => setMobileOpen((v) => !v);

  const drawer = (
    <Box sx={{ bgcolor: "#2E8B57", height: "100%", color: "#fff" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">Menu</Typography>
        <IconButton onClick={toggleDrawer} sx={{ color: "#fff" }}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
      <List>
        <ListItem component={Link} to="/" onClick={toggleDrawer}>
          <ListItemText primary="🏠 Início" sx={{ color: "#fff" }} />
        </ListItem>
        <ListItem component={Link} to="/tables" onClick={toggleDrawer}>
          <ListItemText primary="📋 Tabelas" sx={{ color: "#fff" }} />
        </ListItem>
        {tables.map((t) => (
          <ListItem
            key={t._id}
            component={Link}
            to={`/tables/${t._id}`}
            onClick={toggleDrawer}
          >
            <ListItemText primary={`🗂️ ${t.tableLabelName}`} sx={{ color: "#fff" }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Router>
      <CssBaseline />

      {/* AppBar fixo. Em ≥sm, desloca para não sobrepor o Drawer permanente */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#2E8B57",
          zIndex: (t) => t.zIndex.drawer + 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Gerador de Tabelas Dinâmicas
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex" }}>
        {/* Drawer: temporário no mobile, permanente no desktop */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={isMobile ? toggleDrawer : undefined}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#2E8B57",
              color: "#fff",
            },
          }}
        >
          {drawer}
        </Drawer>

      {/* Main: inclui <Toolbar /> como espaçador do AppBar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          bgcolor: "#F5F6F7",
          minHeight: "100vh",
          overflowX: "hidden",

          // 👇 ESSA LINHA É A CHAVE: desloca o conteúdo quando o menu é fixo
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {/* Spacer igual à altura do AppBar */}
        <Toolbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/tables/:tableId" element={<TableData />} />
        </Routes>
      </Box>

      </Box>
    </Router>
  );
};

export default App;
