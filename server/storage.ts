import { supabase } from "./supabase";
import type { User, InsertUser, Artisan, InsertArtisan, SearchRequest, InsertSearchRequest, ArtisanSubscription, InsertArtisanSubscription, Advertisement, InsertAdvertisement } from "@shared/schema";

// Helper function to convert camelCase to snake_case for database
function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;

  const snakeCased: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    snakeCased[snakeKey] = typeof value === 'object' && value !== null && !Array.isArray(value)
      ? toSnakeCase(value)
      : value;
  }
  return snakeCased;
}

// Helper function to convert snake_case to camelCase for application
function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;

  const camelCased: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    camelCased[camelKey] = typeof value === 'object' && value !== null && !Array.isArray(value)
      ? toCamelCase(value)
      : value;
  }
  return camelCased;
}

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
  
  // Featured artisan methods
  toggleArtisanFeatured(id: number): Promise<Artisan | undefined>;
  getFeaturedArtisans(): Promise<Artisan[]>;

  // Advertisement methods
  getAllAdvertisements(): Promise<Advertisement[]>;
  getActiveAdvertisements(): Promise<Advertisement[]>;
  createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement>;
  updateAdvertisement(id: number, updates: Partial<Advertisement>): Promise<Advertisement | undefined>;
  deleteAdvertisement(id: number): Promise<boolean>;
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
    return toCamelCase(data) as User;
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
    return toCamelCase(data) as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const snakeCaseData = toSnakeCase(insertUser);
    
    const { data, error } = await supabase
      .from('users')
      .insert(snakeCaseData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
    return toCamelCase(data) as User;
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
    return toCamelCase(data) as Artisan;
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
    return toCamelCase(data) as Artisan;
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
    return toCamelCase(data) as Artisan;
  }

  async getAllArtisans(): Promise<Artisan[]> {
    // Use RPC function to get artisans with is_featured field (schema cache workaround)
    const { data, error } = await supabase.rpc('get_all_artisans_with_featured');
    
    if (error) {
      console.error('Error fetching all artisans via RPC:', error);
      // Fallback to direct query if RPC fails
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('artisans')
        .select('*');
      
      if (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        return [];
      }
      
      return (fallbackData || []).map(item => toCamelCase(item)) as Artisan[];
    }
    
    return (data || []).map(item => toCamelCase(item)) as Artisan[];
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
    return (data || []).map(item => toCamelCase(item)) as Artisan[];
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
    return (data || []).map(item => toCamelCase(item)) as Artisan[];
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

    // Convert all results to camelCase
    let results = (data || []).map(item => toCamelCase(item)) as Artisan[];

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
    // Convert camelCase to snake_case for database
    const snakeCaseData = toSnakeCase(insertArtisan);
    
    const { data, error } = await supabase
      .from('artisans')
      .insert(snakeCaseData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating artisan:', error);
      throw new Error('Failed to create artisan');
    }
    
    // Convert snake_case back to camelCase for application
    return toCamelCase(data) as Artisan;
  }

  async updateArtisan(id: number, updates: Partial<Artisan>): Promise<Artisan | undefined> {
    // Convert camelCase to snake_case for database
    const snakeCaseUpdates = toSnakeCase(updates);
    
    // Use RPC/SQL directly for is_featured updates to bypass schema cache issues
    if ('is_featured' in snakeCaseUpdates) {
      const { data, error } = await supabase.rpc('update_artisan_featured', {
        artisan_id: id,
        featured_status: snakeCaseUpdates.is_featured
      });
      
      if (error) {
        console.error('Error updating artisan featured status via RPC:', error);
        // Fallback to direct update
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('artisans')
          .update(snakeCaseUpdates)
          .eq('id', id)
          .select()
          .single();
        
        if (fallbackError) {
          console.error('Fallback update also failed:', fallbackError);
          return undefined;
        }
        
        return toCamelCase(fallbackData) as Artisan;
      }
      
      // After RPC update, fetch the updated artisan
      const { data: updatedArtisan, error: fetchError } = await supabase
        .from('artisans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching updated artisan:', fetchError);
        return undefined;
      }
      
      return toCamelCase(updatedArtisan) as Artisan;
    }
    
    const { data, error } = await supabase
      .from('artisans')
      .update(snakeCaseUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating artisan:', error);
      return undefined;
    }
    
    // Convert snake_case back to camelCase for application
    return toCamelCase(data) as Artisan;
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
    return (data || []).map(item => toCamelCase(item)) as Artisan[];
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
    return toCamelCase(data) as Artisan;
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
    return toCamelCase(data) as Artisan;
  }

  // Search request methods
  async createSearchRequest(insertRequest: InsertSearchRequest): Promise<SearchRequest> {
    const requestData = toSnakeCase({
      ...insertRequest,
      timestamp: new Date().toISOString(),
      tier: insertRequest.tier || "basic"
    });
    
    const { data, error } = await supabase
      .from('search_requests')
      .insert(requestData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating search request:', error);
      throw new Error('Failed to create search request');
    }
    return toCamelCase(data) as SearchRequest;
  }

  async getSearchRequests(): Promise<SearchRequest[]> {
    const { data, error } = await supabase
      .from('search_requests')
      .select('*');
    
    if (error) {
      console.error('Error fetching search requests:', error);
      return [];
    }
    return (data || []).map(item => toCamelCase(item)) as SearchRequest[];
  }

  // Artisan subscription methods
  async createArtisanSubscription(insertSubscription: InsertArtisanSubscription): Promise<ArtisanSubscription> {
    const snakeCaseData = toSnakeCase(insertSubscription);
    
    const { data, error } = await supabase
      .from('artisan_subscriptions')
      .insert(snakeCaseData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating artisan subscription:', error);
      throw new Error('Failed to create artisan subscription');
    }
    return toCamelCase(data) as ArtisanSubscription;
  }

  async getArtisanSubscriptions(): Promise<ArtisanSubscription[]> {
    const { data, error } = await supabase
      .from('artisan_subscriptions')
      .select('*');
    
    if (error) {
      console.error('Error fetching artisan subscriptions:', error);
      return [];
    }
    return (data || []).map(item => toCamelCase(item)) as ArtisanSubscription[];
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
    return (data || []).map(item => toCamelCase(item)) as ArtisanSubscription[];
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
    return toCamelCase(data) as ArtisanSubscription;
  }

  async toggleArtisanFeatured(id: number): Promise<Artisan | undefined> {
    try {
      // First, get current featured status from the view
      const { data: currentData, error: fetchError } = await supabase
        .from('artisans_with_featured')
        .select('is_featured')
        .eq('id', id)
        .single();
      
      if (fetchError || !currentData) {
        console.error('Artisan not found for toggling:', fetchError);
        return undefined;
      }
      
      const currentFeaturedStatus = currentData.is_featured ?? false;
      const newFeaturedStatus = !currentFeaturedStatus;
      
      console.log(`Toggling artisan ${id} featured from ${currentFeaturedStatus} to ${newFeaturedStatus}`);
      
      // Update via the view (which should be updatable)
      const { data, error } = await supabase
        .from('artisans_with_featured')
        .update({ is_featured: newFeaturedStatus })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error toggling featured status:', error);
        return undefined;
      }
      
      const result = toCamelCase(data) as Artisan;
      console.log(`Successfully toggled featured status for artisan ${id} to ${result.isFeatured}`);
      return result;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      return undefined;
    }
  }

  async getFeaturedArtisans(): Promise<Artisan[]> {
    const { data, error } = await supabase
      .from('artisans_with_featured')
      .select('*')
      .eq('is_featured', true)
      .eq('approval_status', 'approved');
    
    if (error) {
      console.error('Error fetching featured artisans:', error);
      return [];
    }
    
    return (data || []).map(item => toCamelCase(item)) as Artisan[];
  }

  // Advertisement methods
  async getAllAdvertisements(): Promise<Advertisement[]> {
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching advertisements:', error);
      return [];
    }
    return (data || []).map(item => toCamelCase(item)) as Advertisement[];
  }

  async getActiveAdvertisements(): Promise<Advertisement[]> {
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching active advertisements:', error);
      return [];
    }
    return (data || []).map(item => toCamelCase(item)) as Advertisement[];
  }

  async createAdvertisement(insertAd: InsertAdvertisement): Promise<Advertisement> {
    const snakeCaseData = toSnakeCase(insertAd);
    const { data, error } = await supabase
      .from('advertisements')
      .insert(snakeCaseData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating advertisement:', error);
      throw new Error('Failed to create advertisement');
    }
    return toCamelCase(data) as Advertisement;
  }

  async updateAdvertisement(id: number, updates: Partial<Advertisement>): Promise<Advertisement | undefined> {
    const snakeCaseData = toSnakeCase(updates);
    const { data, error } = await supabase
      .from('advertisements')
      .update(snakeCaseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating advertisement:', error);
      return undefined;
    }
    return toCamelCase(data) as Advertisement;
  }

  async deleteAdvertisement(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting advertisement:', error);
      return false;
    }
    return true;
  }
}

export const storage = new SupabaseStorage();
