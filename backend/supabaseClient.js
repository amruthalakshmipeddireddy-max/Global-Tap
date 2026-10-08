// Creates the two Supabase clients this backend uses.
//
// - publicClient uses the anon key: for sign-up, login and checking tokens.
// - adminClient uses the service-role key: for trusted server-side writes,
//   like creating the profile row after sign-up.
// The service-role key must never reach the frontend.

const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error('Missing Supabase settings. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const publicClient = createClient(url, anonKey);
const adminClient = createClient(url, serviceKey);

module.exports = { publicClient, adminClient };
