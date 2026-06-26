import { createFileRoute } from "@tanstack/react-router";
import { GlobeClient } from "@/components/globe/GlobeClient";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentinel — AI Disaster Command" },
      { name: "description", content: "Minimal AI-first disaster command center with a live 3D Earth, evacuation routing, and historical memory." },
      { property: "og:title", content: "Sentinel — AI Disaster Command" },
      { property: "og:description", content: "AI-first disaster command center built around a live 3D Earth." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      <GlobeClient />
      <Dashboard />
    </main>
  );
}
