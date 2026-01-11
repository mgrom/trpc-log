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
  });

  it('should include input when logInput is true', async () => {
    const logger = vi.fn();
    const middleware = createLogMiddleware({ logger, logInput: true });

    await middleware(createMockParams());

    const entry = logger.mock.calls[0][0];
    expect(entry.input).toEqual({ name: 'world' });
  });
});
