import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("logger", () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv, NODE_ENV: "development" }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  it("logs info messages", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {})
    const { logger } = await import("./logger")
    logger.info("test message")
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[INFO] test message"))
  })

  it("logs error messages to console.error", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { logger } = await import("./logger")
    logger.error("error happened")
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[ERROR] error happened"))
  })

  it("logs warnings to console.warn", async () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const { logger } = await import("./logger")
    logger.warn("warning message")
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("[WARN] warning message"))
  })

  it("includes context in child logger", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {})
    const { logger } = await import("./logger")
    const child = logger.child("test-context")
    child.info("child message")
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[test-context] child message")
    )
  })

  it("extracts error info from exceptions", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { logger } = await import("./logger")
    const err = new Error("test error")
    logger.errorWithException("something broke", err)
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("Error: test error")
    )
  })

  it("handles non-Error objects in errorWithException", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    const { logger } = await import("./logger")
    logger.errorWithException("something broke", "string error")
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("Unknown: string error")
    )
  })

  it("includes metadata in output", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {})
    const { logger } = await import("./logger")
    logger.info("with meta", { metadata: { userId: "123" } })
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('"userId":"123"')
    )
  })

  it("includes duration in output", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {})
    const { logger } = await import("./logger")
    logger.info("request complete", { durationMs: 42 })
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("(42ms)"))
  })
})
