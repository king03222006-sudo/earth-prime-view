import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Brain,
  Building2,
  ChevronRight,
  Circle,
  Clock,
  Cloud,
  FileText,
  Flame,
  Layers,
  type LucideIcon,
  MapPin,
  Radar,
  Satellite,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  ThermometerSun,
  Truck,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";

/* ---------- shared ---------- */

const glass =
  "rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ---------- top nav ---------- */

function TopNav() {
  const now = useNow();
  const time = now
    ? now.toLocaleTimeString("en-US", { hour12: false }) + " UTC"
    : "—— : —— : ——";
  return (
    <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400/30 to-emerald-400/20 ring-1 ring-white/10">
          <Sparkles className="h-4 w-4 text-sky-300" />
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-medium tracking-tight text-white/90">Sentinel</div>
          <div className="text-[10px] tracking-[0.18em] text-white/40">DISASTER · AI OS</div>
        </div>
      </div>

      <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 w-[360px] ${glass} rounded-full`}>
        <Search className="h-3.5 w-3.5 text-white/40" />
        <input
          placeholder="Ask Sentinel anything…"
          className="flex-1 bg-transparent text-xs text-white/80 placeholder:text-white/30 outline-none"
        />
        <span className="rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-white/40">⌘K</span>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-white/60">
        <div className="hidden md:flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          AI Online
        </div>
        <div className="hidden sm:block tabular-nums tracking-wider">{time}</div>
        <button className="rounded-md p-1.5 text-white/60 hover:bg-white/5 hover:text-white">
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}

/* ---------- left: live events ---------- */

const events = [
  {
    id: "e1",
    title: "Earthquake",
    location: "Sendai, Japan",
    severity: "Critical",
    magnitude: "7.2",
    affected: "1.4M",
    detected: "2m ago",
    color: "text-rose-300",
    dot: "bg-rose-400",
  },
  {
    id: "e2",
    title: "Wildfire",
    location: "Athens, Greece",
    severity: "High",
    magnitude: "—",
    affected: "120K",
    detected: "47m ago",
    color: "text-amber-300",
    dot: "bg-amber-400",
  },
  {
    id: "e3",
    title: "Flood",
    location: "Dhaka, Bangladesh",
    severity: "Warning",
    magnitude: "—",
    affected: "320K",
    detected: "2h ago",
    color: "text-sky-300",
    dot: "bg-sky-400",
  },
];

function LiveEvents({ onSelect }: { onSelect: (id: string) => void }) {
  const [active, setActive] = useState("e1");
  return (
    <aside className={`pointer-events-auto absolute left-6 top-24 z-20 w-[300px] ${glass} p-4`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] text-white/40">
          <Activity className="h-3 w-3" /> LIVE EVENTS
        </div>
        <span className="text-[10px] text-white/40">{events.length} active</span>
      </div>

      <div className="space-y-2">
        {events.map((e) => {
          const open = e.id === active;
          return (
            <button
              key={e.id}
              onClick={() => {
                setActive(e.id);
                onSelect(e.id);
              }}
              className={`w-full rounded-xl border text-left transition-all duration-300 ${
                open
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-white/[0.04] bg-transparent hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3 px-3 py-2.5">
                <span className={`h-2 w-2 rounded-full ${e.dot} shadow-[0_0_10px_currentColor] ${e.color}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[13px] font-medium text-white/90">{e.title}</span>
                    <span className={`text-[10px] ${e.color}`}>{e.severity}</span>
                  </div>
                  <div className="truncate text-[11px] text-white/40">{e.location}</div>
                </div>
              </div>
              <div
                className={`grid grid-cols-3 gap-2 overflow-hidden px-3 transition-all duration-300 ${
                  open ? "max-h-24 pb-3 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <Metric label="Magnitude" value={e.magnitude} />
                <Metric label="Affected" value={e.affected} />
                <Metric label="Detected" value={e.detected} />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] px-2 py-1.5">
      <div className="text-[9px] tracking-wider text-white/35">{label}</div>
      <div className="text-[12px] tabular-nums text-white/90">{value}</div>
    </div>
  );
}

/* ---------- right: AI panel ---------- */

const aiSteps = [
  "Satellite imagery",
  "Historical disasters",
  "Weather forecast",
  "Road conditions",
  "Citizen reports",
];

const aiFeed = [
  "Scanning satellite imagery…",
  "Comparing 2001 Bhuj earthquake patterns…",
  "Predicting aftershock probabilities…",
  "Checking hospital availability within 50km…",
  "Finding safest evacuation route…",
  "Cross-referencing weather forecast…",
];

function AIPanel() {
  const [done, setDone] = useState<number>(0);
  const [feed, setFeed] = useState(0);

  useEffect(() => {
    if (done >= aiSteps.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), 700);
    return () => clearTimeout(t);
  }, [done]);

  useEffect(() => {
    const id = setInterval(() => setFeed((f) => (f + 1) % aiFeed.length), 2400);
    return () => clearInterval(id);
  }, []);

  const complete = done >= aiSteps.length;

  return (
    <aside className={`pointer-events-auto absolute right-6 top-24 z-20 w-[300px] ${glass} p-4`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] text-white/40">
          <Brain className="h-3 w-3" /> AI REASONING
        </div>
        <span className="flex items-center gap-1 text-[10px] text-emerald-300/80">
          <Circle className="h-1.5 w-1.5 fill-current" />
          {complete ? "Complete" : "Live"}
        </span>
      </div>

      <div className="mb-4 text-[13px] leading-relaxed text-white/80">
        {complete ? "Safest evacuation generated." : "Analyzing event signals…"}
      </div>

      <div className="space-y-2">
        {aiSteps.map((s, i) => {
          const isDone = i < done;
          const isActive = i === done && !complete;
          return (
            <div key={s} className="flex items-center gap-3 text-[12px]">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                  isDone
                    ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                    : isActive
                      ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
                      : "border-white/10 text-white/30"
                }`}
              >
                {isDone ? "✓" : isActive ? <Circle className="h-1.5 w-1.5 animate-pulse fill-current" /> : ""}
              </span>
              <span className={isDone ? "text-white/80" : isActive ? "text-white/70" : "text-white/35"}>
                {s}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
        <div>
          <div className="text-[9px] tracking-wider text-white/35">CONFIDENCE</div>
          <div className="text-[15px] text-emerald-300 tabular-nums">94%</div>
        </div>
        <div>
          <div className="text-[9px] tracking-wider text-white/35">ETA</div>
          <div className="text-[15px] text-white/85 tabular-nums">
            {complete ? "0s" : `${Math.max(1, aiSteps.length - done)}s`}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-[11px] text-white/55">
        <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-sky-300/80" />
        <span className="leading-relaxed">{aiFeed[feed]}</span>
      </div>
    </aside>
  );
}

/* ---------- globe layer toggles ---------- */

const layers: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "weather", label: "Weather", icon: Cloud },
  { id: "heat", label: "Heatmap", icon: ThermometerSun },
  { id: "sat", label: "Satellite", icon: Satellite },
  { id: "routes", label: "Routes", icon: Radar },
];

function LayerToggles() {
  const [on, setOn] = useState<Record<string, boolean>>({ routes: true });
  return (
    <div className={`pointer-events-auto absolute left-1/2 top-24 z-20 -translate-x-1/2 ${glass} flex items-center gap-1 p-1`}>
      {layers.map((l) => {
        const active = !!on[l.id];
        const Icon = l.icon;
        return (
          <button
            key={l.id}
            onClick={() => setOn((p) => ({ ...p, [l.id]: !p[l.id] }))}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] transition-colors ${
              active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white/80"
            }`}
          >
            <Icon className="h-3 w-3" />
            {l.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- AI memory floating chip ---------- */

function MemoryChip({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className={`pointer-events-auto absolute left-6 bottom-40 z-20 ${glass} group flex items-center gap-3 px-3 py-2 text-left hover:bg-white/[0.05]`}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300 ring-1 ring-violet-300/20">
        <Brain className="h-3.5 w-3.5" />
      </div>
      <div className="leading-tight">
        <div className="text-[11px] text-white/85">Historical memory loaded</div>
        <div className="text-[10px] text-white/40">4 references · click to compare</div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-white/30 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/* ---------- floating disaster card ---------- */

function DisasterCard({ onClose }: { onClose: () => void }) {
  const rows = [
    { icon: Zap, label: "Magnitude", value: "7.2 Mw" },
    { icon: Layers, label: "Depth", value: "32 km" },
    { icon: Waves, label: "Tsunami risk", value: "Moderate" },
    { icon: Building2, label: "Nearest shelter", value: "4.2 km" },
    { icon: Clock, label: "Evacuation time", value: "18 min" },
    { icon: Radar, label: "Route", value: "Coastal Hwy 6" },
    { icon: Shield, label: "Hospital capacity", value: "62%" },
    { icon: Users, label: "Population", value: "1.4M" },
  ];
  return (
    <div className={`pointer-events-auto absolute right-6 bottom-40 z-20 w-[300px] ${glass} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_10px_#fb7185]" />
          <span className="text-[13px] font-medium text-white/90">Earthquake · Sendai</span>
        </div>
        <button onClick={onClose} className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-white">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/[0.04] p-px">
        {rows.map((r) => (
          <div key={r.label} className="bg-[#0a0d14]/80 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-[9px] tracking-wider text-white/35">
              <r.icon className="h-2.5 w-2.5" />
              {r.label.toUpperCase()}
            </div>
            <div className="mt-0.5 text-[12px] text-white/90 tabular-nums">{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- bottom: timeline + actions ---------- */

const timeline = [
  { label: "Earthquake", icon: AlertTriangle },
  { label: "AI Analysis", icon: Brain },
  { label: "Routes", icon: Radar },
  { label: "Alerts", icon: Bell },
  { label: "Rescue", icon: Truck },
  { label: "Complete", icon: Shield },
];

function Timeline() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (timeline.length + 1)), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={`pointer-events-auto absolute left-1/2 bottom-24 z-20 -translate-x-1/2 ${glass} px-4 py-3`}>
      <div className="flex items-center gap-1">
        {timeline.map((t, i) => {
          const reached = i < step;
          const active = i === step - 1;
          return (
            <div key={t.label} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] transition-all duration-500 ${
                  reached
                    ? "bg-emerald-400/10 text-emerald-200"
                    : "text-white/30"
                } ${active ? "ring-1 ring-emerald-300/40" : ""}`}
              >
                <t.icon className="h-3 w-3" />
                <span className="tracking-wide">{t.label}</span>
              </div>
              {i < timeline.length - 1 && (
                <div
                  className={`mx-1 h-px w-6 transition-colors duration-500 ${
                    reached ? "bg-emerald-300/40" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const actions = [
  { label: "Send Emergency Alert", icon: Bell, accent: "text-rose-300" },
  { label: "View Shelters", icon: Building2, accent: "text-emerald-300" },
  { label: "Deploy Resources", icon: Truck, accent: "text-sky-300" },
  { label: "Generate Report", icon: FileText, accent: "text-white/70" },
];

function ActionBar() {
  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-6 z-20 flex justify-center px-6">
      <div className={`flex w-full max-w-3xl items-center gap-2 ${glass} p-1.5`}>
        {actions.map((a) => (
          <button
            key={a.label}
            className="group flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[12px] text-white/75 transition-all hover:bg-white/[0.05] hover:text-white"
          >
            <a.icon className={`h-3.5 w-3.5 ${a.accent}`} />
            <span className="hidden sm:inline">{a.label}</span>
          </button>
        ))}
        <button className="ml-1 flex items-center gap-1.5 rounded-xl bg-emerald-400/15 px-4 py-2.5 text-[12px] text-emerald-200 ring-1 ring-emerald-300/30 hover:bg-emerald-400/25">
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Dispatch</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- memory modal ---------- */

function MemoryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className={`w-full max-w-lg ${glass} p-6`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-300" />
            <span className="text-sm text-white/90">Historical Memory</span>
          </div>
          <button onClick={onClose} className="rounded p-1 text-white/40 hover:bg-white/5 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          {[
            { y: "2001", t: "Bhuj Earthquake", s: "7.7 Mw · 20K casualties · pattern match 71%" },
            { y: "2021", t: "Cyclone Tauktae", s: "Cat 4 · evac model reused" },
            { y: "2018", t: "Kerala Floods", s: "Aftershock-flood correlation" },
            { y: "2015", t: "Nepal Earthquake", s: "Aftershock data: 47 events" },
          ].map((m) => (
            <div key={m.t} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
              <div className="w-12 text-[11px] tabular-nums text-white/40">{m.y}</div>
              <div className="flex-1">
                <div className="text-[13px] text-white/90">{m.t}</div>
                <div className="text-[11px] text-white/45">{m.s}</div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-white/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- main ---------- */

export function Dashboard() {
  const [cardOpen, setCardOpen] = useState(true);
  const [memOpen, setMemOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-white">
      {/* subtle vignette + grain */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.7)_100%)]" />

      <TopNav />
      <LiveEvents onSelect={() => setCardOpen(true)} />
      <LayerToggles />
      <AIPanel />
      <MemoryChip onOpen={() => setMemOpen(true)} />
      {cardOpen && <DisasterCard onClose={() => setCardOpen(false)} />}
      <Timeline />
      <ActionBar />
      {memOpen && <MemoryModal onClose={() => setMemOpen(false)} />}

      {/* coord readout — subtle */}
      <div className="pointer-events-none absolute left-1/2 bottom-[88px] z-10 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/25">
        38.26°N · 140.87°E · SECTOR 07-A
      </div>

      {/* unused icons silenced */}
      <span className="hidden">
        <Flame />
        <MapPin />
      </span>
    </div>
  );
}
