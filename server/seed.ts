import { db } from "./db";
import { artisans } from "@shared/schema";

const sampleArtisans = [
  {
    firstName: "Thabo",
    lastName: "Mthembu",
    email: "thabo.mthembu@email.com",
    phone: "+27 82 123 4567",
    location: "Johannesburg, Gauteng",
    services: ["builders"],
    description: "15+ years of experience in residential and commercial construction. Specialized in home renovations and extensions.",
    yearsExperience: 15,
    rating: "4.8",
    reviewCount: 32,
    verified: true,
    profileImage: "TM",
    portfolio: [],
    idDocument: "verified_id_001.pdf",
    qualificationDocuments: ["nhbrc_certificate.pdf", "construction_diploma.pdf"],
    verificationStatus: "approved",
    verificationNotes: "All documents verified successfully",
    verifiedAt: new Date().toISOString()
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
    rating: "4.9",
    reviewCount: 28,
    verified: true,
    profileImage: "SK",
    portfolio: [],
    idDocument: "verified_id_002.pdf",
    qualificationDocuments: ["electrical_trade_cert.pdf", "coc_certificate.pdf"],
    verificationStatus: "approved",
    verificationNotes: "Electrical trade certificate verified",
    verifiedAt: new Date().toISOString()
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
    rating: "4.7",
    reviewCount: 41,
    verified: true,
    profileImage: "MN",
    portfolio: [],
    idDocument: "verified_id_003.pdf",
    qualificationDocuments: ["plumbing_certificate.pdf", "iopsa_membership.pdf"],
    verificationStatus: "approved",
    verificationNotes: "IOPSA membership confirmed",
    verifiedAt: new Date().toISOString()
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
    rating: "4.6",
    reviewCount: 23,
    verified: true,
    profileImage: "ND",
    portfolio: [],
    idDocument: "verified_id_004.pdf",
    qualificationDocuments: ["cleaning_certification.pdf"],
    verificationStatus: "approved",
    verificationNotes: "Professional cleaning certification verified",
    verifiedAt: new Date().toISOString()
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
    rating: "3.8",
    reviewCount: 15,
    verified: false,
    profileImage: "DV",
    portfolio: [],
    idDocument: null,
    qualificationDocuments: [],
    verificationStatus: "pending",
    verificationNotes: null,
    verifiedAt: null
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
    rating: "4.1",
    reviewCount: 19,
    verified: false,
    profileImage: "ZM",
    portfolio: [],
    idDocument: null,
    qualificationDocuments: [],
    verificationStatus: "pending",
    verificationNotes: null,
    verifiedAt: null
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
    rating: "3.9",
    reviewCount: 22,
    verified: false,
    profileImage: "AH",
    portfolio: [],
    idDocument: null,
    qualificationDocuments: [],
    verificationStatus: "pending",
    verificationNotes: null,
    verifiedAt: null
  }
];

export async function seedDatabase() {
  try {
    console.log("Seeding database...");
    
    // Check if artisans already exist
    const existingArtisans = await db.select().from(artisans);
    
    if (existingArtisans.length === 0) {
      await db.insert(artisans).values(sampleArtisans);
      console.log(`Seeded ${sampleArtisans.length} artisans`);
    } else {
      console.log(`Database already has ${existingArtisans.length} artisans, skipping seed`);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}