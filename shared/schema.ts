import { pgTable, text, serial, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password"),
  googleId: text("google_id").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"),
  isVerified: boolean("is_verified").default(false),
  verificationToken: text("verification_token"),
  verificationExpires: text("verification_expires"),
  lastLogin: text("last_login"),
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

export const artisans = pgTable("artisans", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  services: text("services").array().notNull(),
  description: text("description").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  verified: boolean("verified").default(false),
  profileImage: text("profile_image"),
  portfolio: text("portfolio").array().default([]),
  // Verification documents
  idDocument: text("id_document"), // Path to uploaded ID document
  qualificationDocuments: text("qualification_documents").array().default([]), // Paths to qualification certificates
  verificationStatus: text("verification_status").default("pending"), // pending, approved, rejected
  verificationNotes: text("verification_notes"), // Admin notes about verification
  verifiedAt: text("verified_at"), // When verification was completed
  approvalStatus: text("approval_status").default("pending"), // pending, approved, rejected
  approvedBy: text("approved_by"), // Admin who approved/rejected
  approvedAt: text("approved_at"), // When approval decision was made
  rejectionReason: text("rejection_reason") // Reason for rejection
});

export const searchRequests = pgTable("search_requests", {
  id: serial("id").primaryKey(),
  service: text("service").notNull(),
  location: text("location").notNull(),
  tier: text("tier").notNull().default("basic"), // basic, premium, enterprise
  timestamp: text("timestamp").notNull(),
});

export const artisanSubscriptions = pgTable("artisan_subscriptions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  services: text("services").array().notNull(), // Array of services offered
  location: text("location").notNull(),
  description: text("description").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  companyRegNumber: text("company_reg_number"),
  artisanRegNumber: text("artisan_reg_number"),
  subscriptionTier: text("subscription_tier").notNull(), // premium, enterprise
  documents: text("documents").array().default([]), // Array of document URLs
  applicationStatus: text("application_status").default("pending"), // pending, approved, rejected
  reviewedBy: text("reviewed_by"), // Admin who reviewed
  reviewedAt: text("reviewed_at"), // When reviewed
  rejectionReason: text("rejection_reason"), // If rejected
  createdAt: text("created_at").default(new Date().toISOString()),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArtisanSchema = createInsertSchema(artisans).omit({
  id: true,
  rating: true,
  reviewCount: true,
  verified: true,
  verificationStatus: true,
  verificationNotes: true,
  verifiedAt: true,
});

export const insertSearchRequestSchema = createInsertSchema(searchRequests).omit({
  id: true,
  timestamp: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertArtisanSubscriptionSchema = createInsertSchema(artisanSubscriptions).omit({
  id: true,
  applicationStatus: true,
  reviewedBy: true,
  reviewedAt: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertArtisan = z.infer<typeof insertArtisanSchema>;
export type Artisan = typeof artisans.$inferSelect;
export type InsertSearchRequest = z.infer<typeof insertSearchRequestSchema>;
export type SearchRequest = typeof searchRequests.$inferSelect;
export type InsertArtisanSubscription = z.infer<typeof insertArtisanSubscriptionSchema>;
export type ArtisanSubscription = typeof artisanSubscriptions.$inferSelect;
