/**
 * Minimal structured logger.
 * - Logs JSON in production for log-aggregation tools (Datadog, CloudWatch…).
 * - Logs human-readable lines in development.
 * - NEVER logs: tokens, hashes, passwords, PII, answer keys.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  requestId?: string;
  quizCode?: string;
  route?: string;
  durationMs?: number;
  statusCode?: number;
  [key: string]: unknown;
}

const IS_DEV = process.env.NODE_ENV === "development";
const MIN_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? "info";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[MIN_LEVEL];
}

function formatDev(entry: LogEntry): string {
  const { level, message, requestId, ...rest } = entry;
  const prefix = `[${level.toUpperCase()}]${requestId ? ` (${requestId})` : ""}`;
  const extras = Object.keys(rest).length
    ? " " + JSON.stringify(rest)
    : "";
  return `${prefix} ${message}${extras}`;
}

function emit(entry: LogEntry): void {
  if (!shouldLog(entry.level)) return;

  if (IS_DEV) {
    const msg = formatDev(entry);
    if (entry.level === "error") console.error(msg);
    else if (entry.level === "warn") console.warn(msg);
    else console.log(msg);
  } else {
    const json = JSON.stringify({ ts: new Date().toISOString(), ...entry });
    if (entry.level === "error") console.error(json);
    else if (entry.level === "warn") console.warn(json);
    else console.log(json);
  }
}

export const logger = {
  debug: (message: string, ctx?: Omit<LogEntry, "level" | "message">) =>
    emit({ level: "debug", message, ...ctx }),
  info: (message: string, ctx?: Omit<LogEntry, "level" | "message">) =>
    emit({ level: "info", message, ...ctx }),
  warn: (message: string, ctx?: Omit<LogEntry, "level" | "message">) =>
    emit({ level: "warn", message, ...ctx }),
  error: (message: string, ctx?: Omit<LogEntry, "level" | "message">) =>
    emit({ level: "error", message, ...ctx }),
};

export default logger;
