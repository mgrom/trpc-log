import type { LogEntry } from './types';

export function formatLogEntry(raw: Omit<LogEntry, 'timestamp' | 'durationMs'>): LogEntry {
  return {
    ...raw,
    durationMs: `${Math.round(raw.duration)}ms`,
    timestamp: new Date().toISOString(),
  };
}
