import { useEffect, useState } from "react";
import GlobeScene from "./GlobeScene";
import type { DisasterEvent, HazardType } from "@/data/indiaDemoData";

export function GlobeClient({ events, selectedId, activeHazards, indiaFocus, showRoutes, onSelect }: {
  events: DisasterEvent[];
  selectedId: string;
  activeHazards: Set<HazardType>;
  indiaFocus: boolean;
  showRoutes: boolean;
  onSelect: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs tracking-[0.4em] text-foreground/40">
        INITIALIZING ORBIT…
      </div>
    );
  }
  return <GlobeScene events={events} selectedId={selectedId} activeHazards={activeHazards} indiaFocus={indiaFocus} showRoutes={showRoutes} onSelect={onSelect} />;
}
