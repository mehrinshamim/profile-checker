import { createClient, SupabaseClient } from "@supabase/supabase-js";

const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !anonKey) {
  console.warn(
    "Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Supabase client not initialized."
  );
} else {
  try {
    supabase = createClient(supabaseUrl, anonKey);
  } catch (error) {
    console.error("Error creating Supabase client:", error);
  }
}

export { supabase };