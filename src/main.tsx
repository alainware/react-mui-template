import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";

// Roboto font is loaded via index.html or a CSS import in your project.
// If you used the MUI getting-started guide, you already have:
//   @fontsource/roboto in your main CSS / index.html

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
