export type HazardType =
  | "heavy-rain"
  | "flood"
  | "landslide"
  | "cyclone"
  | "wildfire"
  | "lightning"
  | "tsunami"
  | "heatwave"
  | "earthquake"
  | "avalanche";

export type TrustLabel =
  | "Official warning"
  | "Official observation"
  | "Satellite detection"
  | "Historical risk"
  | "AI-assisted estimate"
  | "Field report"
  | "Mapped facility"
  | "Verified facility";

export type Severity = "Critical" | "High" | "Moderate" | "Low";

export interface DisasterEvent {
  id: string;
  title: string;
  hazard: HazardType;
  region: string;
  district: string;
  lat: number;
  lng: number;
  severity: Severity;
  source: string;
  updated: string;
  trust: TrustLabel;
  summary: string;
  official: boolean;
  filters: string[];
  global?: boolean;
}

export const hazardMeta: Record<HazardType, { label: string; tone: string; color: string }> = {
  "heavy-rain": { label: "Heavy Rain", tone: "hazard-rain", color: "#38bdf8" },
  flood: { label: "Flood", tone: "hazard-flood", color: "#22d3ee" },
  landslide: { label: "Landslide", tone: "hazard-landslide", color: "#fbbf24" },
  cyclone: { label: "Cyclone", tone: "hazard-cyclone", color: "#f43f8c" },
  wildfire: { label: "Wildfire", tone: "hazard-fire", color: "#fb923c" },
  lightning: { label: "Lightning", tone: "hazard-lightning", color: "#fde047" },
  tsunami: { label: "Tsunami", tone: "hazard-tsunami", color: "#c084fc" },
  heatwave: { label: "Heatwave", tone: "hazard-heat", color: "#a3e635" },
  earthquake: { label: "Earthquake", tone: "hazard-quake", color: "#f472b6" },
  avalanche: { label: "Avalanche", tone: "hazard-snow", color: "#bae6fd" },
};

export const indiaEvents: DisasterEvent[] = [
  { id: "assam-flood", title: "Flood", hazard: "flood", region: "Assam", district: "Guwahati & Goalpara", lat: 26.14, lng: 91.74, severity: "High", source: "CWC / SACHET", updated: "8 min ago", trust: "Official warning", official: true, filters: ["official", "weather", "flood"], summary: "River levels are rising alongside continued heavy rainfall. Localised flooding remains likely in low-lying wards." },
  { id: "odisha-rain", title: "Heavy Rain", hazard: "heavy-rain", region: "Odisha", district: "Puri & Khordha", lat: 20.12, lng: 85.83, severity: "High", source: "IMD / SACHET", updated: "14 min ago", trust: "Official warning", official: true, filters: ["official", "weather", "coastal"], summary: "Intense rainfall bands are affecting the Odisha coast with waterlogging and transport disruption possible." },
  { id: "uttarakhand-slide", title: "Landslide Risk", hazard: "landslide", region: "Uttarakhand", district: "Chamoli", lat: 30.4, lng: 79.32, severity: "Moderate", source: "ISRO Bhuvan / AI Estimate", updated: "22 min ago", trust: "AI-assisted estimate", official: false, filters: ["landslide", "ai"], summary: "Slope saturation and recent rainfall indicate elevated landslide susceptibility along exposed mountain roads." },
  { id: "maharashtra-fire", title: "Forest Fire", hazard: "wildfire", region: "Maharashtra", district: "Nashik", lat: 19.99, lng: 73.79, severity: "Moderate", source: "FSI / Satellite Detection", updated: "31 min ago", trust: "Satellite detection", official: false, filters: ["fire"], summary: "A satellite thermal anomaly is under review. Ground confirmation has not yet been received." },
  { id: "bay-cyclone", title: "Cyclone Watch", hazard: "cyclone", region: "Bay of Bengal", district: "East-central Bay", lat: 15.2, lng: 88.4, severity: "High", source: "IMD / SACHET", updated: "42 min ago", trust: "Official observation", official: true, filters: ["official", "weather", "coastal"], summary: "A monitored low-pressure system may intensify. Coastal districts should continue to follow IMD advisories." },
  { id: "bengal-lightning", title: "Lightning", hazard: "lightning", region: "West Bengal", district: "Kolkata & South 24 Parganas", lat: 22.57, lng: 88.36, severity: "Moderate", source: "IMD / SACHET", updated: "51 min ago", trust: "Official warning", official: true, filters: ["official", "weather"], summary: "Thunderstorm cells may produce frequent lightning and short periods of intense rain." },
  { id: "kerala-rain", title: "Heavy Rain", hazard: "heavy-rain", region: "Kerala", district: "Wayanad", lat: 11.69, lng: 76.13, severity: "Moderate", source: "IMD", updated: "1 hr ago", trust: "Official observation", official: true, filters: ["official", "weather"], summary: "Persistent rainfall may increase runoff and local slope instability." },
  { id: "andaman-tsunami", title: "Tsunami Readiness", hazard: "tsunami", region: "Andaman & Nicobar", district: "Port Blair", lat: 11.62, lng: 92.73, severity: "Low", source: "INCOIS", updated: "2 hr ago", trust: "Historical risk", official: false, filters: ["coastal"], summary: "No active warning. Historical exposure layer is shown for preparedness planning." },
];

