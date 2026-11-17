import { describe, expect, it } from "vitest";
import { addArtistStage, artistInputs, createCustomStage, defaultState, reorderInputs, stageLegendEntries, STAGE_TYPES } from "../../lib/hub";

describe("artist input management", () => {
  it("appends manual channels after the ten legacy channels", () => {
    const artist = defaultState().artist;
    const rows = artistInputs(artist);
    expect(rows).toHaveLength(10);
    const added = { id: "manual", label: "Sax", mic: "Clip", phantom: true, stand: "—" as const, notes: "Solo" };
    expect(artistInputs({ ...artist, inputChannels: [...rows, added] })[10]).toEqual(added);
  });
  it("reorders individual channels across instruments and keeps edits and numbering contiguous after deletion", () => {
    const rows = artistInputs(defaultState().artist);
    const first = rows[0]; const last = rows[9];
    if (!first || !last) throw new Error("Missing demo channels");
    const moved = reorderInputs(rows, last.id, first.id);
    expect(moved[0]?.label).toBe("Bass DI");
    const deleted = moved.filter((row) => row.id !== first.id);
    expect(deleted).toHaveLength(9);
    expect(deleted.map((_, i) => i + 1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it("auto-appends matching keyboard channels without resetting manual ordering", () => {
    const artist = defaultState().artist;
    const inputs = artistInputs(artist).reverse();
    const keys = STAGE_TYPES["keys"];
    if (!keys) throw new Error("Missing keys type");
    const next = addArtistStage({ ...artist, inputChannels: inputs }, { id: "keys", type: "keys", x: 0, y: 0, channels: keys.channels() });
    expect(artistInputs(next).slice(0, 10)).toEqual(inputs);
    expect(artistInputs(next).slice(10).map((row) => row.label)).toEqual(["Keys L", "Keys R"]);
  });
  it("accepts four-character custom codes and rejects longer codes or missing names", () => {
    expect(createCustomStage("perc", "Percussion Rig")?.badge).toBe("PERC");
    expect(createCustomStage("ABCDE", "Rig")).toBeNull();
    expect(createCustomStage("SAX", " ")).toBeNull();
  });
  it("includes each custom abbreviation and full name in the shared saved/export legend", () => {
    const element = createCustomStage("SAX", "Saxophon");
    if (!element) throw new Error("Missing custom block");
    const artist = addArtistStage(defaultState().artist, element);
    const restored = JSON.parse(JSON.stringify(artist));
    expect(stageLegendEntries(restored.stage)).toContainEqual(["SAX", "Saxophon"]);
    expect(artistInputs(artist)).toHaveLength(10);
  });
});