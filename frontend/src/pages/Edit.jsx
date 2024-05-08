import "../App.css";

function Edit() {
  // return <PreprocessingForm />;
  const { id: dash_name } = useParams(); // Accessing the 'id' parameter and renaming it to dash_name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState([
    { col_name: "", rename: "", fill_nan: "" },
  ]);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/dashview/dashboard/${dash_name}/metadata`)
      .then((response) => {
        console.log(response);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.length > 0 && formData[0].col_name != "") {
      formData.shift();
    }
    const postFormData = new FormData();
    // formData.append("file", file);
    postFormData.append("preprocessing_options", JSON.stringify(formData));

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/dashview/dashboard/${dash_name}/save`,
        postFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response.data);
      // Handle successful response
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error
    }
  };

  const handleRename = (colName, newName) => {
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      const index = updatedFormData.findIndex(
        (item) => item.col_name === colName,
      );
      if (index !== -1) {
        // Column found, update its rename property
        updatedFormData[index] = { ...updatedFormData[index], rename: newName };
      } else {
        // Column not found, add it to the state
        updatedFormData.push({
          col_name: colName,
          rename: newName,
          fill_nan: "",
        });
      }
      return updatedFormData;
    });
  };

  const handleNullValues = (colName, strategy) => {
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      const index = updatedFormData.findIndex(
        (item) => item.col_name === colName,
      );
      if (index !== -1) {
        // Column found, update its rename property
        updatedFormData[index] = {
          ...updatedFormData[index],
          fill_nan: strategy,
        };
      } else {
        // Column not found, add it to the state
        updatedFormData.push({
          col_name: colName,
          fill_nan: strategy,
          rename: "",
        });
      }
      return updatedFormData;
    });
  };

  return (
    <>
      <h1>Some Useful Data</h1>
      {data.columns.map((d, index) => (
        <div key={index}>{JSON.stringify(d)}</div>
      ))}

      <form onSubmit={handleSubmit}>
        {data.columns.map((d, index) => (
          <div key={index}>
            <h3>{d.name}</h3>
            <label>
              Rename to
              <input onChange={(e) => handleRename(d.name, e.target.value)} />
            </label>
            <label>
              Handle Missing Values:
              <select
                name="fill_strategy"
                onChange={(e) => handleNullValues(d.name, e.target.value)}
              >
                <option value="mean">Mean</option>
                <option value="median">Median</option>
                <option value="mode">Mode</option>
              </select>
            </label>
          </div>
        ))}

        <button type="submit">Save</button>
      </form>
    </>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Table from "../components/Table";

const PreprocessingForm = () => {
  const { id: dash_name } = useParams(); // Accessing the 'id' parameter and renaming it to dash_name

  const [preprocessingOptions, setPreprocessingOptions] = useState({
    handleMissingValues: "",
    missingValuesThreshold: 0,
    featureScaling: "",
    encodingCategoricalVariables: false,
    featureEngineering: false,
    handlingOutliers: false,
    dimensionalityReduction: "",
    handlingSkewedData: "",
    featureSelection: "",
    dataSampling: "",
    // Add more preprocessing options as needed
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setPreprocessingOptions((prevOptions) => ({
      ...prevOptions,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    // formData.append("file", file);
    formData.append(
      "preprocessing_options",
      JSON.stringify(preprocessingOptions),
    );

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/dashview/dashboard/${dash_name}/save`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response.data);
      // Handle successful response
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error
    }
  };

  return (
    <>
      <h1>Some Useful</h1>
      <Table headers={undefined} rows={undefined}></Table>
      <form onSubmit={handleSubmit}>
        {/* <Table headers={undefined} rows={undefined}></Table> */}
        {/* <input type="file" accept=".csv" onChange={handleFileChange} /> */}
        <div>
          <label>
            Handle Missing Values:
            <select
              name="handleMissingValues"
              value={preprocessingOptions.handleMissingValues}
              onChange={handleInputChange}
            >
              <option value="">Select...</option>
              <option value="mean">Mean</option>
              <option value="median">Median</option>
              <option value="remove_rows">Remove Rows</option>
              <option value="remove_columns">Remove Columns</option>
              <option value="knn_imputer">KNN Imputer</option>
              <option value="iterative_imputer">Iterative Imputer</option>
            </select>
          </label>
          {preprocessingOptions.handleMissingValues === "remove_rows" ||
          preprocessingOptions.handleMissingValues === "remove_columns" ? (
            <input
              type="number"
              name="missingValuesThreshold"
              value={preprocessingOptions.missingValuesThreshold}
              onChange={handleInputChange}
            />
          ) : null}
        </div>
        {/* Add more preprocessing options inputs */}
        <button type="submit">Save</button>
      </form>
    </>
  );
};

// export default PreprocessingForm;

export default Edit;
