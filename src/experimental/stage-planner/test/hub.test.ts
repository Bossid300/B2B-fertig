import { describe, it, expect } from "vitest";
import { parseDuration, formatHMS, totalSetDuration, type Song } from "../../lib/hub";

const s = (duration: string): Song => ({ id: duration, kind: "song", title: "", duration, key: "", bpm: "", notes: "" });

describe("setlist time engine", () => {
  it("parses MM:SS", () => expect(parseDuration("03:12")).toBe(192));
  it("treats invalid input as zero", () => expect(parseDuration("abc")).toBe(0));
  it("sums and formats as HH:MM:SS", () =>
    expect(formatHMS(totalSetDuration([s("45:00"), s("20:30"), s("00:45")]))).toBe("01:06:15"));
});

import { snapClamp } from "../../lib/hub";
describe("canvas snapping", () => {
  it("snaps to nearest 20px", () => expect(snapClamp(29, 500)).toBe(20));
  it("clamps inside canvas", () => expect(snapClamp(999, 460)).toBe(460));
  it("never negative", () => expect(snapClamp(-50, 460)).toBe(0));
});

import { stageSizePx } from "../../lib/hub";
describe("stage sizing", () => {
  it("1 m = 20 px", () => expect(stageSizePx("10", "6")).toEqual({ w: 200, h: 120 }));
  it("clamps extremes", () => expect(stageSizePx("999", "0")).toEqual({ w: 640, h: 40 }));
});

import { nodeMeters, nodeSizePx } from "../../lib/hub";
describe("floor plan node sizing", () => {
  const v = { stageW: "10", stageD: "6" };
  it("custom meters drive pixels", () => expect(nodeSizePx({ id: "a", type: "bar", x: 0, y: 0, wM: 8, dM: 3 }, v)).toEqual({ w: 160, h: 60 }));
  it("rotation swaps width and height", () => expect(nodeSizePx({ id: "a", type: "bar", x: 0, y: 0, wM: 8, dM: 3, rot: true }, v)).toEqual({ w: 60, h: 160 }));
  it("never collapses below 40px", () => expect(nodeSizePx({ id: "a", type: "exit", x: 0, y: 0, wM: 0, dM: 0 }, v)).toEqual({ w: 40, h: 40 }));
  it("stage uses room parameters", () => expect(nodeMeters({ id: "s", type: "stage", x: 0, y: 0 }, v)).toEqual({ w: 10, d: 6 }));
});

import { stageElSize, nextRot, STAGE_LEGEND, STAGE_TYPES } from "../../lib/hub";
describe("stage element sizing", () => {
  it("defaults to 40px", () => expect(stageElSize({})).toEqual({ w: 40, h: 40 }));
  it("never below 40px", () => expect(stageElSize({ w: 0, h: 10 })).toEqual({ w: 40, h: 40 }));
  it("90° swaps dims", () => expect(stageElSize({ w: 80, h: 40, rot: 90 })).toEqual({ w: 40, h: 80 }));
  it("rotates in 90° steps", () => expect(nextRot(270)).toBe(0));
  it("legend covers every element", () => Object.values(STAGE_TYPES).forEach((t) => expect(STAGE_LEGEND[t.short]).toBeTruthy()));
});

import { roomGeometry, constrainToRoom, fitRoomSize, normalizeVenue } from "../../lib/hub";
describe("room geometry", () => {
  it("1 m = 20 px", () => expect(roomGeometry({ roomL: "30", roomW: "15", shape: "rect" })).toMatchObject({ w: 600, h: 300, cut: null }));
  it("arena is square", () => expect(roomGeometry({ roomL: "30", roomW: "15", shape: "arena" })).toMatchObject({ w: 600, h: 600 }));
  it("L-shape has a cut-out", () => expect(roomGeometry({ roomL: "30", roomW: "20", shape: "L" }).cut).toEqual({ x: 360, y: 0, w: 240, h: 180 }));
  it("keeps elements inside room", () => expect(constrainToRoom({ x: 900, y: 900, w: 40, h: 40 }, { w: 600, h: 300, cut: null })).toEqual({ x: 560, y: 260 }));
  it("pushes elements out of the L cut-out", () => {
    const room = roomGeometry({ roomL: "30", roomW: "20", shape: "L" });
    expect(constrainToRoom({ x: 560, y: 0, w: 40, h: 40 }, room)).toEqual({ x: 560, y: 180 });
  });
  it("fits an oversized block inside an L-shaped room", () => {
    const room = roomGeometry({ roomL: "8", roomW: "6", shape: "L" });
    const size = fitRoomSize({ w: 640, h: 400 }, room);
    expect(size).toEqual({ w: 100, h: 120 });
    expect(constrainToRoom({ x: 0, y: 0, ...size }, room)).toEqual({ x: 0, y: 0 });
  });
  it("normalizes stage, FOH, bar, backstage and exit after room shrink", () => {
    const v = defaultState().venue;
    v.roomL = "8";
    v.roomW = "6";
    v.shape = "L";
    v.nodes = ["stage", "foh", "bar", "backstage", "exit"].map((type) => ({ id: type, type, x: 900, y: 900, wM: 32, dM: 20 }));
    const next = normalizeVenue(v);
    const room = roomGeometry(next);
    next.nodes.forEach((n) => {
      const size = nodeSizePx(n, next);
      expect(n.x + size.w).toBeLessThanOrEqual(160);
      expect(n.y + size.h).toBeLessThanOrEqual(120);
      expect(room.cut && n.x < room.cut.x + room.cut.w && n.x + size.w > room.cut.x && n.y < room.cut.h).toBe(false);
    });
  });
});

import { estimateSeats, seatedTotal, defaultState } from "../../lib/hub";
describe("seating capacity", () => {
  it("rows normal 10×6 m with centre aisle", () => expect(estimateSeats("rows", 10, 6)).toBe(88)); // (10-1.2)*6/0.6
  it("tight packs more than comfort", () => expect(estimateSeats("rows", 10, 6, "tight")).toBeGreaterThan(estimateSeats("rows", 10, 6, "comfort")));
  it("side aisles take 2 m", () => expect(estimateSeats("banquet", 8, 6, "normal", "side")).toBe(32)); // 6*6/1.1
  it("total sums blocks and honors overrides", () => {
    const v = defaultState().venue;
    v.nodes = [{ id: "a", type: "rows", x: 0, y: 0, wM: 10, dM: 6 }, { id: "b", type: "vip", x: 0, y: 0, seats: 12 }];
    expect(seatedTotal(v)).toEqual({ total: 100, auto: true });
  });
  it("falls back to manual field without blocks", () => expect(seatedTotal(defaultState().venue)).toEqual({ total: 350, auto: false }));
  it("updates capacity when a seating block is resized", () => {
    const v = defaultState().venue;
    v.nodes = [{ id: "rows", type: "rows", x: 0, y: 0, wM: 10, dM: 6 }];
    expect(seatedTotal(v).total).toBe(88);
    v.nodes[0] = { ...v.nodes[0], id: "rows", type: "rows", x: 0, y: 0, wM: 12 };
    expect(seatedTotal(v).total).toBe(108);
  });
  it("sums all four seating types and honors a zero override", () => {
    const v = defaultState().venue;
    v.nodes = ["rows", "banquet", "cocktail", "vip"].map((type, i) => ({ id: type, type, x: 0, y: 0, seats: i * 10 }));
    expect(seatedTotal(v)).toEqual({ total: 60, auto: true });
    v.nodes.pop();
    expect(seatedTotal(v).total).toBe(30);
  });
});
