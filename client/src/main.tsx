import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

createRoot(document.getElementById("root")!).render(<App />);
