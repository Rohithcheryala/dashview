import "../App.css";

function Edit() {
  return <PreprocessingForm />;
}

import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Table from "../components/Table";

const PreprocessingForm = () => {
  const { id: dash_name } = useParams(); // Accessing the 'id' parameter and renaming it to dash_name

  const [file, setFile] = useState(null);
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    // formData.append("file", file);
    formData.append(
      "preprocessing_options",
      JSON.stringify(preprocessingOptions)
    );

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/dashview/dashboard/${dash_name}/save`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      // Handle successful response
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <Table headers={undefined} rows={undefined}></Table> */}
      <input type="file" accept=".csv" onChange={handleFileChange} />
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
  );
};

// export default PreprocessingForm;

export default Edit;
