import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// null mientras no se configuren las variables de entorno (ver .env.example)
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
