export type Mode = "artist" | "venue";

export interface Song {
  id: string;
  kind: "song" | "pause" | "encore" | "separator";
  title: string;
  duration: string; // MM:SS
  key: string;
  bpm: string;
  notes: string;
}

export interface Channel {
  label: string;
  mic: string;
  phantom: boolean;
  stand: "Short" | "Tall" | "Boom" | "—";
  notes: string;
}

export interface StageEl {
  id: string;
  type: string;
  x: number; // px, multiple of GRID
  y: number; // px, multiple of GRID
  channels: Channel[];
  w?: number; // px, default 40
  h?: number; // px, default 40
  label?: string;
  rot?: 0 | 90 | 180 | 270;
  color?: BadgeColor;
  badge?: string;
  name?: string;
}

export type BadgeColor = "mode" | "mode2" | "ok" | "warn" | "danger" | "neutral";
export const BADGE_COLORS: BadgeColor[] = ["mode", "mode2", "ok", "warn", "danger", "neutral"];

export const STAGE_LEGEND: Record<string, string> = {
  DR: "Drums / Schlagzeug",
  LV: "Lead Vocal / Hauptgesang",
  BV: "Backing Vocal / Begleitgesang",
  GT: "Guitar Amp / Gitarrenverstärker",
  BS: "Bass Amp / Bassverstärker",
  KY: "Keyboards / Synthesizer",
  DI: "DI-Box / Direct Input",
  WG: "Monitor-Wedge (Bodenmonitor)",
  IEM: "In-Ear Monitoring Station",
  DJ: "DJ-Setup / Decks",
  "230V": "Schuko / Hausstrom-Steckdose",
};

/** On-canvas box for a stage element; 90°/270° swap width and height. */
export function stageElSize(el: Pick<StageEl, "w" | "h" | "rot">): { w: number; h: number } {
  const w = Math.max(40, el.w ?? 40);
  const h = Math.max(40, el.h ?? 40);
  return el.rot === 90 || el.rot === 270 ? { w: h, h: w } : { w, h };
}

export const nextRot = (r: StageEl["rot"]): NonNullable<StageEl["rot"]> => (((r ?? 0) + 90) % 360) as NonNullable<StageEl["rot"]>;

export interface VenueNode {
  id: string;
  type: string;
  x: number;
  y: number;
  wM?: number; // width in meters (stage uses venue.stageW instead)
  dM?: number; // depth in meters (stage uses venue.stageD instead)
  label?: string;
  rot?: boolean; // rotated 90°
  seats?: number | undefined; // manual seat count override (seating only)
  density?: SeatDensity;
  aisle?: AisleMode;
  specField?: VenueTechField | null; // undefined uses the type's default; null is unlinked
  model?: string;
  quantity?: string;
  techInfo?: string;
}

export interface MonitorMix {
  id: string;
  name: string;
  type: "IEM" | "Wedge";
  feed: string;
}

export interface ArtistState {
  name: string;
  songs: Song[];
  stage: StageEl[];
  mixes: MonitorMix[];
  power: string;
  schukoOutlets?: number | undefined; // undefined: count stage markers
  schukoCircuits?: number | undefined; // declared independently, not inferred from sockets
  separatePower?: boolean;
  inputChannels?: ArtistInput[];
}

export interface ArtistInput extends Channel { id: string; stageId?: string }

export function artistInputs(a: ArtistState): ArtistInput[] {
  return a.inputChannels ?? a.stage.flatMap((el) => el.channels.map((channel, i) => ({ ...channel, id: `${el.id}:${i}`, stageId: el.id })));
}

export function addArtistStage(a: ArtistState, element: StageEl): ArtistState {
  const next = { ...a, stage: [...a.stage, element] };
  if (a.inputChannels) next.inputChannels = [...a.inputChannels, ...element.channels.map((channel) => ({ ...channel, id: uid(), stageId: element.id }))];
  return next;
}

