import { describe, expect, it } from "vitest";
import { artistSchukoTotal, defaultState, normalizeVenue, schukoCount, STAGE_TYPES, VENUE_TYPES } from "../../lib/hub";

describe("Schuko power", () => {
  it("counts three placed Schuko sockets without counting CEE or audio nodes", () => {
    const a = defaultState().artist;
    a.stage = ["schuko", "p16", "schuko", "gtramp", "schuko"].map((type, i) => ({ id: String(i), type, x: 0, y: 0, channels: [] }));
    expect(artistSchukoTotal(a)).toBe(3);
    expect(schukoCount(a.stage)).toBe(3);
  });
  it("allows manual quantities including zero and returns to auto", () => {
    const a = defaultState().artist;
    a.stage.push({ id: "power", type: "schuko", x: 0, y: 0, channels: [] });
    a.schukoOutlets = 3;
    expect(artistSchukoTotal(a)).toBe(3);
    a.schukoOutlets = 0;
    expect(artistSchukoTotal(a)).toBe(0);
    a.schukoOutlets = undefined;
    expect(artistSchukoTotal(a)).toBe(1);
    expect(a.schukoCircuits).toBeUndefined();
  });
  it("provides Schuko in both palettes without creating audio channels", () => {
    expect(STAGE_TYPES["schuko"]?.channels()).toEqual([]);
    expect(VENUE_TYPES["schuko"]?.short).toBe("230V");
  });
  it("preserves Schuko quantity when room geometry changes", () => {
    const v = defaultState().venue;
    v.nodes.push({ id: "power", type: "schuko", x: 600, y: 0 });
    v.roomL = "8";
    v.roomW = "6";
    v.shape = "L";
    const next = normalizeVenue(v);
    expect(schukoCount(next.nodes)).toBe(1);
    expect(next.nodes.find((n) => n.id === "power")?.x).toBeLessThanOrEqual(120);
  });
});