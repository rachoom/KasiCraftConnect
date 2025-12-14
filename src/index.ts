import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// load local .env when running locally (won't affect Firebase env)
dotenv.config();

const app = express();

// middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import your routes (adjust paths if you copied server/ into functions/src/server)
import routes from "./server/routes"; // if routes.ts exports a function/router
// or: import { router as routes } from "./server/routes";

app.use("/api", routes);

// If your server used other modules like objectStorage, initialize them similarly
// e.g., import "./server/objectStorage"

// Export Express app as a single Cloud Function
export const api = functions.region("us-central1").https.onRequest(app);
