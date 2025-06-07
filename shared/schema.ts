import { pgTable, text, serial, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
});

export const searchRequests = pgTable("search_requests", {
  id: serial("id").primaryKey(),
  service: text("service").notNull(),
  location: text("location").notNull(),
  tier: text("tier").notNull().default("basic"), // basic, premium, enterprise
  timestamp: text("timestamp").notNull(),
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
});

export const insertSearchRequestSchema = createInsertSchema(searchRequests).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertArtisan = z.infer<typeof insertArtisanSchema>;
export type Artisan = typeof artisans.$inferSelect;
export type InsertSearchRequest = z.infer<typeof insertSearchRequestSchema>;
export type SearchRequest = typeof searchRequests.$inferSelect;
