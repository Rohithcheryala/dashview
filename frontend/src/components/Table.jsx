import "../App.css";

function Table({ headers, rows }) {
  // console.log("h:", headers);
  // console.log("r:", rows);
  return (
    <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-md overflow-hidden">
      <thead className="bg-gray-100 border-b border-gray-200">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-2 text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : ""}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-4 py-2 border-b border-gray-200"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
