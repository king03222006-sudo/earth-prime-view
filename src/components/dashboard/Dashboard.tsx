import { useMemo, useState, type ReactNode } from "react";
import {
  Activity, ArrowRight, Bell, Building2, Check, ChevronRight, CircleAlert, Clipboard, CloudOff,
  Copy, FileDown, FilePlus2, FileText, Globe2, Languages, MapPin, MessageSquare,
  Navigation, Radio, RefreshCw, Search, Send, ShieldCheck, Sparkles, Upload, Users, Wifi,
} from "lucide-react";
import { GlobeClient } from "@/components/globe/GlobeClient";
import { HazardIcon } from "./HazardIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  alertTimeline, demoAnswers, eventFilters, fieldReports, globalEvents, hazardMeta, impactAssessment,
  indiaEvents, officialSources, roleActions, shelters, sourceCitations, suggestedQuestions,
  type DisasterEvent, type HazardType,
} from "@/data/indiaDemoData";
import { cn } from "@/lib/utils";

const primaryHazards: HazardType[] = ["heavy-rain", "flood", "landslide", "cyclone", "wildfire", "lightning", "tsunami", "heatwave"];
const filterKeys: Record<(typeof eventFilters)[number], string> = {
  All: "all", "Official alerts": "official", Weather: "weather", Flood: "flood", Fire: "fire",
  Landslide: "landslide", Coastal: "coastal", "AI estimates": "ai",
};

function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("panel-surface", className)}>{children}</section>;
}

