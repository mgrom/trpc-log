import type { LogEntry, LogFn, LogMiddlewareOptions } from './types';

let counter = 0;

export function logRequest(opts: LogMiddlewareOptions = {}) {
  const {
    logger = console.log,
    level = 'info',
    logInput = false,
    logResult = false,
  } = opts;

  const log: LogFn = typeof logger === 'function' ? logger : console.log;

  return async (params: any) => {
    const { path, type, next, rawInput } = params;
    const start = Date.now();
    const requestId = `req-${counter++}`;

    console.log(`[trpc-log] starting ${type} ${path}`); // TODO: remove

    const result = await next();
    const duration = Date.now() - start;

    console.log(`[trpc-log] finished ${type} ${path} in ${duration}ms`); // TODO: remove

    const entry: LogEntry = {
      requestId,
      path,
      type,
      duration,
      durationMs: `${Math.round(duration)}ms`,
      level,
      ok: result.ok,
      timestamp: new Date().toISOString(),
      input: logInput ? rawInput : undefined,
      result: logResult && result.ok ? result.data : undefined,
    };

    log(entry);
    return result;
  };
}
