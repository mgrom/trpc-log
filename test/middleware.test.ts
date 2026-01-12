import { describe, it, expect, vi } from 'vitest';
import { createLogMiddleware } from '../src/middleware';

function createMockParams(overrides = {}) {
  return {
    path: 'test.hello',
    type: 'query' as const,
    next: vi.fn().mockResolvedValue({ ok: true, data: { msg: 'hi' } }),
    rawInput: { name: 'world' },
    ...overrides,
  };
}

describe('createLogMiddleware', () => {
  it('should call next and return result', async () => {
    const logger = vi.fn();
    const middleware = createLogMiddleware({ logger });
    const params = createMockParams();

    const result = await middleware(params);

    expect(params.next).toHaveBeenCalled();
    expect(result.ok).toBe(true);
  });

  it('should log an entry with path and type', async () => {
    const logger = vi.fn();
    const middleware = createLogMiddleware({ logger });

    await middleware(createMockParams());

    expect(logger).toHaveBeenCalledTimes(1);
    const entry = logger.mock.calls[0][0];
    expect(entry.path).toBe('test.hello');
    expect(entry.type).toBe('query');
    expect(entry.ok).toBe(true);
    expect(entry.requestId).toBeDefined();
    expect(entry.timestamp).toBeDefined();
  });

  it('should include input when logInput is true', async () => {
    const logger = vi.fn();
    const middleware = createLogMiddleware({ logger, logInput: true });

    await middleware(createMockParams());

    const entry = logger.mock.calls[0][0];
    expect(entry.input).toEqual({ name: 'world' });
  });

  it('should not include input by default', async () => {
    const logger = vi.fn();
    const middleware = createLogMiddleware({ logger });

    await middleware(createMockParams());

    const entry = logger.mock.calls[0][0];
    expect(entry.input).toBeUndefined();
  });

  it('should mark slow requests', async () => {
    const logger = vi.fn();
    const middleware = createLogMiddleware({ logger, slowThreshold: 0 });

    await middleware(createMockParams());

    const entry = logger.mock.calls[0][0];
    expect(entry.slow).toBe(true);
    expect(entry.level).toBe('warn');
  });

  it('should use custom logger function', async () => {
    const customLogger = vi.fn();
    const middleware = createLogMiddleware({ logger: customLogger });

    await middleware(createMockParams());

    expect(customLogger).toHaveBeenCalledTimes(1);
  });

  it('should support logger object with level methods', async () => {
    const loggerObj = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const middleware = createLogMiddleware({ logger: loggerObj });

    await middleware(createMockParams());

    expect(loggerObj.info).toHaveBeenCalledTimes(1);
  });

  it('should log errors and rethrow', async () => {
    const logger = vi.fn();
    const middleware = createLogMiddleware({ logger });
    const params = createMockParams({
      next: vi.fn().mockRejectedValue(new Error('boom')),
    });

    await expect(middleware(params)).rejects.toThrow('boom');

    const entry = logger.mock.calls[0][0];
    expect(entry.level).toBe('error');
    expect(entry.ok).toBe(false);
    expect(entry.error).toBe('boom');
  });

  it('should call onError callback on error', async () => {
    const logger = vi.fn();
    const onError = vi.fn();
    const middleware = createLogMiddleware({ logger, onError });
    const err = new Error('fail');
    const params = createMockParams({
      next: vi.fn().mockRejectedValue(err),
    });

    await expect(middleware(params)).rejects.toThrow('fail');

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBe(err);
  });

  it('should include result when logResult is true', async () => {
    const logger = vi.fn();
    const middleware = createLogMiddleware({ logger, logResult: true });

    await middleware(createMockParams());

    const entry = logger.mock.calls[0][0];
    expect(entry.result).toEqual({ msg: 'hi' });
  });
});
