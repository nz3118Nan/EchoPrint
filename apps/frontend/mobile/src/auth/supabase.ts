import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) throw new Error("Missing Supabase mobile environment variables");

export const supabase = createClient(url, key, {
  auth: { storage: AsyncStorage, storageKey: "echoprint.auth.session", autoRefreshToken: true, persistSession: true, detectSessionInUrl: false, flowType: "implicit" },
});
