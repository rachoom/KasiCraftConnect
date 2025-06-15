import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { adminUsers } from "@shared/schema";
import type { AdminUser, InsertAdminUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@kasiconnect.com";

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface AdminAuthService {
  createAdmin(data: InsertAdminUser): Promise<AdminUser>;
  verifyEmail(email: string, password: string): Promise<{ user: AdminUser; token?: string; requiresVerification?: boolean }>;
  verifyToken(token: string): Promise<AdminUser | null>;
  generateVerificationToken(): string;
  sendVerificationEmail(email: string, token: string): Promise<void>;
  verifyEmailToken(token: string): Promise<AdminUser | null>;
  createGoogleAdmin(googleData: any): Promise<{ user: AdminUser; token: string }>;
}

class AdminAuthServiceImpl implements AdminAuthService {
  async createAdmin(data: InsertAdminUser): Promise<AdminUser> {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 12) : null;
    const verificationToken = this.generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const [admin] = await db
      .insert(adminUsers)
      .values({
        ...data,
        password: hashedPassword,
        verificationToken,
        verificationExpires,
        isVerified: false,
      })
      .returning();

    return admin;
  }

  async verifyEmail(email: string, password: string): Promise<{ user: AdminUser; token?: string; requiresVerification?: boolean }> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));

    if (!admin) {
      throw new Error("Invalid credentials");
    }

    if (admin.password) {
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        throw new Error("Invalid credentials");
      }
    }

    if (!admin.isVerified) {
      if (!admin.verificationToken) {
        // Generate new verification token
        const verificationToken = this.generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        
        await db
          .update(adminUsers)
          .set({ verificationToken, verificationExpires })
          .where(eq(adminUsers.id, admin.id));

        await this.sendVerificationEmail(admin.email, verificationToken);
      }
      
      return { user: admin, requiresVerification: true };
    }

    const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Update last login
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date().toISOString() })
      .where(eq(adminUsers.id, admin.id));

    return { user: admin, token };
  }

  async verifyToken(token: string): Promise<AdminUser | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { adminId: number };
      const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, decoded.adminId));
      return admin || null;
    } catch {
      return null;
    }
  }

  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.BASE_URL || "http://localhost:5000"}/api/admin/verify-email?token=${token}`;

    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: "Verify Your Admin Account - Kasi Connect",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #DAA520; margin: 0;">Kasi Connect</h1>
            <p style="color: #666; margin: 5px 0;">Admin Account Verification</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.5;">
              Thank you for requesting admin access to Kasi Connect. To complete your verification, 
              please click the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #DAA520 0%, #B8860B 50%, #8B6914 100%); 
                        color: black; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: bold;
                        display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #DAA520; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't request admin access, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  async verifyEmailToken(token: string): Promise<AdminUser | null> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.verificationToken, token));

    if (!admin || !admin.verificationExpires) {
      return null;
    }

    const now = new Date();
    const expires = new Date(admin.verificationExpires);

    if (now > expires) {
      return null;
    }

    // Mark as verified
    const [verifiedAdmin] = await db
      .update(adminUsers)
      .set({
        isVerified: true,
        verificationToken: null,
        verificationExpires: null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(adminUsers.id, admin.id))
      .returning();

    return verifiedAdmin;
  }

  async createGoogleAdmin(googleData: any): Promise<{ user: AdminUser; token: string }> {
    let admin;

    // Check if admin already exists
    const [existingAdmin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, googleData.email));

    if (existingAdmin) {
      // Update Google ID if not set
      if (!existingAdmin.googleId) {
        [admin] = await db
          .update(adminUsers)
          .set({
            googleId: googleData.id,
            isVerified: true,
            lastLogin: new Date().toISOString(),
          })
          .where(eq(adminUsers.id, existingAdmin.id))
          .returning();
      } else {
        admin = existingAdmin;
        await db
          .update(adminUsers)
          .set({ lastLogin: new Date().toISOString() })
          .where(eq(adminUsers.id, existingAdmin.id));
      }
    } else {
      // Create new admin
      [admin] = await db
        .insert(adminUsers)
        .values({
          email: googleData.email,
          googleId: googleData.id,
          firstName: googleData.given_name,
          lastName: googleData.family_name,
          profileImage: googleData.picture,
          isVerified: true,
          lastLogin: new Date().toISOString(),
        })
        .returning();
    }

    const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return { user: admin, token };
  }
}

export const adminAuthService = new AdminAuthServiceImpl();

// Middleware to protect admin routes
export const requireAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "") || 
                  req.cookies?.adminToken ||
                  req.query.token as string;

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const admin = await adminAuthService.verifyToken(token);
    if (!admin || !admin.isVerified) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    (req as any).admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};