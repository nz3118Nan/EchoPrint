import { Camera, GeoJSONSource, Layer, Map } from "@maplibre/maplibre-react-native";
import { StyleSheet, View } from "react-native";

import type { TrackPoint } from "../location/gps";

const demoStyle = "https://demotiles.maplibre.org/style.json";

export function TraceMap({ points }: { points: TrackPoint[] }) {
  const coordinates = points.map((point) => [point.longitude, point.latitude] as [number, number]);
  const latest = coordinates.at(-1) ?? [-0.1276, 51.5072];
  const bounds = coordinates.length > 1 ? coordinates.reduce(
    ([west, south, east, north], [longitude, latitude]) => [
      Math.min(west, longitude),
      Math.min(south, latitude),
      Math.max(east, longitude),
      Math.max(north, latitude),
    ],
    [coordinates[0][0], coordinates[0][1], coordinates[0][0], coordinates[0][1]],
  ) : undefined;
  const line: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: {},
    geometry: { type: "LineString", coordinates },
  };
  const point: GeoJSON.Feature<GeoJSON.Point> = {
    type: "Feature",
    properties: {},
    geometry: { type: "Point", coordinates: latest },
  };

  return <View style={styles.clip}>
    <Map mapStyle={demoStyle}>
      <Camera
        {...(bounds ? { bounds, padding: { top: 30, right: 30, bottom: 30, left: 30 } } : { center: latest, zoom: 15 })}
        duration={500}
      />
      {coordinates.length > 1 ? <GeoJSONSource data={line} id="trace-line-source">
        <Layer id="trace-glow" paint={{ "line-color": "#DDF2A6", "line-opacity": 0.55, "line-width": 10 }} type="line" />
        <Layer id="trace-line" layout={{ "line-cap": "round", "line-join": "round" }} paint={{ "line-color": "#174B3A", "line-width": 4 }} type="line" />
      </GeoJSONSource> : null}
      {coordinates.length ? <GeoJSONSource data={point} id="trace-point-source">
        <Layer id="trace-point-halo" paint={{ "circle-color": "#E5F5B8", "circle-opacity": 0.55, "circle-radius": 12 }} type="circle" />
        <Layer id="trace-point" paint={{ "circle-color": "#174B3A", "circle-radius": 5, "circle-stroke-color": "#F4F2EA", "circle-stroke-width": 2 }} type="circle" />
      </GeoJSONSource> : null}
    </Map>
  </View>;
}

const styles = StyleSheet.create({ clip: { flex: 1, overflow: "hidden" } });
