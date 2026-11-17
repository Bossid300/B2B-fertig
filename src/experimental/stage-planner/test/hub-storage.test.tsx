import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AUTO_SAVE_DELAY, useHubStorage } from "../../hooks/use-hub-storage";
import { defaultState, STORAGE_KEY } from "../../lib/hub";

beforeEach(() => { localStorage.clear(); vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });

describe("complete local project saving", () => {
  it("explicitly saves both modes, active mode, layouts and specs", () => {
    const project = defaultState();
    project.mode = "venue";
    project.artist.songs[0] = { id: "song", kind: "song", title: "Saved Song", duration: "03:00", key: "C", bpm: "120", notes: "Cue" };
    project.venue.roomL = "48";
    project.venue.shape = "L";
    const { result } = renderHook(useHubStorage);
    act(() => result.current.setState(project));
    act(() => { expect(result.current.save()).toBe(true); });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")).toEqual(project);
    expect(result.current.status).toBe("saved");
  });

  it("debounces edits and only saves the latest state", () => {
    const { result } = renderHook(useHubStorage);
    act(() => { result.current.save(); });
    act(() => result.current.setState((v) => ({ ...v, mode: "venue" })));
    expect(result.current.status).toBe("dirty");
    act(() => vi.advanceTimersByTime(AUTO_SAVE_DELAY - 1));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null").mode).toBe("artist");
    act(() => result.current.setState((v) => ({ ...v, venue: { ...v.venue, roomL: "50" } })));
    act(() => vi.advanceTimersByTime(AUTO_SAVE_DELAY - 1));
    expect(result.current.status).toBe("dirty");
    act(() => vi.advanceTimersByTime(1));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null").venue.roomL).toBe("50");
    expect(result.current.status).toBe("saved");
  });

  it("restores the complete saved project on launch", () => {
    const project = defaultState();
    project.mode = "venue";
    project.venue.name = "Saved Venue";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    const { result } = renderHook(useHubStorage);
    expect(result.current.state).toEqual(project);
    expect(result.current.status).toBe("saved");
  });

  it("does not report saved after storage fails and supports retry", () => {
    const { result } = renderHook(useHubStorage);
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Quota"); });
    act(() => { expect(result.current.save()).toBe(false); });
    expect(result.current.status).toBe("error");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    write.mockRestore();
    act(() => { expect(result.current.save()).toBe(true); });
    expect(result.current.status).toBe("saved");
  });

  it("flushes pending changes when the page closes", () => {
    const { result } = renderHook(useHubStorage);
    act(() => result.current.setState((v) => ({ ...v, mode: "venue" })));
    act(() => window.dispatchEvent(new Event("pagehide")));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null").mode).toBe("venue");
  });
});