import * as Location from "expo-location";

import { uploadTrackPoints } from "../api/backend";

export type TrackPoint = {
  latitude: number;
  longitude: number;
  accuracy_meters: number;
  sampled_at: string;
};

const radians = Math.PI / 180;

function distanceMeters(a: TrackPoint, b: TrackPoint) {
  const lat1 = a.latitude * radians;
  const lat2 = b.latitude * radians;
  const deltaLat = (b.latitude - a.latitude) * radians;
  const deltaLon = (b.longitude - a.longitude) * radians;
  const h = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  return 12_742_000 * Math.asin(Math.sqrt(h));
}

export function acceptsGpsPoint(previous: TrackPoint | undefined, point: TrackPoint) {
  if (point.accuracy_meters > 35) return false;
  if (!previous) return true;
  const seconds = (Date.parse(point.sampled_at) - Date.parse(previous.sampled_at)) / 1000;
  if (seconds <= 0) return false;
  const distance = distanceMeters(previous, point);
  if (distance < Math.max(3, Math.min(previous.accuracy_meters, point.accuracy_meters) / 2)) return false;
  return distance / seconds <= 8;
}

export async function startTraceLocation(
  sessionId: string,
  onPoint: (point: TrackPoint) => void,
) {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) throw new Error("Location permission denied");

  let previous: TrackPoint | undefined;
  let queue: TrackPoint[] = [];
  let upload = Promise.resolve();

  function flush() {
    if (!queue.length) return upload;
    const batch = queue;
    queue = [];
    upload = upload.catch(() => undefined).then(async () => {
      try {
        await uploadTrackPoints(sessionId, batch);
      } catch (error) {
        queue = [...batch, ...queue];
        throw error;
      }
    });
    return upload;
  }

  const subscription = await Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 5_000 },
    (location) => {
      const point: TrackPoint = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy_meters: location.coords.accuracy ?? 999,
        sampled_at: new Date(location.timestamp).toISOString(),
      };
      if (!acceptsGpsPoint(previous, point)) return;
      previous = point;
      queue.push(point);
      onPoint(point);
      if (queue.length >= 3) void flush().catch(console.error);
    },
  );

  return async () => {
    subscription.remove();
    await flush();
  };
}
