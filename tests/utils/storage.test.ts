import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const deleteWindow = () => {
  if ("window" in globalThis) {
    Reflect.deleteProperty(globalThis, "window");
  }
};

describe("storage utils", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    deleteWindow();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    deleteWindow();
  });

  it("gracefully no-ops when window is undefined", async () => {
    const { readSessionStorage, writeSessionStorage, removeSessionStorage } =
      await import("@/utils/storage");

    expect(readSessionStorage("key"))
      .toBeNull();

    expect(() => writeSessionStorage("key", "value")).not.toThrow();
    expect(() => removeSessionStorage("key")).not.toThrow();
  });

  it("proxies read/write/remove to sessionStorage when available", async () => {
    const getItem = vi.fn().mockReturnValue("stored-value");
    const setItem = vi.fn();
    const removeItem = vi.fn();

    vi.stubGlobal("window", {
      sessionStorage: {
        getItem,
        setItem,
        removeItem,
      },
    });

    const {
      readSessionStorage,
      writeSessionStorage,
      removeSessionStorage,
      buildStorageKey,
    } = await import("@/utils/storage");

    expect(readSessionStorage("key")).toBe("stored-value");
    expect(getItem).toHaveBeenCalledWith("key");

    writeSessionStorage("key", "new-value");
    expect(setItem).toHaveBeenCalledWith("key", "new-value");

    removeSessionStorage("key");
    expect(removeItem).toHaveBeenCalledWith("key");

    expect(buildStorageKey("prefix", "suffix")).toBe("prefix:suffix");
  });

  it("handles sessionStorage errors by logging a warning", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const faultyStorage = {
      getItem: vi.fn(() => {
        throw new Error("getItem failed");
      }),
      setItem: vi.fn(() => {
        throw new Error("setItem failed");
      }),
      removeItem: vi.fn(() => {
        throw new Error("removeItem failed");
      }),
    };

    vi.stubGlobal("window", { sessionStorage: faultyStorage });

    const {
      readSessionStorage,
      writeSessionStorage,
      removeSessionStorage,
    } = await import("@/utils/storage");

    expect(readSessionStorage("key")).toBeNull();
    expect(() => writeSessionStorage("key", "value")).not.toThrow();
    expect(() => removeSessionStorage("key")).not.toThrow();

    expect(warnSpy).toHaveBeenCalledTimes(3);

    warnSpy.mockRestore();
  });
});
