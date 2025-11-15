import { supabase } from './supabase';

const PROFILE_PICTURES_BUCKET = 'profile-pictures';

/**
 * Initialize Supabase Storage bucket for profile pictures
 * Checks if bucket exists - creation requires manual setup or service role key
 */
export async function initializeStorageBucket() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === PROFILE_PICTURES_BUCKET);

    if (bucketExists) {
      console.log(`✅ Supabase Storage bucket '${PROFILE_PICTURES_BUCKET}' is ready`);
    } else {
      console.warn(`⚠️  Supabase Storage bucket '${PROFILE_PICTURES_BUCKET}' not found.`);
      console.warn(`   Please create it manually in your Supabase dashboard:`);
      console.warn(`   1. Go to Storage in Supabase Dashboard`);
      console.warn(`   2. Create a new bucket named '${PROFILE_PICTURES_BUCKET}'`);
      console.warn(`   3. Make it Public`);
      console.warn(`   4. Set file size limit to 5MB`);
      console.warn(`   Profile picture uploads will not work until the bucket is created.`);
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
