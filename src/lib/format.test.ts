import { describe, it, expect } from "vitest";
import { coerceValue, formatValue, toDateInputValue } from "./format";

describe("coerceValue", () => {
  it("parses number", () => expect(coerceValue("number", "42")).toBe(42));
  it("parses relation as int", () => expect(coerceValue("relation", "7")).toBe(7));
  it("parses decimal", () => expect(coerceValue("decimal", "9.99")).toBe(9.99));
  it("empty string → null", () => expect(coerceValue("number", "")).toBeNull());
  it("null → null", () => expect(coerceValue("text", null)).toBeNull());
  it("date → Date", () =>
    expect(coerceValue("date", "2026-07-15") instanceof Date).toBe(true));
  it("text → string", () => expect(coerceValue("text", "hello")).toBe("hello"));
});

describe("formatValue", () => {
  it("null → dash", () => expect(formatValue("text", null)).toBe("—"));
  it("decimal → 2dp", () => expect(formatValue("decimal", 9.5)).toBe("9.50"));
  it("text passes through", () => expect(formatValue("text", "abc")).toBe("abc"));
});

describe("toDateInputValue", () => {
  it("formats a date to YYYY-MM-DD", () =>
    expect(toDateInputValue("2026-07-15T00:00:00.000Z")).toBe("2026-07-15"));
  it("empty for null", () => expect(toDateInputValue(null)).toBe(""));
});
