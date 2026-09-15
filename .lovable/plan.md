# Sentinel WeatherGPT India frontend redesign

## Goal
Transform the existing single-screen Sentinel command centre into an India-first, conversational multi-hazard disaster intelligence experience while preserving the cinematic 3D Earth, visual identity, smooth motion, and current global visual layers.

## Build plan

### 1. Establish typed demo data and shared visual language
- Add one dedicated frontend data module for Indian events, source states, hazard metadata, shelters, field reports, impact metrics, chat content, lifecycle stages, role actions, and situation-report content.
- Mark every mocked or estimated item with explicit trust labels such as `Demo data`, `Cached data`, `AI-assisted estimate`, and the requested source/trust badges.
- Extend the existing semantic color tokens for hazard, trust, panel, and status roles; keep the current dark glass command-centre aesthetic.
- Reuse the installed Lucide library and existing shadcn controls rather than adding dependencies.

### 2. Make the globe India-first and interactive
- Start the camera focused on India and keep the existing Earth shader, atmosphere, clouds, stars, routes, and satellite performance optimizations.
- Replace generic markers with typed India hazard markers and risk overlays for Assam, Odisha coast, Uttarakhand, Maharashtra, Kerala, West Bengal, Bay of Bengal, and Andaman & Nicobar.
- Add a subtle India outline plus labels for relevant states/regions.
- Add clickable and keyboard-reachable HTML marker controls with hover/focus tooltips, hazard icons, source, severity, update time, and trust status.
- Emphasize the selected event with a stronger pulse, expanding impact rings, and source-link arcs.
- Wire `India Focus`, `Global Events`, route visibility, and hazard-layer toggles to the rendered globe instead of keeping them decorative.
- Retain existing global demo events as an optional filter because no active USGS/EONET frontend integration is present in the current project; add a clear TODO at the adapter boundary for the existing API response when it becomes available.

### 3. Recompose the command centre
- Replace the monolithic overlay with focused components while retaining one coordinated dashboard state.
- Desktop: compact event rail on the left, globe in the centre, WeatherGPT/action intelligence rail on the right, and a dense but readable operations band below.
- Tablet: globe first, then stacked event and WeatherGPT panels.
- Mobile: tabbed/accordion panels, horizontally scrollable hazard legend, persistent selected-event access, and no horizontal overflow.
- Add the India-focused event filters and event cards, an event detail panel, official Indian sources, and the interactive hazard legend.

### 4. Add operational intelligence panels
- Build WeatherGPT with suggested prompts, the supplied Guwahati conversation, cited timestamps, trust labels, disclaimer, and local demo replies with visible demo-state messaging.
- Add Impact Assessment, Verified Shelters, the vertical alert lifecycle timeline, and role-based suggested actions.
- Add Language & Offline Readiness with selectable sample-language state and honest live/cached/connection indicators.
- Keep all content clear about what is official, mapped, estimated, cached, or unverified.

### 5. Add reports and dialogs
- Add Field Reports with local thumbnails, status labels, locations, timestamps, and detail affordances.
- Add an accessible frontend-only report dialog with report type, description, location, image drop area, and submit-for-verification demo behavior.
- Add an accessible situation-report dialog containing the requested operational sections, `Preview report` labeling, working copy action, and an explicitly placeholder PDF export action.
- Use existing Dialog, Button, Tooltip, Tabs, inputs, and focus styles for keyboard and screen-reader support.

### 6. Accessibility, motion, metadata, and verification
- Add accessible names, text alongside color, visible focus states, tooltips, 44px primary touch targets, and reduced-motion alternatives.
- Update the page title and social metadata for Sentinel WeatherGPT India.
- Verify the main flows and visual layout at desktop and mobile sizes: event selection, globe toggles, hazard layers, chat, roles, language, report submission, shelter actions, and situation report.
- Check for runtime errors and confirm the globe remains visible, correctly framed on India, and performant.

## Technical notes
- Frontend only: no server functions, API changes, database work, credentials, or integration changes.
- Shared selected-event and layer state will live at the dashboard/page composition level and be passed into the globe.
- The globe interaction layer will use `@react-three/drei` HTML overlays and existing Three.js geometry; no new large package is needed.
- Demo data remains isolated so a future API adapter can replace it without restructuring the interface.
