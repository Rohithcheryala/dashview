import axios from "axios";
import "../App.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Table from "../components/Table";

// function handleStrategySelect(strategy) {
//   console.log("Selected strategy:", strategy);
//   // You can perform further actions based on the selected strategy, such as applying it to fill null values.
// }

// function CSVInfo({
//   totalRows,
//   totalColumns,
//   emptyValues,
//   nullValuesPerColumn,
//   onStrategySelect,
// }) {
//   return (
//     <div className="bg-gray-100 p-4 rounded-md shadow-md">
//       <p className="text-lg font-semibold">CSV Info:</p>
//       <p>Total Rows: {totalRows}</p>
//       <p>Total Columns: {totalColumns}</p>
//       <p>Empty Values: {emptyValues}</p>
//       <div>
//         <p>Null Values Per Column:</p>
//         <table className="border-collapse border border-gray-500">
//           <thead>
//             <tr>
//               <th className="border border-gray-500 p-2">Column Name</th>
//               <th className="border border-gray-500 p-2">Null Values</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(nullValuesPerColumn).map(
//               ([columnName, nullCount]) => (
//                 <tr key={columnName}>
//                   <td className="border border-gray-500 p-2">{columnName}</td>
//                   <td className="border border-gray-500 p-2">{nullCount}</td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
//       </div>
//       <div className="mt-4">
//         <p>Select a filling strategy:</p>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
//           onClick={() => onStrategySelect("mean")}
//         >
//           Mean
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded-md"
//           onClick={() => onStrategySelect("median")}
//         >
//           Median
//         </button>
//       </div>
//     </div>
//   );
// }

function Preview() {
  const { id: dash_name } = useParams(); // Accessing the 'id' parameter and renaming it to dash_name
  //   const [headers, setHeaders] = useState([]);
  //   const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/dashview/dashboard/${dash_name}/preview`)
      .then((response) => {
        console.log(response)
        setData(response.data);
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

  //   const {
  //     total_records,
  //     column_info,
  //     missing_values_total,
  //     missing_values_per_column,
  //     // numeric_summary,
  //     unique_values_count,
  //     data_preview,
  //   } = data;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Total Records */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Total Records</h2>
        <p>{data.total_records}</p>
        {/* {console.log(data.total_records)} */}
      </div>

      {/* Column Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Column Information</h2>
        <pre>{JSON.stringify(data.column_info, null, 2)}</pre>
      </div>

      {/* Missing Values Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Missing Values Summary</h2>
        <p>Total Missing Values: {data.missing_values_total}</p>
        <pre>{JSON.stringify(data.missing_values_per_column, null, 2)}</pre>
      </div>

      {/* Numeric Summary */}
      {/* <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Numeric Summary</h2>
          <pre>{JSON.stringify(numeric_summary, null, 2)}</pre>
        </div> */}

      {/* Unique Values Count */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Unique Values Count</h2>
        <pre>{JSON.stringify(data.unique_values_count, null, 2)}</pre>
      </div>

      {/* Data Preview */}
      <Table
        headers={data.data_preview.columns}
        rows={data.data_preview.data}
      ></Table>
    </div>
  );
}

export default Preview;