function PanelHeader({ icon: Icon, title, action }: { icon: typeof Activity; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-panel-border px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-primary" />
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-panel-foreground">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function TrustBadge({ children }: { children: ReactNode }) {
  return <Badge variant="outline" className="h-auto border-trust-border bg-trust/10 px-1.5 py-0.5 text-[9px] font-medium text-trust-foreground">{children}</Badge>;
}

function TopBar({ role, onRoleChange, onReport }: { role: keyof typeof roleActions; onRoleChange: (role: keyof typeof roleActions) => void; onReport: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-panel-border bg-background/80 px-3 backdrop-blur-xl md:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10"><Sparkles className="size-4 text-primary" /></div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-foreground">Sentinel WeatherGPT India</h1>
          <p className="truncate text-[9px] uppercase tracking-[0.16em] text-muted-foreground">India-first multi-hazard intelligence</p>
        </div>
      </div>
      <div className="mx-auto hidden max-w-md flex-1 items-center gap-2 rounded-md border border-panel-border bg-panel/70 px-3 py-2 lg:flex">
        <Search className="size-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Search region, alert or source</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-md border border-panel-border bg-panel/60 p-1 sm:flex" aria-label="Select operating role">
          {(Object.keys(roleActions) as (keyof typeof roleActions)[]).map((item) => (
            <Button key={item} size="sm" variant="ghost" onClick={() => onRoleChange(item)} aria-pressed={role === item} className={cn("h-8 px-2 text-[10px]", role === item && "bg-primary/12 text-primary")}>{item}</Button>
          ))}
        </div>
        <div className="hidden items-center gap-1.5 text-[10px] text-muted-foreground md:flex"><span className="status-dot" /> Demo workspace</div>
        <Button size="sm" onClick={onReport} className="h-9 bg-primary/15 px-3 text-primary shadow-none hover:bg-primary/25"><FileText /> <span className="hidden md:inline">Generate Situation Report</span></Button>
      </div>
    </header>
  );
}

function LiveEventsPanel({ events, selectedId, onSelect }: { events: DisasterEvent[]; selectedId: string; onSelect: (id: string) => void }) {
  const [filter, setFilter] = useState<(typeof eventFilters)[number]>("All");
  const visible = filter === "All" ? events : events.filter((event) => event.filters.includes(filterKeys[filter]));
  return (
    <Panel className="min-h-0 overflow-hidden">
      <PanelHeader icon={Activity} title="Live Events" action={<Badge variant="outline" className="border-panel-border text-[9px] text-muted-foreground">Demo data</Badge>} />
      <div className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-panel-border p-2">
        {eventFilters.map((item) => <Button key={item} size="sm" variant="ghost" onClick={() => setFilter(item)} aria-pressed={filter === item} className={cn("h-7 shrink-0 px-2 text-[9px]", filter === item && "bg-secondary text-foreground")}>{item}</Button>)}
      </div>
      <div className="scrollbar-thin max-h-[530px] space-y-1.5 overflow-y-auto p-2 lg:max-h-[calc(100dvh-255px)]">
        {visible.map((event) => {
          const active = event.id === selectedId;
          return (
            <Button key={event.id} variant="ghost" onClick={() => onSelect(event.id)} className={cn("h-auto min-h-20 w-full items-start justify-start whitespace-normal rounded-md border border-transparent p-3 text-left", active ? "border-primary/25 bg-primary/8" : "bg-panel-muted/45 hover:bg-panel-muted")}> 
              <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary", `text-${hazardMeta[event.hazard].tone}`)}><HazardIcon hazard={event.hazard} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2"><span className="font-medium text-foreground">{event.title}</span><span className="text-[9px] text-muted-foreground">{event.updated}</span></span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">{event.region} · {event.district}</span>
                <span className="mt-2 flex flex-wrap items-center gap-1.5"><Badge variant="outline" className="border-panel-border px-1.5 py-0 text-[9px]">{event.source}</Badge><span className="text-[9px] text-foreground">{event.severity}</span><TrustBadge>{event.trust}</TrustBadge></span>
              </span>
            </Button>
          );
        })}
      </div>
    </Panel>
  );
}

function OfficialSourcesPanel() {
  return (
    <Panel>
      <PanelHeader icon={Radio} title="Official Indian Sources" action={<span className="text-[9px] text-muted-foreground">Demo states</span>} />
      <div className="grid grid-cols-2 gap-1.5 p-3">
        {officialSources.map((source) => (
          <Tooltip key={source.name}>
            <TooltipTrigger asChild>
              <button className="flex min-h-12 items-center gap-2 rounded-md border border-panel-border bg-panel-muted/45 px-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className={cn("size-1.5 shrink-0 rounded-full", source.state === "Cached" ? "bg-warning" : source.state === "Reference" ? "bg-muted-foreground" : "status-dot")} />
                <span className="min-w-0"><span className="block truncate text-[10px] font-medium">{source.name}</span><span className="block truncate text-[8px] text-muted-foreground">Demo · {source.state}</span></span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-56 border border-panel-border bg-panel text-panel-foreground"><p>{source.role}</p><p className="mt-1 text-muted-foreground">Last sync {source.sync}</p></TooltipContent>
          </Tooltip>
        ))}
      </div>
    </Panel>
  );
}

function GlobeWorkspace({ events, selected, onSelect, indiaFocus, onIndiaFocus, globalEnabled, onGlobalEnabled, activeHazards, onToggleHazard, showRoutes, onRoutes }: {
  events: DisasterEvent[]; selected: DisasterEvent; onSelect: (id: string) => void; indiaFocus: boolean; onIndiaFocus: (value: boolean) => void;
  globalEnabled: boolean; onGlobalEnabled: (value: boolean) => void; activeHazards: Set<HazardType>; onToggleHazard: (hazard: HazardType) => void; showRoutes: boolean; onRoutes: (value: boolean) => void;
}) {
  return (
    <section className="relative min-h-[560px] overflow-hidden rounded-md border border-panel-border bg-space shadow-2xl lg:min-h-[calc(100dvh-82px)]">
      <GlobeClient events={events} selectedId={selected.id} activeHazards={activeHazards} indiaFocus={indiaFocus} showRoutes={showRoutes} onSelect={onSelect} />
      <div className="pointer-events-none absolute inset-0 bg-globe-vignette" />
      <div className="pointer-events-auto absolute left-3 right-3 top-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-md border border-panel-border bg-panel/75 p-1 backdrop-blur-xl">
          <Button size="sm" variant="ghost" aria-pressed={indiaFocus} onClick={() => onIndiaFocus(!indiaFocus)} className={cn("h-8 px-2 text-[10px]", indiaFocus && "bg-primary/15 text-primary")}><MapPin /> India Focus</Button>
          <Button size="sm" variant="ghost" aria-pressed={globalEnabled} onClick={() => onGlobalEnabled(!globalEnabled)} className={cn("h-8 px-2 text-[10px]", globalEnabled && "bg-secondary")}><Globe2 /> Global Events</Button>
          <Button size="sm" variant="ghost" aria-pressed={showRoutes} onClick={() => onRoutes(!showRoutes)} className={cn("h-8 px-2 text-[10px]", showRoutes && "bg-secondary")}><Navigation /> Routes</Button>
        </div>
        <div className="rounded-md border border-panel-border bg-panel/75 px-2 py-1.5 text-[9px] text-muted-foreground backdrop-blur-xl"><span className="text-primary">INDIA CENTRED</span> · 22.9°N 79.8°E</div>
      </div>
      <div className="pointer-events-auto absolute bottom-20 left-3 right-3 md:right-auto md:w-[330px]">
        <div className="rounded-md border border-panel-border bg-panel/82 p-3 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary", `text-${hazardMeta[selected.hazard].tone}`)}><HazardIcon hazard={selected.hazard} /></span>
            <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h2 className="text-sm font-semibold">{selected.title} · {selected.region}</h2><Badge variant="outline" className="border-panel-border text-[9px]">{selected.severity}</Badge></div><p className="mt-1 text-[10px] text-muted-foreground">{selected.district} · {selected.source} · {selected.updated}</p></div>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-foreground/75">{selected.summary}</p>
          <div className="mt-2 flex items-center justify-between"><TrustBadge>{selected.trust}</TrustBadge><span className="text-[9px] text-muted-foreground">Demo data</span></div>
        </div>
      </div>
      <div className="pointer-events-auto absolute inset-x-3 bottom-3 rounded-md border border-panel-border bg-panel/80 p-2 backdrop-blur-xl">
        <div className="mb-1.5 flex items-center justify-between"><span className="text-[9px] font-semibold tracking-[0.14em]">INDIA HAZARD LAYERS</span><span className="text-[8px] text-muted-foreground">Select to show / hide</span></div>
        <div className="scrollbar-thin flex gap-1 overflow-x-auto">
          {primaryHazards.map((hazard) => {
            const active = activeHazards.has(hazard);
            return <Button key={hazard} size="sm" variant="ghost" aria-pressed={active} onClick={() => onToggleHazard(hazard)} className={cn("h-8 shrink-0 px-2 text-[9px]", active ? "bg-secondary text-foreground" : "text-muted-foreground opacity-55")}><HazardIcon hazard={hazard} className={`text-${hazardMeta[hazard].tone}`} />{hazardMeta[hazard].label}</Button>;
          })}
        </div>
      </div>
    </section>
  );
}

