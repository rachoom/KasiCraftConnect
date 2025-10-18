import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { supabase } from "./supabase";
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
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateJWTToken(artisanId: number, email: string): string {
    return jwt.sign(
      { artisanId, email, type: 'artisan' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyJWTToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  async registerArtisan(artisanData: any, password: string): Promise<AuthResult> {
    try {
      const hashedPassword = await this.hashPassword(password);
      const verificationToken = this.generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const { data: artisan, error } = await supabase
        .from('artisans')
        .insert({
          ...artisanData,
          password: hashedPassword,
          email_verification_token: verificationToken,
          email_verification_expires: verificationExpires,
          is_email_verified: false
        })
        .select()
        .single();

      if (error) {
        console.error("Artisan registration error:", error);
        throw new Error("Registration failed");
      }

      await this.sendVerificationEmail(artisan.email, verificationToken, artisan.first_name);

      return {
        success: true,
        message: "Registration successful! Please check your email to verify your account."
      };
    } catch (error: any) {
      console.error("Artisan registration error:", error);
      throw new Error("Registration failed");
    }
  }

  async sendVerificationEmail(email: string, token: string, firstName: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/artisan/verify-email?token=${token}`;
    
    await emailService.sendArtisanEmailVerification({
      email,
      firstName,
      verificationUrl
    });
  }

  async verifyEmailToken(token: string): Promise<any> {
    try {
      const { data: artisan, error } = await supabase
        .from('artisans')
        .select('*')
        .eq('email_verification_token', token)
        .single();

      if (error || !artisan || !artisan.email_verification_expires) {
        return null;
      }

      const expirationDate = new Date(artisan.email_verification_expires);
      if (expirationDate < new Date()) {
        return null;
      }

      const { data: updatedArtisan } = await supabase
        .from('artisans')
        .update({
          is_email_verified: true,
          email_verification_token: null,
          email_verification_expires: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', artisan.id)
        .select()
        .single();

      return updatedArtisan;
    } catch (error) {
      console.error("Email verification error:", error);
      return null;
    }
  }

  async loginArtisan(email: string, password: string): Promise<AuthResult> {
    try {
      const { data: artisan, error } = await supabase
        .from('artisans')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !artisan || !artisan.password) {
        return {
          success: false,
          message: "Invalid email or password"
        };
      }

      const isPasswordValid = await this.verifyPassword(password, artisan.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password"
        };
      }

      if (!artisan.is_email_verified) {
        return {
          success: false,
          message: "Please verify your email address before logging in"
        };
      }

      await supabase
        .from('artisans')
        .update({
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', artisan.id);

      const token = this.generateJWTToken(artisan.id, artisan.email);

      return {
        success: true,
        token,
        artisan: {
          id: artisan.id,
          firstName: artisan.first_name,
          lastName: artisan.last_name,
          email: artisan.email,
          phone: artisan.phone,
          location: artisan.location,
          services: artisan.services,
          verified: artisan.verified,
          approvalStatus: artisan.approval_status
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

  async getArtisanByToken(token: string): Promise<any> {
    try {
      const decoded = this.verifyJWTToken(token);
      if (!decoded || decoded.type !== 'artisan') {
        return null;
      }

      const { data: artisan } = await supabase
        .from('artisans')
        .select('*')
        .eq('id', decoded.artisanId)
        .single();

      return artisan || null;
    } catch (error) {
      console.error("Get artisan by token error:", error);
      return null;
    }
  }

  async verifyEmail(token: string): Promise<AuthResult> {
    try {
      const { data: artisan, error } = await supabase
        .from('artisans')
        .select('*')
        .eq('email_verification_token', token)
        .single();

      if (error || !artisan) {
        return {
          success: false,
          message: "Invalid verification token"
        };
      }

      if (artisan.email_verification_expires && new Date(artisan.email_verification_expires) < new Date()) {
        return {
          success: false,
          message: "Verification token has expired. Please request a new verification email."
        };
      }

      const { data: updatedArtisan } = await supabase
        .from('artisans')
        .update({
          is_email_verified: true,
          email_verification_token: null,
          email_verification_expires: null
        })
        .eq('id', artisan.id)
        .select()
        .single();

      return {
        success: true,
        artisan: updatedArtisan,
        message: "Email verified successfully"
      };
    } catch (error) {
      console.error("Email verification error:", error);
      return {
        success: false,
        message: "Email verification failed. Please try again."
      };
    }
  }

  async handleGoogleOAuth(code: string): Promise<AuthResult> {
    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.REPLIT_DOMAINS 
            ? `https://${process.env.REPLIT_DOMAINS}/api/auth/google/callback`
            : process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens = await tokenResponse.json();

      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info from Google');
      }

      const googleUser = await userResponse.json();

      const { data: existingArtisan } = await supabase
        .from('artisans')
        .select('*')
        .eq('email', googleUser.email)
        .single();

      let artisan;
      if (existingArtisan) {
        if (!existingArtisan.google_id) {
          const { data: updated } = await supabase
            .from('artisans')
            .update({
              google_id: googleUser.id,
              is_email_verified: true
            })
            .eq('id', existingArtisan.id)
            .select()
            .single();
          artisan = updated;
        } else {
          artisan = existingArtisan;
        }
      } else {
        const { data: newArtisan } = await supabase
          .from('artisans')
          .insert({
            first_name: googleUser.given_name || googleUser.name?.split(' ')[0] || 'Google',
            last_name: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || 'User',
            email: googleUser.email,
            phone: '',
            location: '',
            services: [],
            description: '',
            years_experience: 0,
            google_id: googleUser.id,
            is_email_verified: true,
            profile_complete: false
          })
          .select()
          .single();
        artisan = newArtisan;
      }

      const token = this.generateJWTToken(artisan.id, artisan.email);
      const { password, email_verification_token, email_verification_expires, ...safeArtisan } = artisan;

      return {
        success: true,
        token,
        artisan: safeArtisan,
        message: "Google authentication successful"
      };
    } catch (error) {
      console.error("Google OAuth error:", error);
      return {
        success: false,
        message: "Google authentication failed. Please try again."
      };
    }
  }
}

export const artisanAuthService = new ArtisanAuthService();

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
