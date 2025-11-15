import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArtisanSchema, insertSearchRequestSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { emailService } from "./emailService";
import { artisanAuthService } from "./artisanAuth";
import { verifyAdminToken } from "./adminAuth";
import multer from "multer";
import { uploadProfilePicture, deleteProfilePicture } from "./supabaseStorage";
import { fileTypeFromBuffer } from "file-type";

// Configure multer for profile image uploads (memory storage)
const profileImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

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

  // Handle the login route specifically to avoid collision with :id route
  app.get("/api/artisans/login", (req, res) => {
    res.status(404).json({ message: "Login endpoint should use POST method" });
  });

  app.get("/api/artisans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Prevent non-numeric IDs from being processed
      if (isNaN(id)) {
        return res.status(404).json({ message: "Artisan not found" });
      }
      
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
      // First validate the input data
      const validatedData = insertArtisanSchema.parse(req.body);
      
      // Check for existing artisan with same email
      const existingArtisan = await storage.getArtisanByEmail(validatedData.email);
      if (existingArtisan) {
        return res.status(409).json({ 
          message: "Profile already exists", 
          error: "An artisan profile with this email address already exists. Please use a different email or contact support if you believe this is an error." 
        });
      }

      // Check for existing artisan with same phone number
      const existingPhone = await storage.getArtisanByPhone(validatedData.phone);
      if (existingPhone) {
        return res.status(409).json({ 
          message: "Phone number already registered", 
          error: "An artisan profile with this phone number already exists. Please use a different phone number or contact support if you believe this is an error." 
        });
      }
      
      // Normalize document paths if they are URLs
      const objectStorageService = new ObjectStorageService();
      if (validatedData.idDocument) {
        validatedData.idDocument = objectStorageService.normalizeDocumentPath(validatedData.idDocument);
      }
      if (validatedData.qualificationDocuments && validatedData.qualificationDocuments.length > 0) {
        validatedData.qualificationDocuments = validatedData.qualificationDocuments.map(doc => 
          objectStorageService.normalizeDocumentPath(doc)
        );
      }
      
      const artisan = await storage.createArtisan(validatedData);
      
      // Send email notification
      await emailService.sendArtisanRegistrationNotification({
        firstName: artisan.firstName,
        lastName: artisan.lastName,
        email: artisan.email,
        phone: artisan.phone,
        location: artisan.location,
        services: artisan.services,
        description: artisan.description,
        yearsExperience: artisan.yearsExperience,
      });
      
      res.status(201).json(artisan);
    } catch (error: any) {
      console.error("Artisan registration error:", error);
      
      // Handle Zod validation errors
      if (error.name === 'ZodError') {
        const firstError = error.errors[0];
        let errorMessage = "Invalid information provided";
        
        if (firstError.path.includes('email')) {
          errorMessage = "Please provide a valid email address";
        } else if (firstError.path.includes('phone')) {
          errorMessage = "Please provide a valid phone number";
        } else if (firstError.path.includes('firstName')) {
          errorMessage = "First name is required and must be at least 2 characters";
        } else if (firstError.path.includes('lastName')) {
          errorMessage = "Last name is required and must be at least 2 characters";
        } else if (firstError.path.includes('location')) {
          errorMessage = "Please provide your location";
        } else if (firstError.path.includes('services')) {
          errorMessage = "Please select at least one service you offer";
        } else if (firstError.path.includes('description')) {
          errorMessage = "Please provide a description of your services (at least 20 characters)";
        } else if (firstError.path.includes('yearsExperience')) {
          errorMessage = "Please provide your years of experience (must be between 1 and 50)";
        }
        
        return res.status(400).json({ 
          message: "Validation failed", 
          error: errorMessage,
          details: firstError.message
        });
      }
      
      // Handle database constraint errors
      if (error.code === '23505') { // PostgreSQL unique constraint violation
        if (error.constraint?.includes('email')) {
          return res.status(409).json({ 
            message: "Email already registered", 
            error: "This email address is already registered. Please use a different email or contact support." 
          });
        }
        if (error.constraint?.includes('phone')) {
          return res.status(409).json({ 
            message: "Phone number already registered", 
            error: "This phone number is already registered. Please use a different phone number or contact support." 
          });
        }
        return res.status(409).json({ 
          message: "Duplicate information", 
          error: "Some of the information you provided is already registered in our system. Please check your details and try again." 
        });
      }
      
      // Generic error
      res.status(500).json({ 
        message: "Registration failed", 
        error: "An unexpected error occurred while creating your profile. Please try again or contact support if the problem persists." 
      });
    }
  });

  // Artisan Authentication Routes
  // Removed duplicate endpoint - using /api/artisan/login instead

  app.post("/api/artisans/register", async (req, res) => {
    try {
      const { password, ...artisanData } = req.body;
      
      if (!password) {
        return res.status(400).json({ 
          message: "Password is required" 
        });
      }

      // Validate the artisan data
      const validatedData = insertArtisanSchema.parse(artisanData);
      
      const result = await artisanAuthService.registerArtisan(validatedData, password);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: result.message || "Registration failed" 
        });
      }

      res.status(201).json({
        message: "Registration successful. Please check your email to verify your account.",
        artisan: result.artisan
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Unverified Artisan Registration (Free, Instant)
  app.post("/api/artisans/unverified", async (req, res) => {
    try {
      const artisanData = insertArtisanSchema.parse({
        ...req.body,
        verified: false,
        subscriptionTier: "unverified",
        approvalStatus: "approved", // Auto-approved for unverified
        profileImage: null,
        portfolio: [],
        password: null,
        googleId: null,
        idDocument: null,
        qualificationDocuments: [],
      });

      // Check for existing email
      const existingEmail = await storage.getArtisanByEmail(artisanData.email);
      if (existingEmail) {
        return res.status(409).json({
          message: "Email already registered",
          error: "This email is already in use. Please use a different email."
        });
      }

      // Check for existing phone
      const existingPhone = await storage.getArtisanByPhone(artisanData.phone);
      if (existingPhone) {
        return res.status(409).json({
          message: "Phone already registered", 
          error: "This phone number is already in use. Please use a different phone number."
        });
      }

      const newArtisan = await storage.createArtisan(artisanData);
      
      res.status(201).json({
        message: "Unverified profile created successfully!",
        artisan: newArtisan
      });
    } catch (error: any) {
      console.error("Unverified registration error:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          message: "Validation failed",
          error: error.errors[0]?.message || "Invalid data provided"
        });
      }
      
      res.status(500).json({
        message: "Registration failed",
        error: "An error occurred while creating your profile. Please try again."
      });
    }
  });

  // Verified Artisan Application (Requires Admin Approval)
  app.post("/api/artisans/verified", async (req, res) => {
    try {
      const artisanData = insertArtisanSchema.parse({
        ...req.body,
        verified: false, // Will be set to true upon approval
        approvalStatus: "pending",
        verificationStatus: "pending",
        profileImage: null,
        portfolio: [],
        password: null,
        googleId: null,
      });

      // Check for existing email
      const existingEmail = await storage.getArtisanByEmail(artisanData.email);
      if (existingEmail) {
        return res.status(409).json({
          message: "Email already registered",
          error: "This email is already in use. Please use a different email."
        });
      }

      // Check for existing phone
      const existingPhone = await storage.getArtisanByPhone(artisanData.phone);
      if (existingPhone) {
        return res.status(409).json({
          message: "Phone already registered",
          error: "This phone number is already in use. Please use a different phone number."
        });
      }

      const newArtisan = await storage.createArtisan(artisanData);
      
      // TODO: Send email notification to admin about new application
      
      res.status(201).json({
        message: "Application submitted successfully! We'll review it within 2-3 business days.",
        artisan: newArtisan
      });
    } catch (error: any) {
      console.error("Verified application error:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          message: "Validation failed",
          error: error.errors[0]?.message || "Invalid data provided"
        });
      }
      
      res.status(500).json({
        message: "Application failed",
        error: "An error occurred while submitting your application. Please try again."
      });
    }
  });

  app.get("/api/artisans/verify/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const result = await artisanAuthService.verifyEmail(token);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: result.message || "Email verification failed" 
        });
      }

      res.json({
        message: "Email verified successfully. You can now log in.",
        artisan: result.artisan
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Email verification failed" });
    }
  });

  // Google OAuth Routes
  app.get("/api/auth/google", (req, res) => {
    // Use Replit domain for redirect URI
    const redirectUri = process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS}/api/auth/google/callback`
      : process.env.GOOGLE_REDIRECT_URI || `http://localhost:5000/api/auth/google/callback`;
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `state=artisan`;
    
    console.log('Google OAuth redirect URI:', redirectUri);
    res.redirect(googleAuthUrl);
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code || state !== 'artisan') {
        return res.status(400).json({ message: "Invalid OAuth callback" });
      }

      const result = await artisanAuthService.handleGoogleOAuth(code as string);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: result.message || "Google authentication failed" 
        });
      }

      // Redirect to frontend with token - but let's redirect to a success page instead
      res.redirect(`/artisan/login?token=${result.token}`);
    } catch (error) {
      console.error("Google OAuth error:", error);
      res.status(500).json({ message: "Google authentication failed" });
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
  app.get("/api/admin/pending-artisans", verifyAdminToken, async (req, res) => {
    try {
      const pendingArtisans = await storage.getPendingArtisans();
      res.json(pendingArtisans);
    } catch (error) {
      console.error("Error fetching pending artisans:", error);
      res.status(500).json({ message: "Failed to fetch pending artisans" });
    }
  });

  app.post("/api/admin/approve-artisan/:id", verifyAdminToken, async (req, res) => {
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

  app.post("/api/admin/reject-artisan/:id", verifyAdminToken, async (req, res) => {
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

  // Admin artisan management routes
  app.get("/api/admin/artisans", verifyAdminToken, async (req, res) => {
    try {
      const artisans = await storage.getAllArtisans();
      res.json(artisans);
    } catch (error) {
      console.error("Error fetching all artisans:", error);
      res.status(500).json({ message: "Failed to fetch artisans" });
    }
  });

  app.put("/api/admin/artisan/:id", verifyAdminToken, async (req, res) => {
    try {
      const artisanId = parseInt(req.params.id);
      const updates = req.body;

      const updatedArtisan = await storage.updateArtisan(artisanId, updates);
      
      if (!updatedArtisan) {
        return res.status(404).json({ message: "Artisan not found" });
      }

      res.json({ message: "Artisan updated successfully", artisan: updatedArtisan });
    } catch (error) {
      console.error("Error updating artisan:", error);
      res.status(500).json({ message: "Failed to update artisan" });
    }
  });

  app.post("/api/admin/artisan/:id/profile-image", verifyAdminToken, profileImageUpload.single('image'), async (req, res) => {
    try {
      const artisanId = parseInt(req.params.id);
      
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      console.log(`Uploading profile image for artisan ${artisanId}, size: ${req.file.size} bytes`);
      
      // Validate file type by checking buffer (more secure than trusting MIME type)
      const fileType = await fileTypeFromBuffer(req.file.buffer);
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      
      if (!fileType || !allowedTypes.includes(fileType.mime)) {
        return res.status(400).json({ 
          message: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed." 
        });
      }

      // Get current artisan to check for existing profile image
      const artisan = await storage.getArtisan(artisanId);
      if (!artisan) {
        return res.status(404).json({ message: "Artisan not found" });
      }

      // Upload new profile image to Supabase Storage
      const publicUrl = await uploadProfilePicture(
        artisanId,
        req.file.buffer,
        fileType.mime // Use validated MIME type
      );

      // Update artisan record with new profile image URL
      await storage.updateArtisan(artisanId, {
        profileImage: publicUrl
      });

      // Delete old profile image if it exists and is from Supabase
      if (artisan.profileImage && artisan.profileImage.includes('supabase')) {
        try {
          await deleteProfilePicture(artisan.profileImage);
        } catch (error) {
          console.warn('Failed to delete old profile image:', error);
          // Non-critical error, continue
        }
      }

      console.log(`Successfully uploaded profile image for artisan ${artisanId}: ${publicUrl}`);
      
      res.json({
        message: "Profile image uploaded successfully",
        url: publicUrl
      });
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ message: error?.message || "Failed to upload profile image" });
    }
  });

  // Serve entity assets (like profile images)
  app.get("/entities/:entityType/:entityId/:assetType/:assetId", async (req, res) => {
    try {
      const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const objectPath = `/entities/${req.params.entityType}/${req.params.entityId}/${req.params.assetType}/${req.params.assetId}`;
      
      const file = await objectStorageService.getEntityAssetFile(objectPath);
      await objectStorageService.downloadObject(file, res);
    } catch (error: any) {
      if (error.name === "ObjectNotFoundError") {
        return res.status(404).json({ message: "Asset not found" });
      }
      console.error("Error serving entity asset:", error);
      res.status(500).json({ message: "Failed to serve asset" });
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

  // Artisan authentication routes
  app.post("/api/artisan/register", async (req, res) => {
    try {
      const { password, ...artisanData } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      // Validate the artisan data (excluding password)
      const validatedData = insertArtisanSchema.parse(artisanData);
      
      // Check for existing artisan with same email
      const existingArtisan = await storage.getArtisanByEmail(validatedData.email);
      if (existingArtisan) {
        return res.status(409).json({ 
          message: "Profile already exists", 
          error: "An artisan profile with this email address already exists. Please use a different email or try logging in instead." 
        });
      }

      // Check for existing artisan with same phone number
      const existingPhone = await storage.getArtisanByPhone(validatedData.phone);
      if (existingPhone) {
        return res.status(409).json({ 
          message: "Phone number already registered", 
          error: "An artisan profile with this phone number already exists. Please use a different phone number or contact support if you believe this is an error." 
        });
      }

      const { artisanAuthService } = await import("./artisanAuth");
      const result = await artisanAuthService.registerArtisan(validatedData, password);
      
      if (result.success) {
        res.json({ message: result.message });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error: any) {
      console.error("Artisan registration error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation failed", 
          error: "Please check all required fields are completed correctly.",
          details: error.errors 
        });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/artisan/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const { artisanAuthService } = await import("./artisanAuth");
      const result = await artisanAuthService.loginArtisan(email, password);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(401).json({ message: result.message });
      }
    } catch (error: any) {
      console.error("Artisan login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/artisan/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).send(`
          <html>
            <head><title>Verification Failed</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: #e74c3c;">Verification Failed</h1>
              <p>No verification token provided.</p>
              <a href="/register-artisan" style="color: #DAA520; text-decoration: none;">Return to Registration</a>
            </body>
          </html>
        `);
      }

      const { artisanAuthService } = await import("./artisanAuth");
      const artisan = await artisanAuthService.verifyEmailToken(token as string);
      
      if (!artisan) {
        return res.status(400).send(`
          <html>
            <head><title>Verification Failed</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: #e74c3c;">Verification Failed</h1>
              <p>The verification link is invalid or has expired.</p>
              <a href="/register-artisan" style="color: #DAA520; text-decoration: none;">Return to Registration</a>
            </body>
          </html>
        `);
      }

      res.send(`
        <html>
          <head><title>Email Verified</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #27ae60;">Email Verified Successfully!</h1>
            <p>Welcome to Skills Connect, ${artisan.firstName}! Your email has been verified and you can now log in to manage your artisan profile.</p>
            <a href="/artisan/login" style="background: #DAA520; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Login</a>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).send("Verification failed");
    }
  });

  app.get("/api/artisan/profile", async (req, res) => {
    try {
      const { requireArtisanAuth } = await import("./artisanAuth");
      await new Promise((resolve, reject) => {
        requireArtisanAuth(req, res, (err) => err ? reject(err) : resolve(null));
      });
      
      const artisan = (req as any).artisan;
      res.json({
        id: artisan.id,
        firstName: artisan.firstName,
        lastName: artisan.lastName,
        email: artisan.email,
        phone: artisan.phone,
        location: artisan.location,
        services: artisan.services,
        description: artisan.description,
        yearsExperience: artisan.yearsExperience,
        verified: artisan.verified,
        approvalStatus: artisan.approvalStatus,
        profileImage: artisan.profileImage
      });
    } catch (error) {
      console.error("Get artisan profile error:", error);
      res.status(401).json({ message: "Authentication required" });
    }
  });

  // Document upload routes
  app.post("/api/documents/upload", async (req, res) => {
    try {
      const { documentType } = req.body;
      
      if (!documentType || !['id', 'qualification'].includes(documentType)) {
        return res.status(400).json({ error: "Invalid document type. Must be 'id' or 'qualification'" });
      }
      
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getDocumentUploadURL(documentType);
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Document download route
  app.get("/documents/:documentType/:date/:documentId", async (req, res) => {
    try {
      const { documentType, date, documentId } = req.params;
      const documentPath = `/documents/${documentType}/${date}/${documentId}`;
      
      const objectStorageService = new ObjectStorageService();
      const documentFile = await objectStorageService.getDocumentFile(documentPath);
      
      await objectStorageService.downloadObject(documentFile, res);
    } catch (error) {
      console.error("Error downloading document:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