function WeatherGPTPanel({ onReport }: { onReport: () => void }) {
  const [question, setQuestion] = useState(suggestedQuestions[0]);
  const [answer, setAnswer] = useState(demoAnswers[suggestedQuestions[0]]);
  const submit = () => {
    const normalized = question.trim();
    if (!normalized) return;
    setAnswer(demoAnswers[normalized] ?? "This local demo can answer the suggested India hazard questions. A connected WeatherGPT service can replace this response later.");
  };
  return (
    <Panel>
      <PanelHeader icon={MessageSquare} title="WeatherGPT" action={<span className="flex items-center gap-1 text-[9px] text-primary"><span className="status-dot" /> Demo online</span>} />
      <div className="p-3">
        <div className="scrollbar-thin flex gap-1 overflow-x-auto pb-2">
          {suggestedQuestions.map((item) => <Button key={item} variant="outline" size="sm" onClick={() => { setQuestion(item); setAnswer(demoAnswers[item]); }} className="h-auto max-w-44 shrink-0 whitespace-normal border-panel-border bg-panel-muted/50 px-2 py-1.5 text-left text-[9px] leading-snug">{item}</Button>)}
        </div>
        <div className="space-y-2" aria-live="polite">
          <div className="ml-7 rounded-md bg-secondary px-3 py-2 text-[10px] text-foreground">{question}</div>
          <div className="mr-4 rounded-md border border-primary/15 bg-primary/5 p-3"><div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-primary"><Sparkles className="size-3" /> WeatherGPT</div><p className="text-[11px] leading-relaxed text-foreground/80">{answer}</p><div className="mt-2 flex flex-wrap gap-1">{sourceCitations.map((item) => <Badge key={item} variant="outline" className="border-panel-border px-1.5 py-0 text-[8px]">{item}</Badge>)}</div><p className="mt-2 text-[9px] text-warning">AI-assisted summary. Follow official agency instructions.</p></div>
        </div>
        <div className="mt-2 flex gap-2"><Input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} aria-label="Ask WeatherGPT" className="h-9 border-panel-border bg-panel-muted text-xs" /><Button size="icon" onClick={submit} aria-label="Send question" className="size-9 shrink-0"><Send /></Button></div>
        {question === suggestedQuestions[5] && <Button size="sm" variant="outline" onClick={onReport} className="mt-2 w-full border-panel-border text-[10px]"><FileText /> Open preview report</Button>}
      </div>
    </Panel>
  );
}

