import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="flex-col items-center justify-center h-screen bg-slate-900 pt-12">
      <div className="text-white text-4xl text-center pb-12 font-bold text-shadow-lg">
        Simon Says
      </div>
      <App />
    </div>
  </StrictMode>
);
