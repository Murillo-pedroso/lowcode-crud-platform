import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Stack,
  Container,
} from "@mui/material";

const Home: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Título principal */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#2E8B57"
          mb={1}
        >
          🧩 Gerador de Tabelas Dinâmicas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Crie, gerencie e relacione tabelas personalizadas sem precisar alterar o código.
        </Typography>
      </Box>

      {/* Seção 1 - Visão geral */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" color="#2E8B57" fontWeight="bold" gutterBottom>
          ⚙️ O que é este sistema?
        </Typography>
        <Typography variant="body1" textAlign="justify" color="#333">
          Este aplicativo é uma plataforma <b>low-code</b> desenvolvida em{" "}
          <b>Node.js, Express, MongoDB e React</b>, que permite criar e
          manipular tabelas de dados de forma totalmente dinâmica.
          <br />
          <br />
          Em vez de codificar novas entidades no backend, o usuário define a
          estrutura de uma tabela diretamente pela interface. O backend gera
          automaticamente o schema e validações com base nesses metadados,
          tornando o sistema flexível e expansível sem recompilações.
        </Typography>
      </Paper>

      {/* Seção 2 - Estrutura geral */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" color="#2E8B57" fontWeight="bold" gutterBottom>
          🧱 Estrutura do sistema
        </Typography>
        <Typography variant="body2" mb={2}>
          O backend é dividido em duas coleções principais no MongoDB:
        </Typography>

        <ul style={{ marginLeft: 20, color: "#333", marginBottom: 16 }}>
          <li>
            <b>TableMetadata</b>: armazena a estrutura (nome, campos e tipos).
          </li>
          <li>
            <b>TableData</b>: armazena os registros (linhas) criados com base no
            metadata.
          </li>
        </ul>

        <Typography variant="body2" mb={2}>
          Cada tabela criada via frontend é registrada no MongoDB como um
          documento dentro de <code>TableMetadata</code>. A partir disso, o
          sistema automaticamente habilita rotas REST para criar, listar,
          atualizar e excluir registros dessa nova tabela.
        </Typography>

        <pre
          style={{
            backgroundColor: "#F5F5F5",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            marginTop: "10px",
            overflowX: "auto",
          }}
        >
{`{
  "tableName": "tb_client",
  "tableLabelName": "Clientes",
  "fields": [
    { "name": "u_name", "label": "Nome", "type": "string", "mandatory": true },
    { "name": "u_email", "label": "Email", "type": "string", "mandatory": true },
    { "name": "u_age", "label": "Idade", "type": "number", "mandatory": false }
  ]
}`}
        </pre>
      </Paper>

      {/* Seção 3 - Funcionamento do backend */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" color="#2E8B57" fontWeight="bold" gutterBottom>
          🔁 Como o backend funciona
        </Typography>

        <Typography variant="body2" mb={2}>
          O backend é um servidor Express que expõe duas famílias principais de
          rotas:
        </Typography>

        <ul style={{ marginLeft: 20, color: "#333" }}>
          <li>
            <code>GET /tables/metadata</code> → lista todas as tabelas criadas.
          </li>
          <li>
            <code>POST /tables/metadata</code> → cria uma nova tabela (estrutura).
          </li>
          <li>
            <code>PUT /tables/metadata/:id</code> → atualiza o schema de uma tabela.
          </li>
          <li>
            <code>DELETE /tables/metadata/:id</code> → exclui uma tabela.
          </li>
        </ul>

        <Divider sx={{ my: 2 }} />

        <ul style={{ marginLeft: 20, color: "#333" }}>
          <li>
            <code>GET /tables/:table_id</code> → retorna os registros dessa tabela.
          </li>
          <li>
            <code>POST /tables/:table_id</code> → cria um novo registro.
          </li>
          <li>
            <code>PUT /tables/:table_id/:id</code> → atualiza um registro existente.
          </li>
          <li>
            <code>DELETE /tables/:id</code> → remove um registro específico.
          </li>
        </ul>

        <Typography variant="body2" mt={2} textAlign="justify">
          Cada operação de inserção ou atualização passa por uma{" "}
          <b>validação dinâmica</b> no servidor:
        </Typography>

        <ul style={{ marginLeft: 20, color: "#333", marginTop: 8 }}>
          <li>Verifica se os campos enviados existem no metadata.</li>
          <li>Valida o tipo de dado (string, number, boolean, etc.).</li>
          <li>Garante que campos obrigatórios estejam preenchidos.</li>
          <li>Rejeita campos não definidos na estrutura.</li>
        </ul>

        <Typography variant="body2" mt={2}>
          Assim, o sistema funciona como uma camada inteligente sobre o banco de
          dados — interpretando metadados e garantindo consistência de forma
          automática.
        </Typography>
      </Paper>

      {/* Seção 4 - Frontend */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" color="#2E8B57" fontWeight="bold" gutterBottom>
          💻 Como o frontend interage
        </Typography>
        <Typography variant="body2" mb={2} textAlign="justify">
          O frontend, construído com <b>React + Material UI</b>, consome as
          rotas do backend usando <b>Axios</b>.  
          Cada componente é genérico e se adapta automaticamente à estrutura da
          tabela selecionada:
        </Typography>

        <ul style={{ marginLeft: 20, color: "#333" }}>
          <li>
            <b>Tables</b>: exibe todas as tabelas criadas e permite criar novas
            estruturas de forma visual.
          </li>
          <li>
            <b>TableData</b>: lista os registros de uma tabela e possibilita criar novos
            registros, validando tipos e obrigatoriedades com base no metadata.
          </li>
          <li>
            <b>Home</b>: esta página — documentação interativa e ponto de partida do sistema.
          </li>
        </ul>

        <Typography variant="body2" mt={2}>
          Todos os componentes são responsivos e seguem o padrão visual verde{" "}
          <b>#2E8B57</b>, garantindo uma experiência moderna tanto em desktop
          quanto em dispositivos móveis.
        </Typography>
      </Paper>

      {/* Seção 5 - Banco de Dados */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" color="#2E8B57" fontWeight="bold" gutterBottom>
          🗄️ Estrutura no MongoDB
        </Typography>
        <Typography variant="body2" mb={2}>
          As coleções são criadas automaticamente e mantêm um relacionamento
          simples entre si:
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderLeft: "4px solid #2E8B57",
                height: "100%",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                TableMetadata
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Define o schema das tabelas dinâmicas.
              </Typography>
              <pre
                style={{
                  backgroundColor: "#F5F5F5",
                  padding: "10px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  marginTop: "10px",
                }}
              >
{`{
  _id: "uuid",
  tableName: "tb_client",
  fields: [...]
}`}
              </pre>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderLeft: "4px solid #2E8B57",
                height: "100%",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                TableData
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Armazena os registros criados com base no metadata.
              </Typography>
              <pre
                style={{
                  backgroundColor: "#F5F5F5",
                  padding: "10px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  marginTop: "10px",
                }}
              >
{`{
  table_id: "uuid",
  data: { 
    "u_name": "a name", 
    "u_email": "a@email.com" 
  }
}`}
              </pre>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Seção 6 - Conclusão */}
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="#2E8B57" fontWeight="bold" gutterBottom>
          🚀 Um backend que se adapta a você
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="justify">
          Este projeto mostra como é possível construir um sistema dinâmico e
          extensível onde o próprio usuário define o modelo de dados —
          eliminando retrabalho de desenvolvimento e abrindo caminho para
          soluções <b>low-code</b> e <b>auto-escaláveis</b>.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
