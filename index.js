const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ===== File Upload Config =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ===== Database Setup =====
if (!fs.existsSync("./db")) fs.mkdirSync("./db");
const db = new sqlite3.Database("./db/database.sqlite");

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS artisans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    contact TEXT,
    city TEXT,
    skills TEXT,
    bio TEXT,
    photo TEXT,
    tier TEXT DEFAULT 'unverified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    contact TEXT,
    city TEXT,
    skills TEXT,
    bio TEXT,
    experience TEXT,
    documents TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

// ===== Routes =====
app.get("/", (req, res) => {
  res.redirect("/join");
});

app.get("/join", (req, res) => {
  res.render("join");
});

// Handle unverified artisan signup
app.post("/api/join/unverified", upload.single("photo"), (req, res) => {
  const { name, contact, city, skills, bio } = req.body;
  const photo = req.file ? req.file.filename : null;

  db.run(
    `INSERT INTO artisans (name, contact, city, skills, bio, photo, tier) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, contact, city, skills, bio, photo, "unverified"],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving artisan.");
      }
      res.send(
        "<h2>✅ You’re listed as Unverified. Upgrade anytime!</h2><a href='/join'>Back</a>",
      );
    },
  );
});

// Handle verified artisan application
app.post("/api/join/verified", upload.array("documents", 3), (req, res) => {
  const { name, contact, city, skills, bio, experience } = req.body;
  const documents = req.files.map((f) => f.filename).join(",");

  db.run(
    `INSERT INTO applications (name, contact, city, skills, bio, experience, documents, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, contact, city, skills, bio, experience, documents, "pending"],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving application.");
      }
      res.send(
        "<h2>✅ Application submitted. We’ll review and contact you with payment instructions.</h2><a href='/join'>Back</a>",
      );
    },
  );
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // Import the createClient function
  import { createClient } from "@supabase/supabase-js";

  // Access your environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // Create the Supabase client
  export const supabase = createClient(supabaseUrl, supabaseKey);

  // --- You are now connected! ---

  // Example: How to fetch data from a table named 'profiles'
  async function getArtisans() {
    try {
      let { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Data fetched successfully:", data);
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    }
  }

  // Run the example function
  getProfiles();
});
