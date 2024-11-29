// /utils/supabase.ts

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,         // Enables session persistence
      detectSessionInUrl: true,     // Detects session tokens in URL for OAuth redirects
    },
  }
);

export { supabase };
