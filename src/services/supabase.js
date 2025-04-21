import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://hqjjoqtokhitebowisri.supabase.co";
const supabaseKey = import.meta.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
