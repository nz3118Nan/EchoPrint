import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectTo = Linking.createURL("auth/callback");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error || !data.url) throw error ?? new Error("Google sign-in URL was not created");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success") return null;

  const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(result.url);
  if (exchangeError) throw exchangeError;
  return sessionData.session;
}

export async function syncUser(accessToken: string) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/sync`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error("Could not sync the signed-in user");
}
