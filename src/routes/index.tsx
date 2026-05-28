import { createFileRoute } from "@tanstack/react-router";
import { GlobeClient } from "@/components/globe/GlobeClient";
import { HUD } from "@/components/globe/HUD";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbital Command — Global Threat Monitor" },
      { name: "description", content: "Cinematic real-time 3D Earth visualization for global incident, route and zone monitoring." },
      { property: "og:title", content: "Orbital Command — Global Threat Monitor" },
      { property: "og:description", content: "Cinematic real-time 3D Earth visualization for global incident monitoring." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      <GlobeClient />
      <HUD />
    </main>
  );
}
