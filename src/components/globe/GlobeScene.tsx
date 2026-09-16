import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { Earth } from "./Earth";
import { Markers } from "./Markers";
import { Routes } from "./Routes";
import { Satellites } from "./Satellites";
import { Nebula } from "./Nebula";
import { IndiaLayers } from "./IndiaLayers";
import type { DisasterEvent, HazardType } from "@/data/indiaDemoData";

function SpinningEarth({ radius, sunDirection, events, selectedId, activeHazards, indiaFocus, showRoutes, onSelect }: {
  radius: number;
  sunDirection: THREE.Vector3;
  events: DisasterEvent[];
  selectedId: string;
  activeHazards: Set<HazardType>;
  indiaFocus: boolean;
  showRoutes: boolean;
  onSelect: (id: string) => void;
}) {
  const spinRef = useRef<THREE.Group>(null);
  useEffect(() => {
    if (indiaFocus && spinRef.current) spinRef.current.rotation.y = Math.PI + 0.2;
  }, [indiaFocus]);
  useFrame((_, dt) => {
    if (spinRef.current && !indiaFocus) spinRef.current.rotation.y += dt * 0.025;
  });
  return (
    <group ref={spinRef} rotation={[0, Math.PI + 0.2, 0]}>
      <Earth radius={radius} sunDirection={sunDirection} />
      {showRoutes && <Routes radius={radius} />}
      {!indiaFocus && <Markers radius={radius} />}
      <IndiaLayers events={events} selectedId={selectedId} activeHazards={activeHazards} showLabels={indiaFocus} onSelect={onSelect} />
    </group>
  );
}

function Sun({ sunRef }: { sunRef: MutableRefObject<THREE.Vector3> }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.04;
    sunRef.current.set(Math.cos(t) * 5, Math.sin(t * 0.3) * 1.5, Math.sin(t) * 5);
    if (lightRef.current) lightRef.current.position.copy(sunRef.current);
  });
  return (
    <>
      <directionalLight ref={lightRef} intensity={1.4} color="#fff5e6" />
      <ambientLight intensity={0.04} color="#1a2a4a" />
      <hemisphereLight args={["#3a5fa8", "#0a0a18", 0.15]} />
    </>
  );
}

function CinematicCamera() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // subtle floating drift
    camera.position.x += Math.sin(t * 0.15) * 0.0008;
    camera.position.y += Math.cos(t * 0.1) * 0.0006;
  });
  return null;
}

export default function GlobeScene({ events, selectedId, activeHazards, indiaFocus, showRoutes, onSelect }: {
  events: DisasterEvent[];
  selectedId: string;
  activeHazards: Set<HazardType>;
  indiaFocus: boolean;
  showRoutes: boolean;
  onSelect: (id: string) => void;
}) {
  const sunRef = useRef(new THREE.Vector3(5, 1, 3));
  const radius = 1;

  const dpr = useMemo<[number, number]>(() => [1, 1.8], []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.25, 3.05], fov: 38, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        powerPreference: "high-performance",
      }}
      style={{ background: "radial-gradient(ellipse at center, #050813 0%, #000005 70%)" }}
    >
      <Suspense fallback={null}>
        <Sun sunRef={sunRef} />
        <Nebula />
        <Stars radius={60} depth={40} count={9000} factor={3.2} saturation={0.2} fade speed={0.4} />
        <Stars radius={30} depth={20} count={3000} factor={1.8} saturation={0} fade speed={0.2} />
        <SpinningEarth radius={radius} sunDirection={sunRef.current} events={events} selectedId={selectedId} activeHazards={activeHazards} indiaFocus={indiaFocus} showRoutes={showRoutes} onSelect={onSelect} />
        <Satellites count={120} radius={radius} />
        <CinematicCamera />
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.5}
          zoomSpeed={0.6}
          minDistance={1.6}
          maxDistance={6}
          autoRotate={!indiaFocus}
          autoRotateSpeed={0.25}
        />
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.2} luminanceThreshold={0.25} luminanceSmoothing={0.3} radius={0.85} />
          <Vignette eskil={false} offset={0.15} darkness={0.85} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
