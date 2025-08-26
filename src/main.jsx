import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Footer } from "./components";
import "./assets/styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

createRoot(document.getElementById("footer")).render(
  <StrictMode>
    <Footer />
  </StrictMode>
);
