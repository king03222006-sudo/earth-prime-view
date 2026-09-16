import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { HazardIcon } from "@/components/dashboard/HazardIcon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { hazardMeta, type DisasterEvent, type HazardType } from "@/data/indiaDemoData";
import { latLngToVec3 } from "./geo";

const INDIA_OUTLINE: [number, number][] = [
  [35.5, 74.3], [33.2, 78.8], [30.6, 80.2], [27.8, 88.1], [26.2, 89.8], [23.2, 88.7],
  [21.8, 87.2], [19.1, 85.5], [16.2, 82.1], [12.1, 80.2], [8.2, 77.5], [10.5, 75.3],
  [15.9, 73.4], [20.1, 72.8], [23.5, 68.5], [27.7, 70.6], [31.1, 74.5], [35.5, 74.3],
];

const riskRegions = [
  [26.2, 92.4, "Assam"], [20.2, 86.2, "Odisha coast"], [30.1, 79.2, "Uttarakhand"],
  [19.4, 75.2, "Maharashtra"], [10.4, 76.4, "Kerala"], [22.8, 88.4, "West Bengal"],
  [15.2, 88.4, "Bay of Bengal"], [11.6, 92.7, "Andaman & Nicobar"],
] as const;

function ImpactRing({ event, selected }: { event: DisasterEvent; selected: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const position = useMemo(() => latLngToVec3(event.lat, event.lng, 1.012), [event.lat, event.lng]);
  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  );
  useFrame(({ clock }) => {
    if (!selected || !ringRef.current || !materialRef.current) return;
    const phase = (clock.elapsedTime * 0.55) % 1;
    ringRef.current.scale.setScalar(0.045 + phase * 0.09);
    materialRef.current.opacity = 0.75 * (1 - phase);
  });
  return (
    <mesh ref={ringRef} position={position} quaternion={quaternion} scale={selected ? 0.045 : 0.04}>
      <ringGeometry args={[0.78, 1, 48]} />
      <meshBasicMaterial
        ref={materialRef}
        color={hazardMeta[event.hazard].color}
        transparent
        opacity={selected ? 0.75 : 0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function RiskOverlay({ lat, lng }: { lat: number; lng: number }) {
  const position = useMemo(() => latLngToVec3(lat, lng, 1.008), [lat, lng]);
  const quaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  );
  return (
    <mesh position={position} quaternion={quaternion} scale={0.035}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.13} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function EventMarker({ event, selected, onSelect }: { event: DisasterEvent; selected: boolean; onSelect: (id: string) => void }) {
  const position = useMemo(() => latLngToVec3(event.lat, event.lng, 1.045), [event.lat, event.lng]);
  return (
    <group>
      <ImpactRing event={event} selected={selected} />
      <Html position={position} center distanceFactor={5.4} zIndexRange={[30, 0]}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`${event.title}, ${event.region}, ${event.severity}`}
              onClick={() => onSelect(event.id)}
              className={`globe-marker size-9 rounded-full border backdrop-blur-md ${selected ? "globe-marker-selected" : ""}`}
            >
              <HazardIcon hazard={event.hazard} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="w-56 border border-panel-border bg-panel text-panel-foreground">
            <div className="text-xs font-semibold">{event.title} · {event.region}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{event.district} · {event.severity}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">{event.source} · {event.updated}</div>
            <div className="mt-1 text-[10px] text-primary">{event.trust}</div>
          </TooltipContent>
        </Tooltip>
      </Html>
    </group>
  );
}

export function IndiaLayers({
  events,
  selectedId,
  activeHazards,
  showLabels,
  onSelect,
}: {
  events: DisasterEvent[];
  selectedId: string;
  activeHazards: Set<HazardType>;
  showLabels: boolean;
  onSelect: (id: string) => void;
}) {
  const outlinePoints = useMemo(() => INDIA_OUTLINE.map(([lat, lng]) => latLngToVec3(lat, lng, 1.009)), []);
  const selectedEvent = events.find((event) => event.id === selectedId);
  const sourceLines = useMemo(() => {
    if (!selectedEvent) return [];
    const start = latLngToVec3(selectedEvent.lat, selectedEvent.lng, 1.02);
    return [[start, latLngToVec3(28.6, 77.2, 1.02)], [start, latLngToVec3(13.1, 77.6, 1.02)]];
  }, [selectedEvent]);

  return (
    <group>
      <Line points={outlinePoints} color="#5eead4" lineWidth={0.7} transparent opacity={0.58} />
      {riskRegions.map(([lat, lng]) => <RiskOverlay key={`${lat}-${lng}`} lat={lat} lng={lng} />)}
      {sourceLines.map((points, index) => (
        <Line key={index} points={points} color="#67e8f9" lineWidth={0.6} transparent opacity={0.35} dashed dashScale={20} />
      ))}
      {events.filter((event) => activeHazards.has(event.hazard)).map((event) => (
        <EventMarker key={event.id} event={event} selected={event.id === selectedId} onSelect={onSelect} />
      ))}
      {showLabels && riskRegions.map(([lat, lng, label]) => (
        <Html key={label} position={latLngToVec3(lat, lng, 1.025)} center distanceFactor={7.5} zIndexRange={[10, 0]}>
          <span className="pointer-events-none whitespace-nowrap rounded-sm bg-panel/70 px-1.5 py-0.5 text-[8px] font-medium text-panel-foreground/70 backdrop-blur-sm">{label}</span>
        </Html>
      ))}
    </group>
  );
}