function ImpactPanel() {
  return <Panel><PanelHeader icon={Activity} title="Impact Assessment" action={<TrustBadge>AI-assisted estimate</TrustBadge>} /><div className="grid grid-cols-2 gap-px bg-panel-border sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-3">{impactAssessment.map((metric) => <div key={metric.label} className="bg-panel px-3 py-2.5"><div className="text-base font-semibold tabular-nums text-foreground">{metric.value}</div><div className="text-[9px] text-muted-foreground">{metric.label}</div></div>)}</div><p className="border-t border-panel-border p-3 text-[9px] leading-relaxed text-muted-foreground">Based on official alert severity, forecast context, mapped infrastructure and population exposure. Not an official warning.</p></Panel>;
}

function SheltersPanel() {
  return (
    <Panel>
      <PanelHeader icon={Building2} title="Verified Shelters" action={<span className="text-[9px] text-primary">12 relief centres</span>} />
      <div className="grid grid-cols-2 gap-px border-b border-panel-border bg-panel-border text-[9px]"><div className="bg-panel p-2"><span className="text-muted-foreground">Estimated capacity</span><strong className="mt-0.5 block text-sm">6,850</strong></div><div className="bg-panel p-2"><span className="text-muted-foreground">Status</span><strong className="mt-0.5 block text-sm text-primary">Operational</strong></div></div>
      <div className="space-y-1.5 p-2">{shelters.map((shelter) => <div key={shelter.id} className="rounded-md border border-panel-border bg-panel-muted/40 p-2"><div className="flex items-start justify-between gap-2"><div><div className="text-[10px] font-medium">{shelter.name}</div><div className="mt-0.5 text-[9px] text-muted-foreground">{shelter.distance} · capacity {shelter.capacity}</div></div><TrustBadge>{shelter.status}</TrustBadge></div><div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[8px] text-muted-foreground"><span>Access: {shelter.accessibility}</span><span>Medical: {shelter.medical}</span><span>Water: {shelter.water}</span><span>Verified: {shelter.verified}</span></div><Button size="sm" variant="ghost" className="mt-1 h-7 w-full justify-between text-[9px]">View route <ArrowRight /></Button></div>)}</div>
    </Panel>
  );
}

function LifecyclePanel() {
  return <Panel><PanelHeader icon={RefreshCw} title="Alert Timeline" /><ol className="space-y-0 p-3">{alertTimeline.map((item, index) => <li key={item.stage} className="relative flex gap-3 pb-4 last:pb-0"><div className="flex w-4 justify-center"><span className={cn("relative z-10 mt-1 size-2 rounded-full", item.state === "active" ? "bg-warning ring-4 ring-warning/10" : "bg-primary")}/>{index < alertTimeline.length - 1 && <span className="absolute bottom-0 top-3 w-px bg-panel-border" />}</div><div><div className="flex items-center gap-2"><span className="text-[10px] font-medium">{item.stage}</span><span className="text-[8px] text-muted-foreground">{item.time}</span></div><p className="mt-0.5 text-[9px] text-muted-foreground">{item.detail}</p></div></li>)}</ol></Panel>;
}

function RoleAndLanguage({ role, onRoleChange }: { role: keyof typeof roleActions; onRoleChange: (role: keyof typeof roleActions) => void }) {
  const [language, setLanguage] = useState("English");
  return (
    <Panel>
      <PanelHeader icon={Languages} title="Language & Offline Readiness" />
      <div className="p-3">
        <div className="flex flex-wrap gap-1">{["English", "हिन्दी", "অসমীয়া", "ଓଡ଼ିଆ"].map((item) => <Button key={item} size="sm" variant="ghost" aria-pressed={language === item} onClick={() => setLanguage(item)} className={cn("h-8 px-2 text-[10px]", language === item && "bg-secondary text-primary")}>{item}</Button>)}</div>
        <p className="mt-2 text-[9px] text-muted-foreground">Sample labels only · full translation not enabled</p>
        <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[8px]"><div className="rounded-md bg-primary/8 p-2 text-primary"><Wifi className="mx-auto mb-1 size-3" />Live mode</div><div className="rounded-md bg-secondary p-2"><CloudOff className="mx-auto mb-1 size-3" />Cached mode</div><div className="rounded-md bg-warning/8 p-2 text-warning"><CircleAlert className="mx-auto mb-1 size-3" />Warning ready</div></div>
        <p className="mt-2 text-[9px] text-muted-foreground">Offline cache synced 2 min ago</p>
        <div className="mt-3 border-t border-panel-border pt-3 sm:hidden"><Label className="text-[9px]">Operating role</Label><div className="mt-1 flex flex-wrap gap-1">{(Object.keys(roleActions) as (keyof typeof roleActions)[]).map((item) => <Button key={item} size="sm" variant="ghost" onClick={() => onRoleChange(item)} className={cn("h-8 px-2 text-[9px]", role === item && "bg-secondary text-primary")}>{item}</Button>)}</div></div>
      </div>
    </Panel>
  );
}

function RoleActions({ role, onReport, onFieldReport }: { role: keyof typeof roleActions; onReport: () => void; onFieldReport: () => void }) {
  return <Panel><PanelHeader icon={Users} title={`${role} Actions`} /><div className="grid grid-cols-2 gap-1.5 p-3">{roleActions[role].map((action) => <Button key={action} variant="outline" size="sm" onClick={action.includes("report") ? (action.includes("situation") ? onReport : onFieldReport) : undefined} className="h-auto min-h-10 justify-between whitespace-normal border-panel-border bg-panel-muted/40 px-2 text-left text-[9px]">{action}<ChevronRight /></Button>)}</div></Panel>;
}

function FieldReportsPanel({ onAdd }: { onAdd: () => void }) {
  return (
    <Panel className="xl:col-span-2"><PanelHeader icon={Clipboard} title="Field Reports" action={<Button size="sm" variant="ghost" onClick={onAdd} className="h-7 text-[9px]"><FilePlus2 /> Add Photo / Report</Button>} /><div className="grid gap-2 p-3 md:grid-cols-3">{fieldReports.map((report) => <button key={report.id} className="group flex min-h-24 items-center gap-3 rounded-md border border-panel-border bg-panel-muted/40 p-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className={cn("flex size-16 shrink-0 items-center justify-center rounded-md bg-report-pattern", `report-${report.image}`)}><MapPin className="size-5 text-foreground/70" /></span><span className="min-w-0 flex-1"><span className="block text-[10px] font-medium">{report.type}</span><span className="mt-1 block text-[9px] text-muted-foreground">{report.location}</span><span className="mt-2 flex items-center justify-between"><TrustBadge>{report.status}</TrustBadge><span className="text-[8px] text-muted-foreground">{report.time}</span></span></span><ChevronRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></button>)}</div></Panel>
  );
}

function ReportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const [submitted, setSubmitted] = useState(false);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90dvh] overflow-y-auto border-panel-border bg-panel text-panel-foreground"><DialogHeader><DialogTitle>Submit a field report</DialogTitle><DialogDescription>Frontend demo only. Reports are not uploaded or sent to authorities.</DialogDescription></DialogHeader>{submitted ? <div className="rounded-md border border-primary/20 bg-primary/5 p-4 text-sm"><Check className="mb-2 size-5 text-primary" />Demo report queued for verification locally.</div> : <div className="grid gap-4"><div><Label htmlFor="report-type">Report type</Label><Input id="report-type" placeholder="Blocked road, rising water…" className="mt-1 border-panel-border" /></div><div><Label htmlFor="report-location">Location</Label><Input id="report-location" placeholder="District, landmark or road" className="mt-1 border-panel-border" /></div><div><Label htmlFor="report-description">Description</Label><Textarea id="report-description" placeholder="Describe what you observed" className="mt-1 border-panel-border" /></div><button className="flex min-h-28 flex-col items-center justify-center rounded-md border border-dashed border-panel-border bg-panel-muted/40 text-xs text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Upload className="mb-2 size-5" />Upload image area · demo only</button></div>}<DialogFooter>{!submitted && <Button onClick={() => setSubmitted(true)}><ShieldCheck /> Submit for verification</Button>}</DialogFooter></DialogContent></Dialog>;
}

function SituationReportDialog({ open, onOpenChange, event }: { open: boolean; onOpenChange: (value: boolean) => void; event: DisasterEvent }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(`Sentinel preview report: ${event.title}, ${event.region}. ${event.summary}`); setCopied(true); };
  const sections = [
    ["Selected region", `${event.region} · ${event.district}`], ["Hazard type", hazardMeta[event.hazard].label], ["Official alerts", `${event.source} · ${event.updated}`],
    ["Forecast summary", event.summary], ["Affected districts", "Kamrup Metropolitan, Goalpara and nearby low-lying areas"], ["Population exposure", "1.2M · AI-assisted estimate"],
    ["Hospitals and shelters", "12 hospitals nearby · 12 relief centres · capacity estimate 6,850"], ["Field reports", "Blocked road, rising water and slope crack reports under review"],
    ["Recommended actions", "Monitor official alerts, verify local road access, pre-position rescue and medical teams, publish shelter status."], ["Sources and timestamps", sourceCitations.join(" · ")],
    ["Limitations", "Preview report using demo and cached frontend data. Live occupancy and ground verification are unavailable."],
  ];
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto border-panel-border bg-panel text-panel-foreground"><DialogHeader><div className="flex items-center gap-2"><DialogTitle>Situation Report</DialogTitle><TrustBadge>Preview report</TrustBadge></div><DialogDescription>Generated locally from the selected demo event and displayed context.</DialogDescription></DialogHeader><div className="grid gap-px overflow-hidden rounded-md border border-panel-border bg-panel-border sm:grid-cols-2">{sections.map(([label, value]) => <div key={label} className="bg-panel p-3"><div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div><p className="mt-1 text-[11px] leading-relaxed">{value}</p></div>)}</div><DialogFooter><Button variant="outline" disabled title="PDF export requires backend integration"><FileDown /> Export PDF · placeholder</Button><Button variant="outline" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy report"}</Button><Button onClick={() => onOpenChange(false)}>Close</Button></DialogFooter></DialogContent></Dialog>;
}

