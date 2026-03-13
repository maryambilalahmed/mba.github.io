/**
 * Client-side Supabase client.
 * Used in browsers and client components.
 * SAFE - only uses public anon key.
 */

import { createClient as createBrowserClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
