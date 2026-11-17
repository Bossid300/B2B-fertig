import { describe, expect, it } from "vitest";
import { appendVenueTechSpec, defaultState, normalizeVenue, venueTechLabel, venueTechSummary, type VenueNode } from "../../lib/hub";

describe("individual installed equipment", () => {
  const top: VenueNode = { id: "top", type: "pa", x: 0, y: 0, model: "L-Acoustics Kara II", quantity: "2×", techInfo: "Geflogen L/R" };
  it("formats model, count and extra info per individual item", () => {
    expect(venueTechLabel(top)).toBe("2× L-Acoustics Kara II");
    expect(venueTechSummary(top)).toBe("2× L-Acoustics Kara II · Geflogen L/R");
    expect(venueTechLabel({ ...top, quantity: "4x", model: "d&b B22 Sub" })).toBe("4× d&b B22 Sub");
  });
  it("appends into the linked summary without replacing other equipment", () => {
    const v = { ...defaultState().venue, pa: "Existing PA" };
    const next = appendVenueTechSpec(v, top);
    expect(next.pa).toBe("Existing PA\n2× L-Acoustics Kara II · Geflogen L/R");
    expect(appendVenueTechSpec(next, top).pa).toBe(next.pa);
    expect(v.pa).toBe("Existing PA");
  });
  it("keeps two items independent through normalization and restoration", () => {
    const second = { ...top, id: "second", model: "Robe MegaPointe", quantity: "8×", techInfo: "Universe 1", type: "fixture" };
    const v = normalizeVenue({ ...defaultState().venue, nodes: [top, second] });
    const restored = JSON.parse(JSON.stringify(v));
    expect(venueTechSummary(restored.nodes[0])).toBe("2× L-Acoustics Kara II · Geflogen L/R");
    expect(venueTechSummary(restored.nodes[1])).toBe("8× Robe MegaPointe · Universe 1");
    expect(appendVenueTechSpec(restored, second).fixtures).toContain("8× Robe MegaPointe · Universe 1");
  });
  it("does not transfer empty or unlinked models", () => {
    const v = defaultState().venue;
    expect(appendVenueTechSpec(v, { ...top, model: "" })).toBe(v);
    expect(appendVenueTechSpec(v, { ...top, specField: null })).toBe(v);
  });
});