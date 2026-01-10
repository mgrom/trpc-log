// TODO: clean up these types

export interface LogEntry {
  requestId: string;
  path: string;
  type: string;
  duration: number;
  durationMs: string;
  level: string;
  ok: boolean;
  timestamp: string;
  input?: any;
  result?: any;
  error?: string;
  slow?: boolean;
}

// TODO: make this more specific
export type LogFn = (entry: any) => void;

export interface LogMiddlewareOptions {
  logger?: any;
  level?: string;
  logInput?: boolean;
  logResult?: boolean;
}
