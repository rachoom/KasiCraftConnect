import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

async function testBucketAccess() {
  console.log('Testing bucket access...');
  console.log('Project URL:', supabaseUrl);
  
  const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
  
  // Test 1: List buckets
  console.log('\n1. Testing listBuckets()...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  console.log('Result:', { buckets, error: listError });
  
  // Test 2: Try to access profile-pictures bucket directly
  console.log('\n2. Testing direct bucket access...');
  try {
    const { data: files, error: filesError } = await supabase.storage
      .from('profile-pictures')
      .list();
    console.log('Files in bucket:', { files, error: filesError });
  } catch (err) {
    console.log('Error accessing bucket:', err);
  }
  
  // Test 3: Try to get bucket info
  console.log('\n3. Testing getBucket()...');
  try {
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket('profile-pictures');
    console.log('Bucket info:', { bucket, error: bucketError });
  } catch (err) {
    console.log('Error getting bucket:', err);
  }
}

testBucketAccess();
