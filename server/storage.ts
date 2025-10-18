import { supabase } from "./supabase";
import type { User, InsertUser, Artisan, InsertArtisan, SearchRequest, InsertSearchRequest, ArtisanSubscription, InsertArtisanSubscription } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Artisan methods
  getArtisan(id: number): Promise<Artisan | undefined>;
  getArtisanByEmail(email: string): Promise<Artisan | undefined>;
  getArtisanByPhone(phone: string): Promise<Artisan | undefined>;
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

  // Artisan subscription methods
  createArtisanSubscription(insertSubscription: InsertArtisanSubscription): Promise<ArtisanSubscription>;
  getArtisanSubscriptions(): Promise<ArtisanSubscription[]>;
  getPendingSubscriptions(): Promise<ArtisanSubscription[]>;
  updateSubscriptionStatus(id: number, status: "approved" | "rejected", reviewedBy: string, rejectionReason?: string): Promise<ArtisanSubscription | undefined>;
}

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      console.error('Error fetching user by username:', error);
      return undefined;
    }
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
    return data as User;
  }

  // Artisan methods
  async getArtisan(id: number): Promise<Artisan | undefined> {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      console.error('Error fetching artisan:', error);
      return undefined;
    }
    return data as Artisan;
  }

  async getArtisanByEmail(email: string): Promise<Artisan | undefined> {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      console.error('Error fetching artisan by email:', error);
      return undefined;
    }
    return data as Artisan;
  }

  async getArtisanByPhone(phone: string): Promise<Artisan | undefined> {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      console.error('Error fetching artisan by phone:', error);
      return undefined;
    }
    return data as Artisan;
  }

  async getAllArtisans(): Promise<Artisan[]> {
    const { data, error } = await supabase
      .from('artisans')
      .select('*');
    
    if (error) {
      console.error('Error fetching all artisans:', error);
      return [];
    }
    return data as Artisan[];
  }

  async getArtisansByService(service: string): Promise<Artisan[]> {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .contains('services', [service.toLowerCase()]);
    
    if (error) {
      console.error('Error fetching artisans by service:', error);
      return [];
    }
    return data as Artisan[];
  }

  async getArtisansByLocation(location: string): Promise<Artisan[]> {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .ilike('location', `%${location}%`);
    
    if (error) {
      console.error('Error fetching artisans by location:', error);
      return [];
    }
    return data as Artisan[];
  }

  async searchArtisans(service: string, location: string, limit: number = 3, tier: string = "basic"): Promise<Artisan[]> {
    let query = supabase
      .from('artisans')
      .select('*')
      .eq('approval_status', 'approved');

    // Filter by service if provided
    if (service && service !== "all") {
      query = query.contains('services', [service.toLowerCase()]);
    }

    // Filter by location if provided
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error searching artisans:', error);
      return [];
    }

    let results = data as Artisan[];

    // Sort by subscription tier first (premium > verified > unverified), then by rating
    results.sort((a, b) => {
      const tierPriority: Record<string, number> = {
        'premium': 3,
        'verified': 2,
        'unverified': 1
      };
      
      const aTierPriority = tierPriority[a.subscriptionTier || 'unverified'] || 1;
      const bTierPriority = tierPriority[b.subscriptionTier || 'unverified'] || 1;
      
      if (aTierPriority !== bTierPriority) {
        return bTierPriority - aTierPriority;
      }
      
      const ratingDiff = parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      if (ratingDiff !== 0) return ratingDiff;
      
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });

    return results.slice(0, limit);
  }

  async createArtisan(insertArtisan: InsertArtisan): Promise<Artisan> {
    const { data, error } = await supabase
      .from('artisans')
      .insert(insertArtisan)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating artisan:', error);
      throw new Error('Failed to create artisan');
    }
    return data as Artisan;
  }

  async updateArtisan(id: number, updates: Partial<Artisan>): Promise<Artisan | undefined> {
    const { data, error } = await supabase
      .from('artisans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating artisan:', error);
      return undefined;
    }
    return data as Artisan;
  }

  // Admin methods
  async getPendingArtisans(): Promise<Artisan[]> {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .eq('approval_status', 'pending');
    
    if (error) {
      console.error('Error fetching pending artisans:', error);
      return [];
    }
    return data as Artisan[];
  }

  async approveArtisan(id: number, approvedBy: string): Promise<Artisan | undefined> {
    const { data, error } = await supabase
      .from('artisans')
      .update({
        approval_status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
        verified: true,
        verification_status: 'approved'
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error approving artisan:', error);
      return undefined;
    }
    return data as Artisan;
  }

  async rejectArtisan(id: number, rejectionReason: string, rejectedBy: string): Promise<Artisan | undefined> {
    const { data, error} = await supabase
      .from('artisans')
      .update({
        approval_status: 'rejected',
        rejection_reason: rejectionReason,
        approved_by: rejectedBy,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error rejecting artisan:', error);
      return undefined;
    }
    return data as Artisan;
  }

  // Search request methods
  async createSearchRequest(insertRequest: InsertSearchRequest): Promise<SearchRequest> {
    const requestData = {
      ...insertRequest,
      timestamp: new Date().toISOString(),
      tier: insertRequest.tier || "basic"
    };
    
    const { data, error } = await supabase
      .from('search_requests')
      .insert(requestData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating search request:', error);
      throw new Error('Failed to create search request');
    }
    return data as SearchRequest;
  }

  async getSearchRequests(): Promise<SearchRequest[]> {
    const { data, error } = await supabase
      .from('search_requests')
      .select('*');
    
    if (error) {
      console.error('Error fetching search requests:', error);
      return [];
    }
    return data as SearchRequest[];
  }

  // Artisan subscription methods
  async createArtisanSubscription(insertSubscription: InsertArtisanSubscription): Promise<ArtisanSubscription> {
    const { data, error } = await supabase
      .from('artisan_subscriptions')
      .insert(insertSubscription)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating artisan subscription:', error);
      throw new Error('Failed to create artisan subscription');
    }
    return data as ArtisanSubscription;
  }

  async getArtisanSubscriptions(): Promise<ArtisanSubscription[]> {
    const { data, error } = await supabase
      .from('artisan_subscriptions')
      .select('*');
    
    if (error) {
      console.error('Error fetching artisan subscriptions:', error);
      return [];
    }
    return data as ArtisanSubscription[];
  }

  async getPendingSubscriptions(): Promise<ArtisanSubscription[]> {
    const { data, error } = await supabase
      .from('artisan_subscriptions')
      .select('*')
      .eq('application_status', 'pending');
    
    if (error) {
      console.error('Error fetching pending subscriptions:', error);
      return [];
    }
    return data as ArtisanSubscription[];
  }

  async updateSubscriptionStatus(
    id: number, 
    status: "approved" | "rejected", 
    reviewedBy: string, 
    rejectionReason?: string
  ): Promise<ArtisanSubscription | undefined> {
    const { data, error } = await supabase
      .from('artisan_subscriptions')
      .update({
        application_status: status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
        rejection_reason: rejectionReason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating subscription status:', error);
      return undefined;
    }
    return data as ArtisanSubscription;
  }
}

export const storage = new SupabaseStorage();
