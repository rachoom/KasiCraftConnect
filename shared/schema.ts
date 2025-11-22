import { z } from "zod";

// User types
export interface User {
  id: number;
  username: string;
  password: string;
}

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Admin User types
export interface AdminUser {
  id: number;
  email: string;
  password: string | null;
  googleId: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  isVerified: boolean;
  verificationToken: string | null;
  verificationExpires: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export const insertAdminUserSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  googleId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImage: z.string().optional(),
  isVerified: z.boolean().optional(),
  verificationToken: z.string().optional(),
  verificationExpires: z.string().optional(),
  lastLogin: z.string().optional(),
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

// Artisan types
export interface Artisan {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  googleId: string | null;
  phone: string;
  location: string;
  services: string[];
  description: string;
  yearsExperience: number;
  rating: string;
  reviewCount: number;
  verified: boolean;
  subscriptionTier: string;
  isFeatured: boolean;
  profileImage: string | null;
  portfolio: string[];
  profileComplete: boolean;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: string | null;
  lastLogin: string | null;
  idDocument: string | null;
  qualificationDocuments: string[];
  verificationStatus: string;
  verificationNotes: string | null;
  verifiedAt: string | null;
  approvalStatus: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export const insertArtisanSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().nullable().optional(),
  googleId: z.string().nullable().optional(),
  phone: z.string(),
  location: z.string(),
  services: z.array(z.string()),
  description: z.string(),
  yearsExperience: z.number(),
  subscriptionTier: z.string().optional(),
  profileImage: z.string().nullable().optional(),
  portfolio: z.array(z.string()).optional(),
  idDocument: z.string().nullable().optional(),
  qualificationDocuments: z.array(z.string()).optional(),
  approvalStatus: z.string().optional(),
});

export type InsertArtisan = z.infer<typeof insertArtisanSchema>;

// Search Request types
export interface SearchRequest {
  id: number;
  service: string;
  location: string;
  tier: string;
  timestamp: string;
}

export const insertSearchRequestSchema = z.object({
  service: z.string(),
  location: z.string(),
  tier: z.string().optional(),
});

export type InsertSearchRequest = z.infer<typeof insertSearchRequestSchema>;

// Artisan Subscription types
export interface ArtisanSubscription {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: string[];
  location: string;
  description: string;
  yearsExperience: number;
  companyRegNumber: string | null;
  artisanRegNumber: string | null;
  subscriptionTier: string;
  documents: string[];
  applicationStatus: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export const insertArtisanSubscriptionSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  services: z.array(z.string()),
  location: z.string(),
  description: z.string(),
  yearsExperience: z.number(),
  companyRegNumber: z.string().optional(),
  artisanRegNumber: z.string().optional(),
  subscriptionTier: z.string(),
  documents: z.array(z.string()).optional(),
});

export type InsertArtisanSubscription = z.infer<typeof insertArtisanSubscriptionSchema>;

// Advertisement types
export interface Advertisement {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  linkUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const insertAdvertisementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().nullable().optional(),
  linkUrl: z.string().nullable().optional(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export type InsertAdvertisement = z.infer<typeof insertAdvertisementSchema>;
