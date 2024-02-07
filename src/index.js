import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// A ponte entre o os componentes e o navegador
import App from "./App"; // pegando componentes

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);