-- Skills Connect Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create all required tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Artisans table
CREATE TABLE IF NOT EXISTS artisans (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  years_experience INTEGER NOT NULL DEFAULT 0,
  rating VARCHAR(10) DEFAULT '0',
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(50) DEFAULT 'unverified',
  approval_status VARCHAR(50) DEFAULT 'pending',
  verification_status VARCHAR(50) DEFAULT 'pending',
  profile_image VARCHAR(500),
  portfolio TEXT[] DEFAULT '{}',
  password VARCHAR(255),
  google_id VARCHAR(255),
  id_document VARCHAR(500),
  qualification_documents TEXT[] DEFAULT '{}',
  company_registration VARCHAR(255),
  admin_notes TEXT,
  approved_by VARCHAR(255),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  is_email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP,
  last_login TIMESTAMP,
  profile_complete BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  google_id VARCHAR(255),
  profile_image VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_expires TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Search requests table
CREATE TABLE IF NOT EXISTS search_requests (
  id SERIAL PRIMARY KEY,
  service VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  tier VARCHAR(50) DEFAULT 'basic',
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Artisan subscriptions table
CREATE TABLE IF NOT EXISTS artisan_subscriptions (
  id SERIAL PRIMARY KEY,
  artisan_id INTEGER REFERENCES artisans(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  years_experience INTEGER NOT NULL DEFAULT 0,
  subscription_tier VARCHAR(50) NOT NULL,
  id_document VARCHAR(500),
  qualification_documents TEXT[] DEFAULT '{}',
  company_registration VARCHAR(255),
  application_status VARCHAR(50) DEFAULT 'pending',
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artisans_email ON artisans(email);
CREATE INDEX IF NOT EXISTS idx_artisans_phone ON artisans(phone);
CREATE INDEX IF NOT EXISTS idx_artisans_location ON artisans(location);
CREATE INDEX IF NOT EXISTS idx_artisans_services ON artisans USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_artisans_approval_status ON artisans(approval_status);
CREATE INDEX IF NOT EXISTS idx_artisans_subscription_tier ON artisans(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_search_requests_service ON search_requests(service);
CREATE INDEX IF NOT EXISTS idx_search_requests_location ON search_requests(location);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can customize these later)
CREATE POLICY "Enable read access for all users" ON artisans FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON artisans FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON artisans FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON search_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON search_requests FOR INSERT WITH CHECK (true);

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE 'Skills Connect database schema created successfully!';
END $$;