export function reorderInputs(rows: ArtistInput[], from: string, to: string): ArtistInput[] {
  const start = rows.findIndex((row) => row.id === from);
  const end = rows.findIndex((row) => row.id === to);
  if (start < 0 || end < 0 || start === end) return rows;
  const next = [...rows];
  const [row] = next.splice(start, 1);
  if (!row) return rows;
  next.splice(end, 0, row);
  return next;
}

export function stageLegendEntries(stage: StageEl[] = []): [string, string][] {
  const entries = Object.entries(STAGE_LEGEND);
  for (const el of stage) if (el.badge && el.name && !entries.some(([code, name]) => code === el.badge && name === el.name)) entries.push([el.badge, el.name]);
  return entries;
}

export function createCustomStage(badge: string, name: string): StageEl | null {
  const code = badge.trim().toUpperCase();
  if (!code || code.length > 4 || !name.trim()) return null;
  return { id: uid(), type: "custom", badge: code, name: name.trim(), x: GRID, y: GRID, channels: [] };
}

export interface VenueState {
  name: string;
  nodes: VenueNode[];
  stageW: string;
  stageD: string;
  stageH: string;
  capStanding: string;
  capSeated: string;
  pa: string;
  foh: string;
  monitors: string;
  snake: string;
  rigging: string;
  lightConsole: string;
  dimmerCity?: string;
  fixtures: string;
  doorW: string;
  doorH: string;
  access: "Ebenerdig / Rampe" | "Lastenaufzug" | "Treppe";
  parking: string;
  curfew: string;
  roomL?: string; // Raumlänge (m), horizontal on the plan
  roomW?: string; // Raumbreite (m), vertical on the plan
  roomH?: string; // Raumhöhe (m)
  shape?: RoomShape;
}

export type RoomShape = "rect" | "L" | "tunnel" | "arena";
export const ROOM_SHAPES: { id: RoomShape; label: string; preset?: { L: string; W: string } }[] = [
  { id: "rect", label: "Rechteck (Standard)" },
  { id: "L", label: "L-Form (Winkel)" },
  { id: "tunnel", label: "Schlauch / Lang (Tunnel / Narrow)", preset: { L: "48", W: "12" } },
  { id: "arena", label: "Arena / Quadratisch" },
];

export interface Rect { x: number; y: number; w: number; h: number }

const meters = (v: string | undefined, fallback: number, min: number, max: number) => {
  const n = Number(String(v ?? "").replace(",", "."));
  return Math.min(max, Math.max(min, Number.isFinite(n) && n > 0 ? n : fallback));
};

/** Room footprint in px (1 m = GRID) plus an optional blocked cut-out for the L-shape. Arena forces a square. */
export function roomGeometry(v: Pick<VenueState, "roomL" | "roomW" | "shape">): { w: number; h: number; cut: Rect | null } {
  let L = meters(v.roomL, 32, 8, 120);
  let W = meters(v.roomW, 20, 6, 120);
  if (v.shape === "arena") L = W = Math.max(L, W);
  const w = Math.round(L) * GRID;
  const h = Math.round(W) * GRID;
  const cut = v.shape === "L"
    ? { x: Math.round((w * 0.6) / GRID) * GRID, y: 0, w: w - Math.round((w * 0.6) / GRID) * GRID, h: Math.round((h * 0.45) / GRID) * GRID }
    : null;
  return { w, h, cut };
}

const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/** Fit oversized boxes to one of the usable rectangular arms before positioning. */
export function fitRoomSize(size: { w: number; h: number }, room: { w: number; h: number; cut: Rect | null }): { w: number; h: number } {
  const w = Math.min(size.w, room.w);
  const h = Math.min(size.h, room.h);
  if (!room.cut || w <= room.cut.x || h <= room.h - room.cut.h) return { w, h };
  const left = { w: Math.min(w, room.cut.x), h };
  const bottom = { w, h: Math.min(h, room.h - room.cut.h) };
  return left.w * left.h >= bottom.w * bottom.h ? left : bottom;
}

