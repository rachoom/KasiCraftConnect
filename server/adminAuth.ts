import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { supabase } from "./supabase";
import type { AdminUser, InsertAdminUser } from "@shared/schema";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@skillsconnect.com";

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

    const { data: admin, error } = await supabase
      .from('admin_users')
      .insert({
        ...data,
        password: hashedPassword,
        verification_token: verificationToken,
        verification_expires: verificationExpires,
        is_verified: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin:', error);
      throw new Error('Failed to create admin');
    }

    return admin as AdminUser;
  }

  async verifyEmail(email: string, password: string): Promise<{ user: AdminUser; token?: string; requiresVerification?: boolean }> {
    console.log('[AdminAuth] Attempting login for:', email);
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('[AdminAuth] Query result - error:', error, 'admin found:', !!admin);
    
    if (error || !admin) {
      console.log('[AdminAuth] No admin found or error occurred');
      throw new Error("Invalid credentials");
    }

    console.log('[AdminAuth] Admin data:', { id: admin.id, email: admin.email, has_password: !!admin.password });

    if (admin.password) {
      const isValid = await bcrypt.compare(password, admin.password);
      console.log('[AdminAuth] Password comparison result:', isValid);
      if (!isValid) {
        console.log('[AdminAuth] Password mismatch');
        throw new Error("Invalid credentials");
      }
    }

    if (!admin.is_verified) {
      if (!admin.verification_token) {
        // Generate new verification token
        const verificationToken = this.generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        
        await supabase
          .from('admin_users')
          .update({ verification_token: verificationToken, verification_expires: verificationExpires })
          .eq('id', admin.id);

        await this.sendVerificationEmail(admin.email, verificationToken);
      }
      
      return { user: admin as AdminUser, requiresVerification: true };
    }

    const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    return { user: admin as AdminUser, token };
  }

  async verifyToken(token: string): Promise<AdminUser | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { adminId: number };
      const { data: admin } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', decoded.adminId)
        .single();
      
      return (admin as AdminUser) || null;
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
      subject: "Verify Your Admin Account - Skills Connect",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #DAA520; margin: 0;">Skills Connect</h1>
            <p style="color: #666; margin: 5px 0;">Admin Account Verification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Verify Your Email</h2>
            <p style="color: #666; line-height: 1.6;">
              Welcome to Skills Connect! Please verify your email address to complete your admin account setup.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: #DAA520; color: white; padding: 15px 40px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-bottom: 0;">
              This verification link will expire in 24 hours.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              If you didn't request this email, you can safely ignore it.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }

  async verifyEmailToken(token: string): Promise<AdminUser | null> {
    const { data: admin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('verification_token', token)
      .single();

    if (!admin || !admin.verification_expires) {
      return null;
    }

    const expirationDate = new Date(admin.verification_expires);
    if (expirationDate < new Date()) {
      return null;
    }

    const { data: updatedAdmin } = await supabase
      .from('admin_users')
      .update({
        is_verified: true,
        verification_token: null,
        verification_expires: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', admin.id)
      .select()
      .single();

    return (updatedAdmin as AdminUser) || null;
  }

  async createGoogleAdmin(googleData: any): Promise<{ user: AdminUser; token: string }> {
    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('google_id', googleData.id)
      .single();

    let admin: AdminUser;

    if (existingAdmin) {
      // Update last login
      const { data: updatedAdmin } = await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', existingAdmin.id)
        .select()
        .single();
      
      admin = updatedAdmin as AdminUser;
    } else {
      // Create new admin with Google data
      const { data: newAdmin, error } = await supabase
        .from('admin_users')
        .insert({
          email: googleData.email,
          google_id: googleData.id,
          first_name: googleData.given_name,
          last_name: googleData.family_name,
          profile_image: googleData.picture,
          is_verified: true, // Google accounts are pre-verified
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating Google admin:', error);
        throw new Error('Failed to create admin from Google account');
      }

      admin = newAdmin as AdminUser;
    }

    const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return { user: admin, token };
  }
}

export const adminAuthService = new AdminAuthServiceImpl();

// Middleware to verify admin token
export async function verifyAdminToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const admin = await adminAuthService.verifyToken(token);

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    (req as any).admin = admin;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Unauthorized: Token verification failed" });
  }
}
