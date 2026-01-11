export interface LogEntry {
  requestId: string;
  path: string;
  type: string;
  duration: number;
  durationMs: string;
  level: string;
  ok: boolean;
  timestamp: string;
  input?: unknown;
  result?: unknown;
  error?: string;
  slow?: boolean;
}

export type LogFn = (entry: LogEntry) => void;

export interface LogMiddlewareOptions {
  logger?: LogFn;
  level?: string;
  logInput?: boolean;
  logResult?: boolean;
  formatEntry?: (raw: Omit<LogEntry, 'timestamp' | 'durationMs'>) => LogEntry;
}
