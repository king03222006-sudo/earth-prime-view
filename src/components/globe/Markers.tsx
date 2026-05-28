import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVec3, MARKERS, KIND_COLORS, type Marker } from "./geo";

function PulseRing({ position, color, scale = 1, speed = 1 }: { position: THREE.Vector3; color: string; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * speed) % 2;
    const s = 0.02 + t * 0.12 * scale;
    if (ref.current) ref.current.scale.setScalar(s);
    if (matRef.current) matRef.current.opacity = Math.max(0, 1 - t / 2);
  });
  const up = position.clone().normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), up);
  return (
    <mesh ref={ref} position={position} quaternion={quat}>
      <ringGeometry args={[0.8, 1, 64]} />
      <meshBasicMaterial ref={matRef} color={color} transparent blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function MarkerDot({ marker, radius }: { marker: Marker; radius: number }) {
  const pos = latLngToVec3(marker.lat, marker.lng, radius * 1.005);
  const color = KIND_COLORS[marker.kind];
  const dotRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (dotRef.current) {
      const p = 1 + Math.sin(clock.elapsedTime * 2 + marker.lat) * 0.15;
      dotRef.current.scale.setScalar(p);
    }
  });

  const isDanger = marker.kind === "critical" || marker.kind === "highrisk";

  return (
    <group>
      <mesh ref={dotRef} position={pos}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* outer glow */}
      <mesh position={pos}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <PulseRing position={pos} color={color} scale={isDanger ? 1.4 : 0.7} speed={isDanger ? 1.1 : 0.6} />
      {isDanger && <PulseRing position={pos} color={color} scale={1.8} speed={0.8} />}
    </group>
  );
}

export function Markers({ radius }: { radius: number }) {
  return (
    <group>
      {MARKERS.map((m) => (
        <MarkerDot key={m.id} marker={m} radius={radius} />
      ))}
    </group>
  );
}
