import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

async function checkSupabase() {
  console.log('Checking Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key exists:', !!supabaseAnonKey);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    console.log('\nListing all storage buckets...');
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }
    
    console.log('\nFound buckets:');
    if (buckets && buckets.length > 0) {
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (public: ${bucket.public}, id: ${bucket.id})`);
      });
    } else {
      console.log('  No buckets found!');
    }
    
    console.log('\nLooking for profile-pictures bucket...');
    const profileBucket = buckets?.find(b => b.name === 'profile-pictures');
    if (profileBucket) {
      console.log('  ✅ Found profile-pictures bucket!');
      console.log('  Public:', profileBucket.public);
      console.log('  ID:', profileBucket.id);
    } else {
      console.log('  ❌ profile-pictures bucket NOT found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSupabase();
