import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Service-role client — bypasses Row Level Security entirely. Only use for
 * trusted server-side operations that must act outside a user's own
 * permissions: payment webhook handlers, admin APIs (after an explicit
 * requireRole('admin') check), and background jobs. Never import this into
 * a Client Component or expose the service key to the browser.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
