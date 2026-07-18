import { Platform } from "react-native";

import { supabase } from "../auth/supabase";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

async function accessToken() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("You are not signed in.");
  return data.session.access_token;
}

export async function createTraceSession() {
  const response = await fetch(`${backendUrl}/sessions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}` },
  });
  if (!response.ok) throw new Error("Could not start this trace.");
  return (await response.json()) as { id: string; title: string | null };
}

export async function uploadVoice(sessionId: string, uri: string, durationMs: number) {
  const web = Platform.OS === "web";
  const body = new FormData();
  body.append("session_id", sessionId);
  body.append("duration_ms", String(durationMs));
  body.append("audio", {
    uri,
    name: web ? "recording.webm" : "recording.m4a",
    type: web ? "audio/webm" : "audio/mp4",
  } as unknown as Blob);

  const response = await fetch(`${backendUrl}/transcriptions/batch`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}` },
    body,
  });
  if (!response.ok) throw new Error(`Voice upload failed (${response.status}).`);
  return (await response.json()) as {
    id: string;
    session_id: string;
    transcript: string;
    duration_ms: number;
  };
}
