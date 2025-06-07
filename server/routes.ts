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
        limit
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

  const httpServer = createServer(app);
  return httpServer;
}
