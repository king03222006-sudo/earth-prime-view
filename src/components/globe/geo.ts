import * as THREE from "three";

export function latLngToVec3(lat: number, lng: number, radius = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function greatCircleCurve(
  start: THREE.Vector3,
  end: THREE.Vector3,
  altitudeFactor = 0.35,
): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  const segments = 64;
  const startN = start.clone().normalize();
  const endN = end.clone().normalize();
  const angle = startN.angleTo(endN);
  const maxAlt = start.length() * (1 + altitudeFactor * Math.min(1, angle / Math.PI));

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().lerpVectors(startN, endN, t).normalize();
    // arc altitude: sinusoidal lift
    const lift = Math.sin(Math.PI * t);
    const r = start.length() + (maxAlt - start.length()) * lift;
    points.push(p.multiplyScalar(r));
  }
  return new THREE.CatmullRomCurve3(points);
}

export type MarkerKind = "critical" | "warning" | "highrisk" | "safe";
export type RouteKind = "rescue" | "evacuation" | "supply" | "airsupport";

export interface Marker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kind: MarkerKind;
}

export interface Route {
  id: string;
  from: [number, number];
  to: [number, number];
  kind: RouteKind;
}

export const MARKERS: Marker[] = [
  { id: "m1", name: "Central Asia", lat: 43, lng: 75, kind: "critical" },
  { id: "m2", name: "South China", lat: 28, lng: 108, kind: "warning" },
  { id: "m3", name: "Sahara", lat: 22, lng: 12, kind: "highrisk" },
  { id: "m4", name: "Horn of Africa", lat: 9, lng: 40, kind: "highrisk" },
  { id: "m5", name: "Mozambique", lat: -18, lng: 35, kind: "critical" },
  { id: "m6", name: "Sahel", lat: 14, lng: 0, kind: "safe" },
  { id: "m7", name: "Kenya Hub", lat: -1, lng: 37, kind: "safe" },
  { id: "m8", name: "Northern Europe", lat: 60, lng: 18, kind: "safe" },
  { id: "m9", name: "Arabia", lat: 24, lng: 45, kind: "warning" },
  { id: "m10", name: "Indonesia", lat: -2, lng: 118, kind: "warning" },
];

export const ROUTES: Route[] = [
  { id: "r1", from: [-1, 37], to: [22, 12], kind: "rescue" },
  { id: "r2", from: [43, 75], to: [60, 18], kind: "evacuation" },
  { id: "r3", from: [28, 108], to: [-2, 118], kind: "supply" },
  { id: "r4", from: [24, 45], to: [9, 40], kind: "airsupport" },
  { id: "r5", from: [14, 0], to: [-18, 35], kind: "rescue" },
  { id: "r6", from: [60, 18], to: [43, 75], kind: "evacuation" },
  { id: "r7", from: [-1, 37], to: [24, 45], kind: "supply" },
  { id: "r8", from: [22, 12], to: [9, 40], kind: "airsupport" },
  { id: "r9", from: [28, 108], to: [43, 75], kind: "evacuation" },
  { id: "r10", from: [-18, 35], to: [-2, 118], kind: "rescue" },
];

export const KIND_COLORS: Record<MarkerKind, string> = {
  critical: "#ff3344",
  warning: "#ffb347",
  highrisk: "#ff7a3a",
  safe: "#3dffa5",
};

export const ROUTE_COLORS: Record<RouteKind, string> = {
  rescue: "#3dffa5",
  evacuation: "#ff3344",
  supply: "#3ab6ff",
  airsupport: "#cbd5e1",
};
