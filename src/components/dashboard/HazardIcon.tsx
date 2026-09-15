import { CloudRain, Flame, MountainSnow, ThermometerSun, Waves, Zap, Activity, Wind, type LucideIcon } from "lucide-react";
import type { HazardType } from "@/data/indiaDemoData";
import { cn } from "@/lib/utils";

const icons: Record<HazardType, LucideIcon> = {
  "heavy-rain": CloudRain,
  flood: Waves,
  landslide: MountainSnow,
  cyclone: Wind,
  wildfire: Flame,
  lightning: Zap,
  tsunami: Waves,
  heatwave: ThermometerSun,
  earthquake: Activity,
  avalanche: MountainSnow,
};

export function HazardIcon({ hazard, className }: { hazard: HazardType; className?: string }) {
  const Icon = icons[hazard];
  return <Icon aria-hidden="true" className={cn("size-4", className)} />;
}