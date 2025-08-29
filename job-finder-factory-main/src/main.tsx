import React from "react";
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'


// Theme is now handled by ThemeContext
// No need to apply theme here

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Dark mode prompt is now handled by ThemeContext
