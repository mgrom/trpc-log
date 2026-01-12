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

export interface LoggerLike {
  info: (entry: LogEntry) => void;
  warn?: (entry: LogEntry) => void;
  error?: (entry: LogEntry) => void;
  [key: string]: ((entry: LogEntry) => void) | undefined;
}

export interface LogMiddlewareOptions {
  logger?: LogFn | LoggerLike;
  level?: string;
  logInput?: boolean;
  logResult?: boolean;
  slowThreshold?: number;
  formatEntry?: (raw: Omit<LogEntry, 'timestamp' | 'durationMs'>) => LogEntry;
  onError?: (error: unknown, entry: LogEntry) => void;
}
