import { Router } from "express";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

import { storage } from "./storage";
import { insertArtisanSchema, insertSearchRequestSchema, insertContactMessageSchema } from "../shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { emailService } from "./emailService";
import { artisanAuthService } from "./artisanAuth";
import { verifyAdminToken } from "./adminAuth";
import {
  uploadProfilePicture,
  deleteProfilePicture,
  uploadPortfolioImage,
  deletePortfolioImage
} from "./supabaseStorage";

const router = Router();
const upload = multer();

// Health check
router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/* ---------------- AUTH ---------------- */

router.post("/artisan/login", artisanAuthService.login);
router.post("/artisan/register", artisanAuthService.register);

/* ---------------- ARTISANS ---------------- */

router.post("/artisan", async (req, res) => {
  const data = insertArtisanSchema.parse(req.body);
  const artisan = await storage.createArtisan(data);
  res.json(artisan);
});

/* ---------------- SEARCH ---------------- */

router.post("/search", async (req, res) => {
  const data = insertSearchRequestSchema.parse(req.body);
  const result = await storage.createSearchRequest(data);
  res.json(result);
});

/* ---------------- CONTACT ---------------- */

router.post("/contact", async (req, res) => {
  const data = insertContactMessageSchema.parse(req.body);
  await emailService.sendContactMessage(data);
  res.json({ success: true });
});

/* ---------------- FILE UPLOADS ---------------- */

router.post(
  "/artisan/profile-picture",
  upload.single("file"),
  async (req, res) => {
    if (!req.file) return res.status(400).send("No file");

    const type = await fileTypeFromBuffer(req.file.buffer);
    if (!type) return res.status(400).send("Invalid file");

    const url = await uploadProfilePicture(req.file.buffer, type.mime);
    res.json({ url });
  }
);

router.delete("/artisan/profile-picture", async (req, res) => {
  await deleteProfilePicture(req.body.path);
  res.json({ success: true });
});

router.post(
  "/artisan/portfolio",
  upload.single("file"),
  async (req, res) => {
    if (!req.file) return res.status(400).send("No file");

    const type = await fileTypeFromBuffer(req.file.buffer);
    if (!type) return res.status(400).send("Invalid file");

    const url = await uploadPortfolioImage(req.file.buffer, type.mime);
    res.json({ url });
  }
);

router.delete("/artisan/portfolio", async (req, res) => {
  await deletePortfolioImage(req.body.path);
  res.json({ success: true });
});

/* ---------------- ADMIN ---------------- */

router.get("/admin/artisans", verifyAdminToken, async (_req, res) => {
  const artisans = await storage.getAllArtisans();
  res.json(artisans);
});

export default router;
