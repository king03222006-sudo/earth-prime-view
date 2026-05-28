import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { greatCircleCurve, latLngToVec3, ROUTES, ROUTE_COLORS } from "./geo";

function RouteArc({
  from,
  to,
  color,
  radius,
  offset,
}: {
  from: [number, number];
  to: [number, number];
  color: string;
  radius: number;
  offset: number;
}) {
  const curve = useMemo(
    () => greatCircleCurve(latLngToVec3(from[0], from[1], radius * 1.005), latLngToVec3(to[0], to[1], radius * 1.005), 0.4),
    [from, to, radius],
  );

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 80, 0.004, 8, false), [curve]);
  const glowGeo = useMemo(() => new THREE.TubeGeometry(curve, 80, 0.012, 8, false), [curve]);

  // Traveling particle
  const particleRef = useRef<THREE.Mesh>(null!);
  const particleTrailRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = ((clock.elapsedTime * 0.18 + offset) % 1);
    const p = curve.getPointAt(t);
    const p2 = curve.getPointAt(Math.max(0, t - 0.02));
    if (particleRef.current) particleRef.current.position.copy(p);
    if (particleTrailRef.current) particleTrailRef.current.position.copy(p2);
  });

  return (
    <group>
      <mesh geometry={glowGeo}>
        <meshBasicMaterial color={color} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial color={color} transparent opacity={0.95} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.014, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={particleTrailRef}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function Routes({ radius }: { radius: number }) {
  return (
    <group>
      {ROUTES.map((r, i) => (
        <RouteArc key={r.id} from={r.from} to={r.to} color={ROUTE_COLORS[r.kind]} radius={radius} offset={i * 0.13} />
      ))}
    </group>
  );
}
