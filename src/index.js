import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UploadProvider } from './context/upload';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UploadProvider>
      <App />
    </UploadProvider>
  </React.StrictMode>
);

