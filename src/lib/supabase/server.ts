import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from "@/lib/supabase/env";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const env = getSupabasePublicEnv();

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          cookieStore.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });
}

export function createMiddlewareSupabaseClient(request: NextRequest, response: NextResponse) {
  const env = getSupabasePublicEnv();

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          request.cookies.set(cookie.name, cookie.value);
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });
}

export function createServiceRoleClient() {
  const env = getSupabasePublicEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  return createSupabaseClient<Database>(env.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

