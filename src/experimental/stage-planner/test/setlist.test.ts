import { describe, expect, it } from "vitest";
import { convertSongMarker, duplicateSongs, reorderSongs, totalSetDuration, type Song } from "../../lib/hub";
const song: Song = { id: "one", kind: "song", title: "Acoustic", duration: "03:30", key: "Am", bpm: "96", notes: "Guitar" };
describe("dynamic setlist", () => {
  it("includes songs and breaks but excludes untimed markers", () => {
    expect(totalSetDuration([song, { ...song, kind: "pause", duration: "02:00" }, { ...song, kind: "separator" }, { ...song, kind: "encore" }])).toBe(330);
  });
  it("duplicates complete entries with unique identifiers", () => {
    const result = duplicateSongs([song], ["one"]);
    expect(result).toHaveLength(2);
    expect(result[1]?.id).not.toBe("one");
    expect(result[1]).toMatchObject({ title: "Acoustic", duration: "03:30", key: "Am", bpm: "96", notes: "Guitar" });
  });
  it("reorders immediately without changing runtime", () => {
    const songs = [song, { ...song, id: "two", duration: "04:00" }, { ...song, id: "three" }];
    const result = reorderSongs(songs, "one", "three");
    expect(result.map((s) => s.id)).toEqual(["two", "three", "one"]);
    expect(totalSetDuration(result)).toBe(660);
  });
  it("converts markers without losing metadata", () => {
    expect(convertSongMarker(song, "separator")).toEqual({ ...song, kind: "separator", duration: "00:00" });
    expect(convertSongMarker(song, "pause").duration).toBe("03:30");
  });
  it("does not limit setlist expansion", () => {
    const songs = Array.from({ length: 1000 }, (_, i) => ({ ...song, id: String(i) }));
    expect(duplicateSongs(songs, songs.map((s) => s.id))).toHaveLength(2000);
    expect(totalSetDuration(songs)).toBe(210000);
  });
});