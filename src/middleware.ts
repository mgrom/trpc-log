import type { LogEntry, LogFn, LogMiddlewareOptions } from './types';
import { generateRequestId } from './utils';
import { formatLogEntry } from './formatter';

export function createLogMiddleware(opts: LogMiddlewareOptions = {}) {
  const {
    logger = console.log,
    level = 'info',
    logInput = false,
    logResult = false,
    formatEntry = formatLogEntry,
  } = opts;

  const log: LogFn = typeof logger === 'function' ? logger : console.log;

  return async (params: any) => {
    const { path, type, next, rawInput } = params;
    const start = performance.now();
    const requestId = generateRequestId();

    console.log(`[trpc-log] ${type} ${path}`); // TODO: remove debug

    const result = await next();
    const duration = performance.now() - start;

    log(formatEntry({
      requestId, path, type, duration, level,
      ok: result.ok,
      input: logInput ? rawInput : undefined,
      result: logResult && result.ok ? result.data : undefined,
    }));

    return result;
  };
}