/** Keep stored dimensions, estimates and rendered footprints in agreement. */
export function normalizeVenue(v: VenueState): VenueState {
  const room = roomGeometry(v);
  let stageW = v.stageW;
  let stageD = v.stageD;
  const nodes = v.nodes.map((n) => {
    const size = fitRoomSize(nodeSizePx(n, v), room);
    const p = constrainToRoom({ ...n, ...size }, room);
    const wM = (n.rot ? size.h : size.w) / GRID;
    const dM = (n.rot ? size.w : size.h) / GRID;
    if (n.type === "stage") {
      stageW = String(wM);
      stageD = String(dM);
      return { ...n, ...p };
    }
    return { ...n, ...p, wM, dM };
  });
  return { ...v, stageW, stageD, nodes };
}

/** Clamps a box into the room and pushes it out of the cut-out along the shorter direction. */
export function constrainToRoom(box: Rect, room: { w: number; h: number; cut: Rect | null }): { x: number; y: number } {
  let x = snapClamp(box.x, room.w - box.w);
  let y = snapClamp(box.y, room.h - box.h);
  const c = room.cut;
  if (c && overlaps({ ...box, x, y }, c)) {
    const leftX = c.x - box.w; // slide left of the notch
    const downY = c.y + c.h; // slide below the notch
    const canLeft = leftX >= 0;
    const canDown = downY + box.h <= room.h;
    if (canLeft && (!canDown || x - leftX <= downY - y)) x = leftX;
    else if (canDown) y = downY;
  }
  return { x, y };
}

export interface HubState {
  version: 1;
  mode: Mode;
  artist: ArtistState;
  venue: VenueState;
}

export const GRID = 20;

/** Snaps a pixel value to the nearest grid step and clamps it to [0, max]. */
export function snapClamp(v: number, max: number): number {
  const top = Math.max(0, Math.floor(max / GRID) * GRID);
  return Math.min(top, Math.max(0, Math.round(v / GRID) * GRID));
}

/** Stage block size on the floor plan: 1 m = one grid cell, clamped so extreme values stay usable. */
export const STAGE_PX = { perMeter: GRID, min: 40, maxW: 640, maxH: 400 };
export function stageSizePx(widthM: string, depthM: string): { w: number; h: number } {
  const px = (v: string, max: number) => {
    const n = Number(String(v).replace(",", "."));
    const raw = Number.isFinite(n) && n > 0 ? n * STAGE_PX.perMeter : STAGE_PX.min;
    return Math.min(max, Math.max(STAGE_PX.min, Math.round(raw / GRID) * GRID));
  };
  return { w: px(widthM, STAGE_PX.maxW), h: px(depthM, STAGE_PX.maxH) };
}

/** Width/depth in meters for any floor-plan node; the stage reads the room parameters. */
export function nodeMeters(n: VenueNode, v: Pick<VenueState, "stageW" | "stageD">): { w: number; d: number } {
  if (n.type === "stage") return { w: Number(v.stageW.replace(",", ".")) || 0, d: Number(v.stageD.replace(",", ".")) || 0 };
  const t = VENUE_TYPES[n.type];
  return { w: n.wM ?? (t?.w ?? 1) * 2, d: n.dM ?? (t?.h ?? 1) * 2 };
}

