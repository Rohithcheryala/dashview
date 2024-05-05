import "../App.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Table from "../components/Table";
import axios from "axios";

function Dashboard() {
  const { id: dash_name } = useParams(); // Accessing the 'id' parameter and renaming it to dash_name
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("in here");
    axios
      .get(`http://localhost:8000/dashview/dashboard/${dash_name}`)
      .then((response) => {
        console.log(typeof response.data);
        setHeaders(response.data.headers);
        setRows(response.data.rows);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [dash_name]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{dash_name}</h1>
      <Table headers={headers} rows={rows} />
    </div>
  );
}

export default Dashboard;
