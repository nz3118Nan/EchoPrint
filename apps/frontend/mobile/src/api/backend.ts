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

export type StoredTrackPoint = {
  latitude: number;
  longitude: number;
  accuracy_meters: number;
  sampled_at: string;
};

export async function uploadTrackPoints(sessionId: string, points: StoredTrackPoint[]) {
  const response = await fetch(`${backendUrl}/sessions/${sessionId}/track-points`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points }),
  });
  if (!response.ok) throw new Error(`GPS upload failed (${response.status}).`);
}

export async function listTraces() {
  const response = await fetch(`${backendUrl}/sessions/traces`, {
    headers: { Authorization: `Bearer ${await accessToken()}` },
  });
  if (!response.ok) throw new Error(`Trace download failed (${response.status}).`);
  return (await response.json()) as Array<{
    id: string;
    title: string | null;
    created_at: string;
    points: StoredTrackPoint[];
  }>;
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

export async function uploadPhoto(
  sessionId: string,
  asset: { uri: string; fileName?: string | null; mimeType?: string | null },
  source: "camera" | "file",
) {
  const body = new FormData();
  body.append("session_id", sessionId);
  body.append("source", source);
  body.append("photo", {
    uri: asset.uri,
    name: asset.fileName || `photo-${Date.now()}.jpg`,
    type: asset.mimeType || "image/jpeg",
  } as unknown as Blob);
  const response = await fetch(`${backendUrl}/photos`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken()}` },
    body,
  });
  if (!response.ok) throw new Error(`Photo upload failed (${response.status}).`);
  return (await response.json()) as { id: string; session_id: string; media_type: string; size: number };
}

export async function createMessage(sessionId: string, content: string) {
  const response = await fetch(`${backendUrl}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: sessionId, content }),
  });
  if (!response.ok) throw new Error(`Text echo failed (${response.status}).`);
  return (await response.json()) as { id: string; session_id: string; content: string };
}