/** On-canvas pixel box for a node, honoring the 90° rotation and min/max limits. */
export function nodeSizePx(n: VenueNode, v: Pick<VenueState, "stageW" | "stageD">): { w: number; h: number } {
  const m = nodeMeters(n, v);
  const { w, h } = stageSizePx(String(m.w), String(m.d));
  return n.rot ? { w: h, h: w } : { w, h };
}

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Parses "MM:SS" (or "H:MM:SS") into seconds; invalid input counts as 0. */
export function parseDuration(v: string): number {
  const parts = v.trim().split(":").map((p) => Number(p));
  if (!parts.length || parts.some((n) => !Number.isFinite(n) || n < 0)) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

export function formatHMS(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function totalSetDuration(songs: Song[]): number {
  return songs.reduce((acc, s) => acc + (s.kind === "song" || s.kind === "pause" ? parseDuration(s.duration) : 0), 0);
}

export function reorderSongs(songs: Song[], fromId: string, toId: string): Song[] {
  const from = songs.findIndex((s) => s.id === fromId);
  const to = songs.findIndex((s) => s.id === toId);
  if (from < 0 || to < 0 || from === to) return songs;
  const result = [...songs];
  const [moved] = result.splice(from, 1);
  if (!moved) return songs;
  result.splice(to, 0, moved);
  return result;
}

export function duplicateSongs(songs: Song[], ids: string[]): Song[] {
  return songs.flatMap((s) => ids.includes(s.id) ? [s, { ...s, id: uid() }] : [s]);
}

export function convertSongMarker(song: Song, kind: Song["kind"]): Song {
  return { ...song, kind, duration: kind === "encore" || kind === "separator" ? "00:00" : song.duration };
}

const ch = (label: string, mic: string, phantom = false, stand: Channel["stand"] = "Boom", notes = ""): Channel => ({
  label, mic, phantom, stand, notes,
});

export const STAGE_TYPES: Record<string, { label: string; short: string; channels: () => Channel[] }> = {
  drums: {
    label: "Drums", short: "DR",
    channels: () => [
      ch("Kick", "Shure Beta 91A", true, "—"),
      ch("Snare Top", "Shure SM57", false, "Short"),
      ch("Hi-Hat", "AKG C451", true, "Boom"),
      ch("Tom 1", "Sennheiser e604", false, "—"),
      ch("Floor Tom", "Sennheiser e604", false, "—"),
      ch("OH L", "Neumann KM184", true, "Tall"),
      ch("OH R", "Neumann KM184", true, "Tall"),
    ],
  },
  leadmic: { label: "Lead Mic", short: "LV", channels: () => [ch("Lead Vocal", "Shure SM58", false, "Boom")] },
  backmic: { label: "Backing Mic", short: "BV", channels: () => [ch("Backing Vocal", "Shure SM58", false, "Boom")] },
  gtramp: { label: "Guitar Amp", short: "GT", channels: () => [ch("Guitar", "Sennheiser e906", false, "Short")] },
  bassamp: { label: "Bass Amp", short: "BS", channels: () => [ch("Bass DI", "Radial J48", true, "—")] },
  keys: { label: "Keyboards", short: "KY", channels: () => [ch("Keys L", "DI Box", true, "—"), ch("Keys R", "DI Box", true, "—")] },
  di: { label: "DI Box", short: "DI", channels: () => [ch("DI Line", "BSS AR-133", true, "—")] },
  wedge: { label: "Wedge", short: "WG", channels: () => [] },
  iem: { label: "In-Ear System", short: "IEM", channels: () => [] },
  dj: { label: "DJ Setup", short: "DJ", channels: () => [ch("DJ Mixer L", "XLR Out", false, "—"), ch("DJ Mixer R", "XLR Out", false, "—")] },
  schuko: { label: "230V Schuko-Anschluss", short: "230V", channels: () => [] },
};

export type SeatDensity = "comfort" | "normal" | "tight";
export type AisleMode = "center" | "side";
export const DENSITY_LABEL: Record<SeatDensity, string> = { comfort: "Komfort", normal: "Normal", tight: "Eng" };
export const AISLE_LABEL: Record<AisleMode, string> = { center: "Mittelgang", side: "Seitengang" };

/** Floor area per seat (m²) by seating type and density. */
export const SEAT_AREA: Record<string, Record<SeatDensity, number>> = {
  rows: { comfort: 0.8, normal: 0.6, tight: 0.5 },
  banquet: { comfort: 1.4, normal: 1.1, tight: 0.9 },
  cocktail: { comfort: 1.0, normal: 0.7, tight: 0.5 },
  vip: { comfort: 3.0, normal: 2.0, tight: 1.5 },
};
/** Aisle width (m) taken off the block width: one 1.2 m centre aisle or two 1 m side aisles. */
export const AISLE_WIDTH: Record<AisleMode, number> = { center: 1.2, side: 2 };

export const isSeating = (type: string) => VENUE_TYPES[type]?.cat === "seating";

/** Estimated seats for a seating block from its meters, density and aisle layout. */
export function estimateSeats(type: string, wM: number, dM: number, density: SeatDensity = "normal", aisle: AisleMode = "center"): number {
  const area = SEAT_AREA[type]?.[density];
  if (!area) return 0;
  const usableW = Math.max(0, wM - AISLE_WIDTH[aisle]);
  return Math.floor((usableW * Math.max(0, dM)) / area);
}

export function nodeSeats(n: VenueNode, v: Pick<VenueState, "stageW" | "stageD">): number {
  if (!isSeating(n.type)) return 0;
  if (n.seats != null && n.seats >= 0) return Math.floor(n.seats);
  const m = nodeMeters(n, v);
  return estimateSeats(n.type, m.w, m.d, n.density, n.aisle);
}

/** Seated capacity: sum of seating blocks when any exist, otherwise the manual field. */
export function seatedTotal(v: VenueState): { total: number; auto: boolean } {
  const blocks = v.nodes.filter((n) => isSeating(n.type));
  if (!blocks.length) return { total: Number(v.capSeated) || 0, auto: false };
  return { total: blocks.reduce((a, n) => a + nodeSeats(n, v), 0), auto: true };
}

export type VenueTechField = "pa" | "rigging" | "fixtures" | "lightConsole" | "dimmerCity";
export const VENUE_TECH_FIELDS: Record<VenueTechField, string> = {
  pa: "Main PA System", rigging: "Rigging-Punkte / Traglast", fixtures: "Feste Scheinwerfer", lightConsole: "Lichtpult",
  dimmerCity: "Dimmer City",
};

export const VENUE_TYPES: Record<string, { label: string; short: string; w: number; h: number; tone: string; cat?: "seating" | "audio" | "lighting"; specField?: VenueTechField }> = {
  stage: { label: "Bühne", short: "STAGE", w: 6, h: 3, tone: "accent" },
  foh: { label: "FOH Platz", short: "FOH", w: 2, h: 1, tone: "accent2" },
  dock: { label: "Ladezone / Rampe", short: "LOAD", w: 2, h: 1, tone: "muted" },
  exit: { label: "Notausgang", short: "EXIT", w: 1, h: 1, tone: "ok" },
  p16: { label: "Strom 16A CEE", short: "16A", w: 1, h: 1, tone: "warn" },
  schuko: { label: "230V Steckdose (Schuko)", short: "230V", w: 1, h: 1, tone: "accent2" },
  p32: { label: "Strom 32A CEE", short: "32A", w: 1, h: 1, tone: "warn" },
  p63: { label: "Strom 63A CEE", short: "63A", w: 1, h: 1, tone: "warn" },
  bar: { label: "Bar", short: "BAR", w: 3, h: 1, tone: "muted" },
  backstage: { label: "Backstage", short: "BACK", w: 2, h: 2, tone: "muted" },
  pa: { label: "Main PA / Tops", short: "PA", w: 1, h: 1, tone: "accent", cat: "audio", specField: "pa" },
  sub: { label: "Subwoofer / Lows", short: "SUB", w: 1, h: 1, tone: "accent", cat: "audio", specField: "pa" },
  truss: { label: "Licht-Traverse / Truss", short: "TRUSS", w: 6, h: 1, tone: "accent2", cat: "lighting", specField: "rigging" },
  fixture: { label: "Feste Scheinwerfer / Moving Heads", short: "MH", w: 1, h: 1, tone: "accent2", cat: "lighting", specField: "fixtures" },
  lightdesk: { label: "Lichtpult", short: "LX", w: 2, h: 1, tone: "accent2", cat: "lighting", specField: "lightConsole" },
  dimmer: { label: "Dimmer City", short: "DIM", w: 2, h: 1, tone: "warn", cat: "lighting", specField: "dimmerCity" },
  rows: { label: "Reihenbestuhlung", short: "REIHE", w: 5, h: 3, tone: "seat", cat: "seating" },
  banquet: { label: "Tischbestuhlung / Bankett", short: "BANKETT", w: 4, h: 3, tone: "seat", cat: "seating" },
  cocktail: { label: "Stehtische", short: "STEH", w: 2, h: 2, tone: "seat", cat: "seating" },
  vip: { label: "Lounge / VIP Area", short: "VIP", w: 3, h: 2, tone: "accent2", cat: "seating" },
};

export function isFixedTech(type: string): boolean {
  const cat = VENUE_TYPES[type]?.cat;
  return cat === "audio" || cat === "lighting";
}

export function venueTechField(node: VenueNode): VenueTechField | null {
  if (!isFixedTech(node.type)) return null;
  return node.specField === null ? null : node.specField ?? VENUE_TYPES[node.type]?.specField ?? null;
}

export function venueTechSpec(node: VenueNode, venue: VenueState): string {
  const field = venueTechField(node);
  return field ? venue[field] ?? "" : "";
}

export function setVenueTechSpec(venue: VenueState, node: VenueNode, value: string): VenueState {
  const field = venueTechField(node);
  return field ? { ...venue, [field]: value } : venue;
}

export function venueTechLabel(node: VenueNode): string {
  const quantity = (node.quantity ?? "").trim().replace(/\s*[x×]\s*$/i, "");
  const model = node.model?.trim() || node.label?.trim() || VENUE_TYPES[node.type]?.label || node.type;
  return `${quantity ? `${quantity}× ` : ""}${model}`;
}

export function venueTechSummary(node: VenueNode): string {
  return [venueTechLabel(node), node.techInfo?.trim()].filter(Boolean).join(" · ");
}

export function appendVenueTechSpec(venue: VenueState, node: VenueNode): VenueState {
  const field = venueTechField(node);
  if (!field || !node.model?.trim()) return venue;
  const summary = venueTechSummary(node);
  const current = venueTechSpec(node, venue).trim();
  if (current.split("\n").includes(summary)) return venue;
  return { ...venue, [field]: current ? `${current}\n${summary}` : summary };
}

export const defaultState = (): HubState => {
  let serial = 0;
  const demoId = () => `demo-${++serial}`;
  return ({
  version: 1,
  mode: "artist",
  artist: {
    name: "Neon Atlas",
    songs: [
      { id: demoId(), kind: "song", title: "Intro – Afterglow", duration: "03:12", key: "Am", bpm: "96", notes: "Licht-Cue: Blackout → Blau" },
      { id: demoId(), kind: "song", title: "Midnight Signal", duration: "04:05", key: "C#m", bpm: "124", notes: "" },
      { id: demoId(), kind: "song", title: "Glass Rivers", duration: "05:20", key: "E", bpm: "110", notes: "Gitarrenwechsel → Tele" },
      { id: demoId(), kind: "pause", title: "Pause", duration: "02:00", key: "", bpm: "", notes: "Ansage" },
      { id: demoId(), kind: "song", title: "Static Hearts", duration: "03:48", key: "F#m", bpm: "132", notes: "" },
      { id: demoId(), kind: "encore", title: "Zugabe / Encore", duration: "00:00", key: "", bpm: "", notes: "" },
      { id: demoId(), kind: "song", title: "Home Frequency", duration: "06:02", key: "D", bpm: "88", notes: "Konfetti" },
    ],
    stage: [
      { id: demoId(), type: "drums", x: 200, y: 40, channels: STAGE_TYPES["drums"]?.channels() ?? [] },
      { id: demoId(), type: "leadmic", x: 200, y: 160, channels: STAGE_TYPES["leadmic"]?.channels() ?? [] },
      { id: demoId(), type: "gtramp", x: 40, y: 80, channels: STAGE_TYPES["gtramp"]?.channels() ?? [] },
      { id: demoId(), type: "bassamp", x: 360, y: 80, channels: STAGE_TYPES["bassamp"]?.channels() ?? [] },
      { id: demoId(), type: "wedge", x: 200, y: 200, channels: [] },
    ],
    mixes: [
      { id: demoId(), name: "Mix 1 – Lead Vocal", type: "IEM", feed: "Vox, Keys, Click" },
      { id: demoId(), name: "Mix 2 – Drums", type: "Wedge", feed: "Bass, Vox" },
    ],
    power: "2× Schuko 230V am Drumriser, 1× Schuko je Amp (separater Stromkreis zu Licht)",
  },
  venue: {
    name: "Kulturhalle Süd",
    nodes: [
      { id: demoId(), type: "stage", x: 120, y: 0 },
      { id: demoId(), type: "foh", x: 200, y: 240 },
      { id: demoId(), type: "dock", x: 0, y: 0 },
      { id: demoId(), type: "exit", x: 440, y: 280 },
      { id: demoId(), type: "p32", x: 360, y: 0 },
      { id: demoId(), type: "bar", x: 0, y: 280 },
      { id: demoId(), type: "backstage", x: 400, y: 40 },
    ],
    stageW: "10", stageD: "6", stageH: "5.5",
    capStanding: "800", capSeated: "350",
    pa: "L-Acoustics Kara II, 2×6 + 4× SB18 Subs",
    foh: "DiGiCo SD12",
    monitors: "8× L-Acoustics X15 Wedges, 4× Shure PSM1000",
    snake: "Stagebox SD-Rack 48/24 via Optocore",
    rigging: "6 Punkte à 500 kg, Truss 12m",
    lightConsole: "grandMA3 compact XT",
    dimmerCity: "",
    fixtures: "12× Robe MegaPointe, 8× Ayrton Diablo, 16× LED Par",
    doorW: "2.4", doorH: "3.0",
    access: "Ebenerdig / Rampe",
    parking: "2 Nightliner + 1 Trailer Stellplatz",
    curfew: "22:00 (max. 100 dB(A) LAeq)",
    roomL: "32", roomW: "20", roomH: "8", shape: "rect",
  },
});
};

export const STORAGE_KEY = "gigsda-rider-hub-v2";

export function schukoCount(nodes: { type: string }[]): number {
  return nodes.filter((n) => n.type === "schuko").length;
}

export function artistSchukoTotal(a: ArtistState): number {
  const manual = a.schukoOutlets;
  return manual != null && Number.isFinite(manual) ? Math.max(0, Math.floor(manual)) : schukoCount(a.stage);
}

export function artistPowerSummary(a: ArtistState): string {
  const circuits = a.schukoCircuits;
  return `${artistSchukoTotal(a)}× 230V Schuko${circuits != null && Number.isFinite(circuits) ? ` · ${Math.max(0, Math.floor(circuits))} separate Stromkreise` : ""}${a.separatePower ? " · getrennte Stromkreise für Ton/Licht" : ""}`;
}

export function isHubState(v: unknown): v is HubState {
  const o = v as HubState;
  return !!o && typeof o === "object" && !!o.artist && !!o.venue && Array.isArray(o.artist.songs);
}
