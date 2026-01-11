import type { LogEntry, LogFn, LogMiddlewareOptions, LoggerLike } from './types';
import { generateRequestId } from './utils';
import { formatLogEntry } from './formatter';

export function createLogMiddleware(opts: LogMiddlewareOptions = {}) {
  const {
    logger = console.log,
    level = 'info',
    logInput = false,
    logResult = false,
    slowThreshold,
    formatEntry = formatLogEntry,
  } = opts;

  const log: LogFn = typeof logger === 'function'
    ? logger
    : (entry) => {
        const method = (logger as LoggerLike)[entry.level] || (logger as LoggerLike).info;
        method.call(logger, entry);
      };

  return async (params: any) => {
    const { path, type, next, rawInput } = params;
    const start = performance.now();
    const requestId = generateRequestId();

    try {
      const result = await next();
      const duration = performance.now() - start;
      const slow = slowThreshold ? duration > slowThreshold : false;

      log(formatEntry({
        requestId, path, type, duration,
        level: slow ? 'warn' : level,
        ok: result.ok,
        input: logInput ? rawInput : undefined,
        result: logResult && result.ok ? result.data : undefined,
        slow,
      }));

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      log(formatEntry({
        requestId, path, type, duration,
        level: 'error',
        ok: false,
        input: logInput ? rawInput : undefined,
        error: error instanceof Error ? error.message : String(error),
      }));

      throw error;
    }
  };
}
