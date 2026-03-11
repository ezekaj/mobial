type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  requestId?: string
  userId?: string
  path?: string
  method?: string
  statusCode?: number
  durationMs?: number
  error?: {
    name: string
    message: string
    stack?: string
  }
  metadata?: Record<string, unknown>
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const MIN_LOG_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === "production" ? "info" : "debug")

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL]
}

function formatLog(entry: LogEntry): string {
  if (process.env.NODE_ENV === "production") {
    // JSON format for production (structured logging for log aggregators)
    return JSON.stringify(entry)
  }

  // Human-readable format for development
  const { level, message, context, durationMs, error, metadata } = entry
  const prefix = `[${level.toUpperCase()}]`
  const ctx = context ? ` [${context}]` : ""
  const duration = durationMs !== undefined ? ` (${durationMs}ms)` : ""
  const meta =
    metadata && Object.keys(metadata).length > 0
      ? ` ${JSON.stringify(metadata)}`
      : ""
  const err = error ? `\n  ${error.name}: ${error.message}` : ""

  return `${prefix}${ctx} ${message}${duration}${meta}${err}`
}

function createEntry(
  level: LogLevel,
  message: string,
  options?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...options,
  }
}

function log(
  level: LogLevel,
  message: string,
  options?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>
) {
  if (!shouldLog(level)) return

  const entry = createEntry(level, message, options)
  const formatted = formatLog(entry)

  switch (level) {
    case "error":
      console.error(formatted)
      break
    case "warn":
      console.warn(formatted)
      break
    default:
      console.log(formatted)
  }
}

export const logger = {
  debug(message: string, options?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
    log("debug", message, options)
  },

  info(message: string, options?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
    log("info", message, options)
  },

  warn(message: string, options?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
    log("warn", message, options)
  },

  error(message: string, options?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
    log("error", message, options)
  },

  /** Log an error with automatic extraction of name/message/stack */
  errorWithException(
    message: string,
    err: unknown,
    options?: Partial<Omit<LogEntry, "level" | "message" | "timestamp" | "error">>
  ) {
    const errorObj =
      err instanceof Error
        ? { name: err.name, message: err.message, stack: err.stack }
        : { name: "Unknown", message: String(err) }

    log("error", message, { ...options, error: errorObj })
  },

  /** Create a child logger with preset context */
  child(context: string) {
    return {
      debug(msg: string, opts?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
        log("debug", msg, { ...opts, context })
      },
      info(msg: string, opts?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
        log("info", msg, { ...opts, context })
      },
      warn(msg: string, opts?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
        log("warn", msg, { ...opts, context })
      },
      error(msg: string, opts?: Partial<Omit<LogEntry, "level" | "message" | "timestamp">>) {
        log("error", msg, { ...opts, context })
      },
      errorWithException(
        msg: string,
        err: unknown,
        opts?: Partial<Omit<LogEntry, "level" | "message" | "timestamp" | "error">>
      ) {
        const errorObj =
          err instanceof Error
            ? { name: err.name, message: err.message, stack: err.stack }
            : { name: "Unknown", message: String(err) }
        log("error", msg, { ...opts, context, error: errorObj })
      },
    }
  },
}
