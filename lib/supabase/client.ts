// =============================================================================
// NEXCART — SUPABASE CLIENT (Browser / Client Components)
// =============================================================================

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates a Supabase client for use in Client Components.
 * Uses singleton pattern to avoid multiple instances.
 */
export function createClient() {
  if (client) return client;

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_anon_key"
  );

  return client;
}
