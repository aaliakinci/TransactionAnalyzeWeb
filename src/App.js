import { useState } from "react";
import UploadCsv from "./components/UploadCsv";
import { useUploadContext } from "./context/upload";
import Spinner from "./components/Spinner";
import Dashboard from "./components/Dashboard";


export default function App() { 
  const { response, loading } = useUploadContext();
  return (
    <div className="p-6 bg-gray-100 min-h-screen"> 
      <Dashboard data={response} loading={loading} />
    </div>
  );
}
