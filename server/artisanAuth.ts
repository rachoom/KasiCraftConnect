import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "./db";
import { artisans } from "@shared/schema";
import { eq } from "drizzle-orm";
import { emailService } from "./emailService";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "artisan-jwt-secret-key";
const SALT_ROUNDS = 12;

interface AuthResult {
  success: boolean;
  token?: string;
  artisan?: any;
  message?: string;
}

class ArtisanAuthService {
  // Generate a secure verification token
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Verify password
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  generateJWTToken(artisanId: number, email: string): string {
    return jwt.sign(
      { artisanId, email, type: 'artisan' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  // Verify JWT token
  verifyJWTToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Register new artisan with email verification
  async registerArtisan(artisanData: any, password: string): Promise<AuthResult> {
    try {
      // Hash password
      const hashedPassword = await this.hashPassword(password);
      
      // Generate verification token
      const verificationToken = this.generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      // Create artisan with authentication fields
      const [artisan] = await db.insert(artisans).values({
        ...artisanData,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        isEmailVerified: false
      }).returning();

      // Send verification email
      await this.sendVerificationEmail(artisan.email, verificationToken, artisan.firstName);

      return {
        success: true,
        message: "Registration successful! Please check your email to verify your account."
      };
    } catch (error: any) {
      console.error("Artisan registration error:", error);
      throw new Error("Registration failed");
    }
  }

  // Send email verification
  async sendVerificationEmail(email: string, token: string, firstName: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/artisan/verify-email?token=${token}`;
    
    await emailService.sendArtisanEmailVerification({
      email,
      firstName,
      verificationUrl
    });
  }

  // Verify email token
  async verifyEmailToken(token: string): Promise<any> {
    try {
      const [artisan] = await db.select()
        .from(artisans)
        .where(eq(artisans.emailVerificationToken, token));

      if (!artisan || !artisan.emailVerificationExpires) {
        return null;
      }

      // Check if token has expired
      const expirationDate = new Date(artisan.emailVerificationExpires);
      if (expirationDate < new Date()) {
        return null;
      }

      // Update artisan as verified
      const [updatedArtisan] = await db.update(artisans)
        .set({
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null,
          updatedAt: new Date().toISOString()
        })
        .where(eq(artisans.id, artisan.id))
        .returning();

      return updatedArtisan;
    } catch (error) {
      console.error("Email verification error:", error);
      return null;
    }
  }

  // Login with email and password
  async loginArtisan(email: string, password: string): Promise<AuthResult> {
    try {
      const [artisan] = await db.select()
        .from(artisans)
        .where(eq(artisans.email, email));

      if (!artisan || !artisan.password) {
        return {
          success: false,
          message: "Invalid email or password"
        };
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, artisan.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password"
        };
      }

      // Check if email is verified
      if (!artisan.isEmailVerified) {
        return {
          success: false,
          message: "Please verify your email address before logging in"
        };
      }

      // Update last login
      await db.update(artisans)
        .set({
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .where(eq(artisans.id, artisan.id));

      // Generate JWT token
      const token = this.generateJWTToken(artisan.id, artisan.email);

      return {
        success: true,
        token,
        artisan: {
          id: artisan.id,
          firstName: artisan.firstName,
          lastName: artisan.lastName,
          email: artisan.email,
          phone: artisan.phone,
          location: artisan.location,
          services: artisan.services,
          verified: artisan.verified,
          approvalStatus: artisan.approvalStatus
        }
      };
    } catch (error: any) {
      console.error("Artisan login error:", error);
      return {
        success: false,
        message: "Login failed"
      };
    }
  }

  // Get artisan by token
  async getArtisanByToken(token: string): Promise<any> {
    try {
      const decoded = this.verifyJWTToken(token);
      if (!decoded || decoded.type !== 'artisan') {
        return null;
      }

      const [artisan] = await db.select()
        .from(artisans)
        .where(eq(artisans.id, decoded.artisanId));

      return artisan || null;
    } catch (error) {
      console.error("Get artisan by token error:", error);
      return null;
    }
  }
}

// Middleware to require artisan authentication
export const requireArtisanAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No authorization token provided" });
    }

    const token = authHeader.substring(7);
    const artisan = await artisanAuthService.getArtisanByToken(token);
    
    if (!artisan) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    (req as any).artisan = artisan;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export const artisanAuthService = new ArtisanAuthService();