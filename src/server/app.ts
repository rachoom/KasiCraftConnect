import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

export default app;
