import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_ADMIN_EMAIL = "roarwhd@gmail.com";

type SupabaseConfig = {
  url: string;
  publishableKey: string;
  serviceRoleKey: string;
  adminEmail: string;
  mediaBucket: string;
};

function readConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !publishableKey || !serviceRoleKey) return null;

  return {
    url,
    publishableKey,
    serviceRoleKey,
    adminEmail:
      process.env.SUPABASE_ADMIN_EMAIL?.trim().toLowerCase() ||
      DEFAULT_ADMIN_EMAIL,
    mediaBucket: process.env.SUPABASE_MEDIA_BUCKET?.trim() || "media",
  };
}

export function isSupabaseConfigured(): boolean {
  return readConfig() !== null;
}

export function getSupabaseConfig(): SupabaseConfig {
  const config = readConfig();
  if (!config) {
    throw new Error(
      "Supabase is not configured. Add the required production environment variables.",
    );
  }
  return config;
}

export function getSupabaseAdmin(): SupabaseClient {
  const config = getSupabaseConfig();
  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

export function getSupabaseAuth(): SupabaseClient {
  const config = getSupabaseConfig();
  return createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

