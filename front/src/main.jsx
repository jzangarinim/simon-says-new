import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="h-screen overflow-hidden bg-slate-900">
      <App />
    </div>
  </StrictMode>
);
