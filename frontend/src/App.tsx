import React, { useEffect, useState } from "react";
import axios from "axios";

interface TableMetadata {
  _id: string;
  tableName: string;
  fields: Array<{ name: string; type: string }>;
}

const Home: React.FC = () => {
  // const [tables, setTables] = useState<TableMetadata[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/tables/metadata/")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Erro ao buscar os metadados das tabelas:", error);
      });
  }, []);

  return <div></div>;
};

export default Home;
