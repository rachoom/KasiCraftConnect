import { supabase } from './supabase';

const PROFILE_PICTURES_BUCKET = 'profile-pictures';

/**
 * Initialize Supabase Storage bucket for profile pictures
 * Creates the bucket if it doesn't exist
 */
export async function initializeStorageBucket() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === PROFILE_PICTURES_BUCKET);

    if (!bucketExists) {
      // Create the bucket as public
      const { error } = await supabase.storage.createBucket(PROFILE_PICTURES_BUCKET, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
      });

      if (error) {
        console.error('Error creating storage bucket:', error);
        throw error;
      }

      console.log(`✅ Created Supabase Storage bucket: ${PROFILE_PICTURES_BUCKET}`);
    } else {
      console.log(`✅ Supabase Storage bucket already exists: ${PROFILE_PICTURES_BUCKET}`);
    }
  } catch (error) {
    console.error('Error initializing storage bucket:', error);
    throw error;
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
