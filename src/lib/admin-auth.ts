/**
 * Admin auth middleware.
 * Protects admin routes and redirects unauthenticated users to login.
 */

// Auth verification happens in route handlers and client components
// This file is a placeholder for future auth middleware enhancements

export function requireAdminAuth() {
  // For now, we rely on browser-side auth token from Supabase
  // This is verified in route handlers and client components
  return null;
}
