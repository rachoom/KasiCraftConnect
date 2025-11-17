-- Add is_featured column to artisans table
ALTER TABLE artisans 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_artisans_is_featured 
ON artisans(is_featured) 
WHERE is_featured = TRUE;
