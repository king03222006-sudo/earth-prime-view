import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentinel WeatherGPT India — Disaster AI OS" },
      { name: "description", content: "India-first conversational multi-hazard disaster intelligence with a cinematic 3D Earth and transparent source labels." },
      { property: "og:title", content: "Sentinel WeatherGPT India — Disaster AI OS" },
      { property: "og:description", content: "Conversational weather alerts and India-first disaster intelligence on an interactive 3D Earth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <Dashboard />
    </main>
  );
}