// TODO: Adapt the existing USGS / NASA EONET response here when a frontend API is available.
export const globalEvents: DisasterEvent[] = [
  { id: "global-usgs", title: "Earthquake", hazard: "earthquake", region: "Japan", district: "Honshu offshore", lat: 38.26, lng: 140.87, severity: "Moderate", source: "USGS enrichment", updated: "Cached 3 hr ago", trust: "Official observation", official: true, global: true, filters: ["official"], summary: "Cached global enrichment example. Connect the existing USGS adapter when available." },
  { id: "global-eonet", title: "Wildfire", hazard: "wildfire", region: "Australia", district: "Northern Territory", lat: -19.5, lng: 133.2, severity: "Low", source: "NASA EONET enrichment", updated: "Cached 5 hr ago", trust: "Satellite detection", official: false, global: true, filters: ["fire"], summary: "Cached global enrichment example. This is not a live incident feed." },
];

export const eventFilters = ["All", "Official alerts", "Weather", "Flood", "Fire", "Landslide", "Coastal", "AI estimates"] as const;

export const officialSources = [
  { name: "SACHET", state: "Connected", sync: "10:32 IST", role: "Geo-targeted official disaster alerts", demo: true },
  { name: "NDMA", state: "Reference", sync: "10:32 IST", role: "National disaster guidance and protocols", demo: true },
  { name: "IMD", state: "Connected", sync: "10:30 IST", role: "Weather forecasts and warnings", demo: true },
  { name: "CWC", state: "Connected", sync: "10:25 IST", role: "River levels and flood forecasting", demo: true },
  { name: "INCOIS", state: "Cached", sync: "09:55 IST", role: "Ocean and tsunami advisory context", demo: true },
  { name: "FSI", state: "Connected", sync: "10:18 IST", role: "Forest fire satellite detections", demo: true },
  { name: "ISRO Bhuvan", state: "Connected", sync: "10:20 IST", role: "Satellite maps and hazard layers", demo: true },
  { name: "OpenStreetMap", state: "Connected", sync: "10:29 IST", role: "Mapped roads, hospitals and facilities", demo: true },
];

export const impactAssessment = [
  { label: "Affected population", value: "1.2M" },
  { label: "Hospitals nearby", value: "12" },
  { label: "Roads affected", value: "48 km" },
  { label: "Schools affected", value: "36" },
  { label: "Confidence", value: "78%" },
];

export const shelters = [
  { id: "s1", name: "Guwahati Commerce College Relief Centre", status: "Verified", distance: "2.4 km", capacity: "1,200", accessibility: "Good", medical: "Available", water: "Available", verified: "10:12 IST" },
  { id: "s2", name: "Sonaram HS School", status: "Mapped facility", distance: "4.1 km", capacity: "850 est.", accessibility: "Partial", medical: "First aid", water: "Mapped", verified: "09:48 IST" },
  { id: "s3", name: "Pandu Community Hall", status: "Status unknown", distance: "6.8 km", capacity: "Unknown", accessibility: "Unknown", medical: "Unknown", water: "Unknown", verified: "Not verified" },
];

export const fieldReports = [
  { id: "r1", type: "Blocked Road", location: "NH-27, Goalpara, Assam", time: "9 min ago", status: "Field report", image: "road" },
  { id: "r2", type: "Rising Water", location: "Brahmaputra, Guwahati", time: "16 min ago", status: "Verified facility", image: "water" },
  { id: "r3", type: "Slope Crack", location: "NH-15, Tezpur", time: "28 min ago", status: "AI-assisted estimate", image: "slope" },
];

export const alertTimeline = [
  { stage: "Issued", time: "10:15 IST", detail: "Heavy rain alert received for Assam", state: "completed" },
  { stage: "Verified", time: "10:28 IST", detail: "Cross-checked with IMD and CWC", state: "completed" },
  { stage: "Escalated", time: "10:45 IST", detail: "District authorities notified", state: "completed" },
  { stage: "Ongoing", time: "Next review in 30 minutes", detail: "Monitoring river levels and field reports", state: "active" },
] as const;

export const roleActions = {
  Citizen: ["View alerts", "Find safe shelter", "Get safety instructions", "Share field report"],
  "District Officer": ["Review impact", "Verify reports", "Generate situation report", "Escalate alert"],
  "Rescue Team": ["View blocked roads", "Find hospitals", "Deploy resources", "Open evacuation routes"],
} as const;

export const suggestedQuestions = [
  "What is the risk near Guwahati in the next 6 hours?",
  "Show active official alerts in Odisha.",
  "Find shelters near this flood zone.",
  "Which roads should rescue teams avoid?",
  "Is this wildfire officially verified?",
  "Generate a situation report for Assam.",
];

export const demoAnswers: Record<string, string> = {
  "What is the risk near Guwahati in the next 6 hours?": "Heavy-rain and localised-flood risk is high near Guwahati. SACHET/NDMA has an official alert, CWC indicates rising river levels, and the forecast layer shows continued rainfall. Twelve mapped relief centres are nearby, but live occupancy is unavailable.",
  "Show active official alerts in Odisha.": "A high-severity heavy-rain alert is shown for Puri and Khordha from IMD / SACHET. This dashboard is using demo data; follow the agencies’ published instructions.",
  "Find shelters near this flood zone.": "Twelve relief centres are mapped nearby. One demo facility is marked verified, one is mapped only, and one has unknown operating status.",
  "Which roads should rescue teams avoid?": "The demo field layer flags NH-27 near Goalpara and 48 km of potentially affected roads. Verify closure status with district authorities before dispatch.",
  "Is this wildfire officially verified?": "No. The Maharashtra event is shown as a satellite detection awaiting ground confirmation.",
  "Generate a situation report for Assam.": "A preview situation report is ready with official alerts, exposure, shelters, field reports, recommended actions, sources, and limitations.",
};

export const sourceCitations = ["SACHET — 10:32 IST", "IMD — 10:30 IST", "CWC — 10:25 IST", "ISRO Bhuvan — 10:20 IST"];