export function Dashboard() {
  const [selectedId, setSelectedId] = useState(indiaEvents[0].id);
  const [indiaFocus, setIndiaFocus] = useState(true);
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [activeHazards, setActiveHazards] = useState<Set<HazardType>>(new Set(primaryHazards));
  const [role, setRole] = useState<keyof typeof roleActions>("District Officer");
  const [reportOpen, setReportOpen] = useState(false);
  const [situationOpen, setSituationOpen] = useState(false);
  const events = useMemo(() => globalEnabled ? [...indiaEvents, ...globalEvents] : indiaEvents, [globalEnabled]);
  const selected = events.find((event) => event.id === selectedId) ?? indiaEvents[0];
  const toggleHazard = (hazard: HazardType) => setActiveHazards((previous) => { const next = new Set(previous); if (next.has(hazard)) next.delete(hazard); else next.add(hazard); return next; });

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-dvh bg-background text-foreground">
        <TopBar role={role} onRoleChange={setRole} onReport={() => setSituationOpen(true)} />
        <div className="grid gap-2 p-2 lg:grid-cols-[280px_minmax(520px,1fr)_320px]">
          <div className="order-2 space-y-2 lg:order-1"><LiveEventsPanel events={events} selectedId={selected.id} onSelect={setSelectedId} /><OfficialSourcesPanel /></div>
          <div className="order-1 lg:order-2"><GlobeWorkspace events={events} selected={selected} onSelect={setSelectedId} indiaFocus={indiaFocus} onIndiaFocus={setIndiaFocus} globalEnabled={globalEnabled} onGlobalEnabled={setGlobalEnabled} activeHazards={activeHazards} onToggleHazard={toggleHazard} showRoutes={showRoutes} onRoutes={setShowRoutes} /></div>
          <div className="order-3 space-y-2"><WeatherGPTPanel onReport={() => setSituationOpen(true)} /><ImpactPanel /><RoleActions role={role} onReport={() => setSituationOpen(true)} onFieldReport={() => setReportOpen(true)} /></div>
        </div>
        <div className="grid gap-2 px-2 pb-2 xl:grid-cols-4"><SheltersPanel /><LifecyclePanel /><RoleAndLanguage role={role} onRoleChange={setRole} /><FieldReportsPanel onAdd={() => setReportOpen(true)} /></div>
        <ReportDialog open={reportOpen} onOpenChange={setReportOpen} />
        <SituationReportDialog open={situationOpen} onOpenChange={setSituationOpen} event={selected} />
      </div>
    </TooltipProvider>
  );
}