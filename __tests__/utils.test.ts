import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utility Functions - cn()", () => {
  it("merges basic class names cleanly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional and falsy class names", () => {
    const isActive = false;
    expect(cn("base-class", isActive && "active-class", undefined, null, "final")).toBe(
      "base-class final"
    );
  });

  it("resolves conflicting Tailwind utility classes properly", () => {
    expect(cn("px-2 py-1", "px-6")).toBe("py-1 px-6");
  });
});
