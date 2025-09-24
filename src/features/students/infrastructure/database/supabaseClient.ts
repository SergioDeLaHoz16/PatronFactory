
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      '🚨 Error de configuración: Variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no definidas'
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}
