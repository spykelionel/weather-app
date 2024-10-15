import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WeatherComponent from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-screen grid place-items-center">
      <WeatherComponent />
    </div>
  </StrictMode>
);
