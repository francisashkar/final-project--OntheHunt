import React from "react";
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'

// Apply theme from localStorage or default to system preference
const theme = localStorage.getItem("theme") || "light";
if (theme) {
  document.documentElement.classList.add(theme);
} else {
  // If no theme is set, use system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.add(prefersDark ? "dark" : "light");
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Dark mode prompt
setTimeout(() => {
  if (localStorage.getItem("theme") !== "dark" && !localStorage.getItem("darkModePrompted")) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (!prefersDark) {
      // Only show if user isn't already using dark mode via system preferences
      const shouldSwitchToDark = window.confirm("Would you like to try our dark mode? It's easier on the eyes!");
      if (shouldSwitchToDark) {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
      localStorage.setItem("darkModePrompted", "true");
    }
  }
}, 3000);
