import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://hqjjoqtokhitebowisri.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxampvcXRva2hpdGVib3dpc3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4OTMyNjAsImV4cCI6MjA0NjQ2OTI2MH0.CIpzspvPURCp-pgI5JYNrkDR4I_QGrUbfiNp5Gt-DTw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
