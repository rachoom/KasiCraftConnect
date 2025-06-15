import { users, artisans, searchRequests, type User, type InsertUser, type Artisan, type InsertArtisan, type SearchRequest, type InsertSearchRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Artisan methods
  getArtisan(id: number): Promise<Artisan | undefined>;
  getAllArtisans(): Promise<Artisan[]>;
  getArtisansByService(service: string): Promise<Artisan[]>;
  getArtisansByLocation(location: string): Promise<Artisan[]>;
  searchArtisans(service: string, location: string, limit?: number, tier?: string): Promise<Artisan[]>;
  createArtisan(artisan: InsertArtisan): Promise<Artisan>;
  updateArtisan(id: number, updates: Partial<Artisan>): Promise<Artisan | undefined>;
  
  // Admin methods
  getPendingArtisans(): Promise<Artisan[]>;
  approveArtisan(id: number, approvedBy: string): Promise<Artisan | undefined>;
  rejectArtisan(id: number, rejectionReason: string, rejectedBy: string): Promise<Artisan | undefined>;

  // Search request methods
  createSearchRequest(request: InsertSearchRequest): Promise<SearchRequest>;
  getSearchRequests(): Promise<SearchRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private artisans: Map<number, Artisan>;
  private searchRequests: Map<number, SearchRequest>;
  private currentUserId: number;
  private currentArtisanId: number;
  private currentSearchId: number;

  constructor() {
    this.users = new Map();
    this.artisans = new Map();
    this.searchRequests = new Map();
    this.currentUserId = 1;
    this.currentArtisanId = 1;
    this.currentSearchId = 1;

    // Seed with sample artisans
    this.seedArtisans();
  }

  private seedArtisans() {
    const sampleArtisans: InsertArtisan[] = [
      {
        firstName: "Thabo",
        lastName: "Mthembu",
        email: "thabo.mthembu@email.com",
        phone: "+27 82 123 4567",
        location: "Johannesburg, Gauteng",
        services: ["builders"],
        description: "15+ years of experience in residential and commercial construction. Specialized in home renovations and extensions.",
        yearsExperience: 15,
        profileImage: "TM",
        portfolio: []
      },
      {
        firstName: "Sarah",
        lastName: "Khumalo",
        email: "sarah.khumalo@email.com",
        phone: "+27 84 567 8901",
        location: "Cape Town, Western Cape",
        services: ["electricians"],
        description: "Certified electrician with expertise in smart home installations, electrical repairs, and energy-efficient solutions.",
        yearsExperience: 8,
        profileImage: "SK",
        portfolio: []
      },
      {
        firstName: "Mike",
        lastName: "Naidoo",
        email: "mike.naidoo@email.com",
        phone: "+27 83 234 5678",
        location: "Durban, KwaZulu-Natal",
        services: ["plumbers"],
        description: "Professional plumber specializing in bathroom renovations, leak repairs, and hot water system installations.",
        yearsExperience: 12,
        profileImage: "MN",
        portfolio: []
      },
      {
        firstName: "Nomsa",
        lastName: "Dlamini",
        email: "nomsa.dlamini@email.com",
        phone: "+27 81 345 6789",
        location: "Pretoria, Gauteng",
        services: ["cleaners"],
        description: "Professional cleaning service with eco-friendly products. Specializing in deep cleaning and maintenance.",
        yearsExperience: 6,
        profileImage: "ND",
        portfolio: []
      },
      {
        firstName: "David",
        lastName: "Van Der Merwe",
        email: "david.vandermerwe@email.com",
        phone: "+27 85 456 7890",
        location: "Stellenbosch, Western Cape",
        services: ["carpenters"],
        description: "Custom furniture maker and carpenter with expertise in kitchen cabinets and built-in storage solutions.",
        yearsExperience: 20,
        profileImage: "DV",
        portfolio: []
      },
      {
        firstName: "Zanele",
        lastName: "Mbeki",
        email: "zanele.mbeki@email.com",
        phone: "+27 86 567 8901",
        location: "Port Elizabeth, Eastern Cape",
        services: ["landscapers"],
        description: "Landscape designer creating beautiful outdoor spaces with indigenous plants and sustainable design principles.",
        yearsExperience: 10,
        profileImage: "ZM",
        portfolio: []
      },
      {
        firstName: "Ahmed",
        lastName: "Hassan",
        email: "ahmed.hassan@email.com",
        phone: "+27 87 678 9012",
        location: "Johannesburg, Gauteng",
        services: ["tilers"],
        description: "Specialist in ceramic, porcelain, and natural stone tiling for bathrooms, kitchens, and commercial spaces.",
        yearsExperience: 14,
        profileImage: "AH",
        portfolio: []
      }
    ];

    sampleArtisans.forEach((artisan, index) => {
      const id = this.currentArtisanId++;
      // First 4 artisans are verified (for premium/enterprise tiers), rest are unverified (basic tier)
      const isVerified = index < 4;
      const artisanWithRating: Artisan = {
        ...artisan,
        id,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 30) + 10,
        verified: isVerified,
        profileImage: artisan.profileImage || null,
        portfolio: artisan.portfolio || [],
        idDocument: null,
        qualificationDocuments: [],
        verificationStatus: isVerified ? "approved" : "pending",
        verificationNotes: null,
        verifiedAt: isVerified ? new Date().toISOString() : null,
        approvalStatus: isVerified ? "approved" : "pending",
        approvedBy: isVerified ? "System Admin" : null,
        approvedAt: isVerified ? new Date().toISOString() : null,
        rejectionReason: null
      };
      this.artisans.set(id, artisanWithRating);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Artisan methods
  async getArtisan(id: number): Promise<Artisan | undefined> {
    return this.artisans.get(id);
  }

  async getAllArtisans(): Promise<Artisan[]> {
    return Array.from(this.artisans.values());
  }

  async getArtisansByService(service: string): Promise<Artisan[]> {
    return Array.from(this.artisans.values()).filter(artisan => 
      artisan.services.includes(service.toLowerCase())
    );
  }

  async getArtisansByLocation(location: string): Promise<Artisan[]> {
    return Array.from(this.artisans.values()).filter(artisan => 
      artisan.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  async searchArtisans(service: string, location: string, limit: number = 3, tier: string = "basic"): Promise<Artisan[]> {
    let results = Array.from(this.artisans.values());

    // All tiers get verified artisans for better user experience
    results = results.filter(artisan => artisan.verified);

    // Filter by service if provided
    if (service && service !== "all") {
      results = results.filter(artisan => 
        artisan.services.some(s => s.toLowerCase().includes(service.toLowerCase()))
      );
    }

    // Filter by location if provided
    if (location) {
      const locationTerms = location.toLowerCase().split(/[,\s]+/).filter(Boolean);
      results = results.filter(artisan => 
        locationTerms.some(term => 
          artisan.location.toLowerCase().includes(term) ||
          (term === "joburg" && artisan.location.toLowerCase().includes("johannesburg")) ||
          (term === "jhb" && artisan.location.toLowerCase().includes("johannesburg")) ||
          (term === "pta" && artisan.location.toLowerCase().includes("pretoria")) ||
          (term === "cpt" && artisan.location.toLowerCase().includes("cape town"))
        )
      );
    }

    // Sort by rating and review count
    results.sort((a, b) => {
      const ratingDiff = parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      if (ratingDiff !== 0) return ratingDiff;
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });

    return results.slice(0, limit);
  }

  async createArtisan(insertArtisan: InsertArtisan): Promise<Artisan> {
    const id = this.currentArtisanId++;
    const artisan: Artisan = {
      ...insertArtisan,
      id,
      rating: "0.00",
      reviewCount: 0,
      verified: false,
      profileImage: insertArtisan.profileImage || null,
      portfolio: insertArtisan.portfolio || [],
      idDocument: insertArtisan.idDocument || null,
      qualificationDocuments: insertArtisan.qualificationDocuments || [],
      verificationStatus: "pending",
      verificationNotes: null,
      verifiedAt: null,
      approvalStatus: "pending",
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null
    };
    this.artisans.set(id, artisan);
    return artisan;
  }

  async updateArtisan(id: number, updates: Partial<Artisan>): Promise<Artisan | undefined> {
    const artisan = this.artisans.get(id);
    if (!artisan) return undefined;

    const updatedArtisan = { ...artisan, ...updates };
    this.artisans.set(id, updatedArtisan);
    return updatedArtisan;
  }

  // Search request methods
  async createSearchRequest(insertRequest: InsertSearchRequest): Promise<SearchRequest> {
    const id = this.currentSearchId++;
    const request: SearchRequest = {
      ...insertRequest,
      id,
      timestamp: new Date().toISOString(),
      tier: insertRequest.tier || "basic"
    };
    this.searchRequests.set(id, request);
    return request;
  }

  async getSearchRequests(): Promise<SearchRequest[]> {
    return Array.from(this.searchRequests.values());
  }

  async getPendingArtisans(): Promise<Artisan[]> {
    return Array.from(this.artisans.values()).filter(artisan => artisan.approvalStatus === 'pending');
  }

  async approveArtisan(id: number, approvedBy: string): Promise<Artisan | undefined> {
    const artisan = this.artisans.get(id);
    if (!artisan) return undefined;

    const updatedArtisan: Artisan = {
      ...artisan,
      approvalStatus: 'approved',
      approvedBy,
      approvedAt: new Date().toISOString(),
      verified: true,
      verificationStatus: 'approved'
    };

    this.artisans.set(id, updatedArtisan);
    return updatedArtisan;
  }

  async rejectArtisan(id: number, rejectionReason: string, rejectedBy: string): Promise<Artisan | undefined> {
    const artisan = this.artisans.get(id);
    if (!artisan) return undefined;

    const updatedArtisan: Artisan = {
      ...artisan,
      approvalStatus: 'rejected',
      rejectionReason,
      approvedBy: rejectedBy,
      approvedAt: new Date().toISOString()
    };

    this.artisans.set(id, updatedArtisan);
    return updatedArtisan;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getArtisan(id: number): Promise<Artisan | undefined> {
    const [artisan] = await db.select().from(artisans).where(eq(artisans.id, id));
    return artisan || undefined;
  }

  async getAllArtisans(): Promise<Artisan[]> {
    return await db.select().from(artisans);
  }

  async getArtisansByService(service: string): Promise<Artisan[]> {
    const allArtisans = await db.select().from(artisans);
    return allArtisans.filter(artisan => 
      artisan.services.includes(service.toLowerCase())
    );
  }

  async getArtisansByLocation(location: string): Promise<Artisan[]> {
    const allArtisans = await db.select().from(artisans);
    return allArtisans.filter(artisan => 
      artisan.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  async searchArtisans(service: string, location: string, limit: number = 3, tier: string = "basic"): Promise<Artisan[]> {
    let allArtisans = await db.select().from(artisans);

    // All tiers get verified artisans for better user experience
    allArtisans = allArtisans.filter(artisan => artisan.verified);

    // Filter by service if provided
    if (service && service !== "all") {
      allArtisans = allArtisans.filter(artisan => 
        artisan.services.some(s => s.toLowerCase().includes(service.toLowerCase()))
      );
    }

    // Filter by location if provided
    if (location) {
      const locationTerms = location.toLowerCase().split(/[,\s]+/).filter(Boolean);
      allArtisans = allArtisans.filter(artisan => 
        locationTerms.some(term => 
          artisan.location.toLowerCase().includes(term) ||
          (term === "joburg" && artisan.location.toLowerCase().includes("johannesburg")) ||
          (term === "jhb" && artisan.location.toLowerCase().includes("johannesburg")) ||
          (term === "pta" && artisan.location.toLowerCase().includes("pretoria")) ||
          (term === "cpt" && artisan.location.toLowerCase().includes("cape town"))
        )
      );
    }

    // Sort by rating and review count
    allArtisans.sort((a, b) => {
      const ratingDiff = parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      if (ratingDiff !== 0) return ratingDiff;
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });

    return allArtisans.slice(0, limit);
  }

  async createArtisan(insertArtisan: InsertArtisan): Promise<Artisan> {
    const [artisan] = await db
      .insert(artisans)
      .values(insertArtisan)
      .returning();
    return artisan;
  }

  async updateArtisan(id: number, updates: Partial<Artisan>): Promise<Artisan | undefined> {
    const [artisan] = await db
      .update(artisans)
      .set(updates)
      .where(eq(artisans.id, id))
      .returning();
    return artisan || undefined;
  }

  async createSearchRequest(insertRequest: InsertSearchRequest): Promise<SearchRequest> {
    const requestData = {
      ...insertRequest,
      timestamp: new Date().toISOString(),
      tier: insertRequest.tier || "basic"
    };
    
    const [request] = await db
      .insert(searchRequests)
      .values(requestData)
      .returning();
    return request;
  }

  async getSearchRequests(): Promise<SearchRequest[]> {
    return await db.select().from(searchRequests);
  }

  async getPendingArtisans(): Promise<Artisan[]> {
    const pending = await db.select().from(artisans).where(eq(artisans.approvalStatus, 'pending'));
    return pending;
  }

  async approveArtisan(id: number, approvedBy: string): Promise<Artisan | undefined> {
    const [updatedArtisan] = await db
      .update(artisans)
      .set({
        approvalStatus: 'approved',
        approvedBy,
        approvedAt: new Date().toISOString(),
        verified: true,
        verificationStatus: 'approved'
      })
      .where(eq(artisans.id, id))
      .returning();
    
    return updatedArtisan;
  }

  async rejectArtisan(id: number, rejectionReason: string, rejectedBy: string): Promise<Artisan | undefined> {
    const [updatedArtisan] = await db
      .update(artisans)
      .set({
        approvalStatus: 'rejected',
        rejectionReason,
        approvedBy: rejectedBy,
        approvedAt: new Date().toISOString()
      })
      .where(eq(artisans.id, id))
      .returning();
    
    return updatedArtisan;
  }
}

export const storage = new DatabaseStorage();
