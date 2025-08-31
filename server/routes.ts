import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArtisanSchema, insertSearchRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Artisan routes
  app.get("/api/artisans", async (req, res) => {
    try {
      const artisans = await storage.getAllArtisans();
      res.json(artisans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artisans" });
    }
  });

  app.get("/api/artisans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artisan = await storage.getArtisan(id);
      if (!artisan) {
        return res.status(404).json({ message: "Artisan not found" });
      }
      res.json(artisan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artisan" });
    }
  });

  app.post("/api/artisans", async (req, res) => {
    try {
      const validatedData = insertArtisanSchema.parse(req.body);
      const artisan = await storage.createArtisan(validatedData);
      res.status(201).json(artisan);
    } catch (error) {
      res.status(400).json({ message: "Invalid artisan data", error });
    }
  });

  // Search routes
  app.get("/api/search", async (req, res) => {
    try {
      const { service, location, tier = "basic" } = req.query;
      
      if (!service || !location) {
        return res.status(400).json({ message: "Service and location are required" });
      }

      // Determine limit based on tier
      let limit = 3; // basic
      if (tier === "premium") limit = 5;
      if (tier === "enterprise") limit = 10;

      const results = await storage.searchArtisans(
        service as string,
        location as string,
        limit,
        tier as string
      );

      // Log the search request
      await storage.createSearchRequest({
        service: service as string,
        location: location as string,
        tier: tier as string,
      });

      res.json({
        artisans: results,
        tier,
        limit,
        count: results.length
      });
    } catch (error) {
      res.status(500).json({ message: "Search failed", error });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const services = [
        { id: "builders", name: "Builders", icon: "fas fa-hammer" },
        { id: "plumbers", name: "Plumbers", icon: "fas fa-wrench" },
        { id: "electricians", name: "Electricians", icon: "fas fa-bolt" },
        { id: "carpenters", name: "Carpenters", icon: "fas fa-saw-blade" },
        { id: "tilers", name: "Tilers", icon: "fas fa-th-large" },
        { id: "cleaners", name: "Cleaners", icon: "fas fa-broom" },
        { id: "landscapers", name: "Landscapers", icon: "fas fa-seedling" },
      ];
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Admin routes for artisan approval
  app.get("/api/admin/pending-artisans", async (req, res) => {
    // Add auth check
    const { requireAdminAuth } = await import("./adminAuth");
    await new Promise((resolve, reject) => {
      requireAdminAuth(req, res, (err) => err ? reject(err) : resolve(null));
    }).catch(() => {
      return res.status(401).json({ message: "Unauthorized" });
    });
    try {
      const pendingArtisans = await storage.getPendingArtisans();
      res.json(pendingArtisans);
    } catch (error) {
      console.error("Error fetching pending artisans:", error);
      res.status(500).json({ message: "Failed to fetch pending artisans" });
    }
  });

  app.post("/api/admin/approve-artisan/:id", async (req, res) => {
    // Add auth check
    const { requireAdminAuth } = await import("./adminAuth");
    await new Promise((resolve, reject) => {
      requireAdminAuth(req, res, (err) => err ? reject(err) : resolve(null));
    }).catch(() => {
      return res.status(401).json({ message: "Unauthorized" });
    });
    
    try {
      const artisanId = parseInt(req.params.id);
      const { approvedBy } = req.body;

      if (!approvedBy) {
        return res.status(400).json({ message: "Approved by field is required" });
      }

      const approvedArtisan = await storage.approveArtisan(artisanId, approvedBy);
      
      if (!approvedArtisan) {
        return res.status(404).json({ message: "Artisan not found" });
      }

      res.json({ message: "Artisan approved successfully", artisan: approvedArtisan });
    } catch (error) {
      console.error("Error approving artisan:", error);
      res.status(500).json({ message: "Failed to approve artisan" });
    }
  });

  app.post("/api/admin/reject-artisan/:id", async (req, res) => {
    // Add auth check
    const { requireAdminAuth } = await import("./adminAuth");
    await new Promise((resolve, reject) => {
      requireAdminAuth(req, res, (err) => err ? reject(err) : resolve(null));
    }).catch(() => {
      return res.status(401).json({ message: "Unauthorized" });
    });
    
    try {
      const artisanId = parseInt(req.params.id);
      const { rejectionReason, rejectedBy } = req.body;

      if (!rejectionReason || !rejectedBy) {
        return res.status(400).json({ message: "Rejection reason and rejected by fields are required" });
      }

      const rejectedArtisan = await storage.rejectArtisan(artisanId, rejectionReason, rejectedBy);
      
      if (!rejectedArtisan) {
        return res.status(404).json({ message: "Artisan not found" });
      }

      res.json({ message: "Artisan rejected successfully", artisan: rejectedArtisan });
    } catch (error) {
      console.error("Error rejecting artisan:", error);
      res.status(500).json({ message: "Failed to reject artisan" });
    }
  });

  // Artisan subscription routes
  app.post("/api/artisan-subscription", async (req, res) => {
    try {
      const subscriptionData = req.body;
      const subscription = await storage.createArtisanSubscription(subscriptionData);
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error creating artisan subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    try {
      // Simple implementation - in production, you'd use proper cloud storage
      const uploadURL = `${req.protocol}://${req.hostname}/uploads/${Date.now()}-${Math.random().toString(36).substring(7)}`;
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ message: "Failed to generate upload URL" });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const { adminAuthService } = await import("./adminAuth");
      
      const result = await adminAuthService.verifyEmail(email, password);
      res.json(result);
    } catch (error: any) {
      console.error("Admin login error:", error);
      res.status(401).json({ message: error.message || "Login failed" });
    }
  });

  app.post("/api/admin/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      const { adminAuthService } = await import("./adminAuth");
      
      const verificationToken = adminAuthService.generateVerificationToken();
      await adminAuthService.sendVerificationEmail(email, verificationToken);
      
      res.json({ message: "Verification email sent" });
    } catch (error: any) {
      console.error("Resend verification error:", error);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  });

  app.get("/api/admin/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      const { adminAuthService } = await import("./adminAuth");
      
      const admin = await adminAuthService.verifyEmailToken(token as string);
      
      if (!admin) {
        return res.status(400).send(`
          <html>
            <head><title>Verification Failed</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: #e74c3c;">Verification Failed</h1>
              <p>The verification link is invalid or has expired.</p>
              <a href="/admin/login" style="color: #DAA520; text-decoration: none;">Return to Login</a>
            </body>
          </html>
        `);
      }

      res.send(`
        <html>
          <head><title>Email Verified</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #27ae60;">Email Verified Successfully!</h1>
            <p>Your admin account has been verified. You can now log in.</p>
            <a href="/admin/login" style="background: #DAA520; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Login</a>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).send("Verification failed");
    }
  });

  app.get("/api/admin/verify-token", async (req, res) => {
    try {
      const { requireAdminAuth } = await import("./adminAuth");
      await new Promise((resolve, reject) => {
        requireAdminAuth(req, res, (err) => err ? reject(err) : resolve(null));
      });
      res.json({ valid: true, admin: (req as any).admin });
    } catch (error) {
      res.status(401).json({ valid: false });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
