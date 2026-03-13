/**
 * Server-side Supabase helpers for Next.js App Router.
 * Uses service role for admin operations (migrations, RLS bypass).
 */

import { createClient as createServiceClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Creates a service-role Supabase client.
 * ⚠️ ADMIN ONLY - use only for migrations and admin operations.
 * This client has full access to all data, bypassing RLS.
 */
export function createServiceRoleClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY must be set");
  }

  return createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/**
 * Creates an authenticated Supabase client for server-side operations
 * with a given access token.
 */
export function createAuthenticatedClient(accessToken: string) {
  return createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    },
  );
}

