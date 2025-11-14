import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "../../node_modules/@uppy/core/dist/style.css";
import "../../node_modules/@uppy/dashboard/dist/style.css";

createRoot(document.getElementById("root")!).render(<App />);
