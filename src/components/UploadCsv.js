import { useState, useRef } from "react";
import React from "react";
import { useUploadContext } from "../context/upload";
import Spinner from "./Spinner";
const UploadCsv = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const { setResponse, setLoading, loading } = useUploadContext(); // Get the setResponse function from context

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Open file dialog
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(process.env.REACT_APP_SERVER_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("data", data);
      setResponse(data);
      setLoading(false);

    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {
        loading ? <Spinner /> : <>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            onClick={handleButtonClick}
          >
            Upload CSV
          </button>

          {file && (
            <>
              <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center" onClick={() => uploadFile()}>Send</button>
            </>
          )}</>
      }
    </div>
  );
};

export default UploadCsv;
