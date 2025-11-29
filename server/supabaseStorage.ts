import { supabase } from './supabase';

const PROFILE_PICTURES_BUCKET = 'profile-pictures';

/**
 * Initialize Supabase Storage bucket for profile pictures
 * Tests bucket access by trying to list files
 */
export async function initializeStorageBucket() {
  try {
    // Test if we can access the bucket by listing files
    const { error } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .list('', { limit: 1 });

    if (error) {
      console.warn(`⚠️  Supabase Storage bucket '${PROFILE_PICTURES_BUCKET}' not accessible.`);
      console.warn(`   Error: ${error.message}`);
      console.warn(`   Please verify:`);
      console.warn(`   1. Bucket exists in Supabase Dashboard → Storage`);
      console.warn(`   2. Bucket is set to Public`);
      console.warn(`   3. RLS policies allow public access (INSERT, UPDATE, DELETE)`);
    } else {
      console.log(`✅ Supabase Storage bucket '${PROFILE_PICTURES_BUCKET}' is ready and accessible`);
    }
  } catch (error: any) {
    console.error('Warning: Could not verify Supabase Storage bucket:', error?.message);
    console.warn('Profile picture uploads may not work. Please verify your Supabase configuration.');
  }
}

/**
 * Upload a profile picture to Supabase Storage
 * @param artisanId - The artisan's ID
 * @param file - The file buffer
 * @param contentType - The file's MIME type
 * @returns The public URL of the uploaded image
 */
export async function uploadProfilePicture(
  artisanId: number,
  file: Buffer,
  contentType: string
): Promise<string> {
  try {
    // Generate unique filename
    const fileExtension = contentType.split('/')[1];
    const fileName = `artisan-${artisanId}-${Date.now()}.${fileExtension}`;
    const filePath = `profiles/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .upload(filePath, file, {
        contentType,
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading to Supabase Storage:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .getPublicUrl(filePath);

    console.log(`✅ Uploaded profile picture for artisan ${artisanId}: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    throw error;
  }
}

/**
 * Delete a profile picture from Supabase Storage
 * @param publicUrl - The public URL of the image to delete
 */
export async function deleteProfilePicture(publicUrl: string): Promise<void> {
  try {
    // Extract the file path from the public URL
    const urlParts = publicUrl.split(`/object/public/${PROFILE_PICTURES_BUCKET}/`);
    if (urlParts.length < 2) {
      console.warn('Invalid public URL format, cannot extract file path');
      return;
    }

    const filePath = urlParts[1];

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting from Supabase Storage:', error);
      throw error;
    }

    console.log(`✅ Deleted profile picture: ${filePath}`);
  } catch (error) {
    console.error('Error in deleteProfilePicture:', error);
    // Don't throw - deletion is non-critical
  }
}

/**
 * Upload a portfolio image to Supabase Storage
 * @param artisanId - The artisan's ID
 * @param file - The file buffer
 * @param contentType - The file's MIME type
 * @returns The public URL of the uploaded image
 */
export async function uploadPortfolioImage(
  artisanId: number,
  file: Buffer,
  contentType: string
): Promise<string> {
  try {
    // Generate unique filename
    const fileExtension = contentType.split('/')[1];
    const fileName = `artisan-${artisanId}-portfolio-${Date.now()}.${fileExtension}`;
    const filePath = `portfolio/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .upload(filePath, file, {
        contentType,
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading portfolio image to Supabase Storage:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .getPublicUrl(filePath);

    console.log(`✅ Uploaded portfolio image for artisan ${artisanId}: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadPortfolioImage:', error);
    throw error;
  }
}

/**
 * Delete a portfolio image from Supabase Storage
 * @param publicUrl - The public URL of the image to delete
 */
export async function deletePortfolioImage(publicUrl: string): Promise<void> {
  try {
    // Extract the file path from the public URL
    const urlParts = publicUrl.split(`/object/public/${PROFILE_PICTURES_BUCKET}/`);
    if (urlParts.length < 2) {
      console.warn('Invalid public URL format, cannot extract file path');
      return;
    }

    const filePath = urlParts[1];

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting portfolio image from Supabase Storage:', error);
      throw error;
    }

    console.log(`✅ Deleted portfolio image: ${filePath}`);
  } catch (error) {
    console.error('Error in deletePortfolioImage:', error);
    // Don't throw - deletion is non-critical
  }
}
