import { describe, expect, it } from "vitest";
import { defaultState, isFixedTech, normalizeVenue, setVenueTechSpec, venueTechField, venueTechSpec, type VenueNode } from "../../lib/hub";

describe("fixed venue tech links", () => {
  const pa: VenueNode = { id: "pa", type: "pa", x: 0, y: 0 };
  it("maps all six equipment types to their corresponding panel", () => {
    expect(["pa", "sub", "truss", "fixture", "lightdesk", "dimmer"].map((type) => venueTechField({ ...pa, type }))).toEqual(["pa", "pa", "rigging", "fixtures", "lightConsole", "dimmerCity"]);
  });
  it("reads panel edits through every linked speaker marker", () => {
    const v = { ...defaultState().venue, pa: "L-Acoustics Kara II" };
    expect(venueTechSpec(pa, v)).toBe("L-Acoustics Kara II");
    expect(venueTechSpec({ ...pa, type: "sub" }, v)).toBe("L-Acoustics Kara II");
  });
  it("writes selected marker edits back into the panel", () => {
    const v = setVenueTechSpec(defaultState().venue, pa, "L-Acoustics Kara II");
    expect(v.pa).toBe("L-Acoustics Kara II");
    expect(venueTechSpec({ ...pa, id: "other" }, v)).toBe("L-Acoustics Kara II");
  });
  it("supports relinking and unlinking without erasing specs", () => {
    const v = defaultState().venue;
    expect(setVenueTechSpec(v, { ...pa, specField: "fixtures" }, "Robe MegaPointe").fixtures).toBe("Robe MegaPointe");
    expect(setVenueTechSpec(v, { ...pa, specField: null }, "ignore")).toBe(v);
    expect(venueTechSpec({ ...pa, specField: null }, v)).toBe("");
  });
  it("distinguishes permanently installed tech from temporary infrastructure", () => {
    expect(["pa", "sub", "truss", "fixture", "lightdesk", "dimmer"].every(isFixedTech)).toBe(true);
    expect(isFixedTech("stage")).toBe(false);
  });
  it("preserves links through room normalization and JSON restoration", () => {
    const v = normalizeVenue({ ...defaultState().venue, nodes: [{ ...pa, x: 900, specField: "rigging" }] });
    const restored = JSON.parse(JSON.stringify(v));
    expect(venueTechField(restored.nodes[0])).toBe("rigging");
    expect(venueTechSpec(restored.nodes[0], restored)).toBe(v.rigging);
  });
  it("keeps Lichtpult and Dimmer City specifications independent", () => {
    const desk = { ...pa, type: "lightdesk" };
    const dimmer = { ...pa, type: "dimmer" };
    let v = setVenueTechSpec(defaultState().venue, desk, "grandMA3");
    v = setVenueTechSpec(v, dimmer, "24× 2kW Dimmer");
    const restored = JSON.parse(JSON.stringify(v));
    expect(venueTechSpec(desk, restored)).toBe("grandMA3");
    expect(venueTechSpec(dimmer, restored)).toBe("24× 2kW Dimmer");
    const { dimmerCity, ...legacy } = v;
    expect(venueTechSpec(dimmer, legacy)).toBe("");
    expect(venueTechSpec(desk, legacy)).toBe("grandMA3");
  });
});