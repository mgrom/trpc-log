import { describe, it, expect } from 'vitest';
import { formatLogEntry } from '../src/formatter';

describe('formatLogEntry', () => {
  it('should add timestamp and durationMs', () => {
    const entry = formatLogEntry({
      requestId: 'test-1',
      path: 'user.get',
      type: 'query',
      duration: 42.7,
      level: 'info',
      ok: true,
    });

    expect(entry.durationMs).toBe('43ms');
    expect(entry.timestamp).toBeDefined();
  });

  it('should pass through all fields', () => {
    const entry = formatLogEntry({
      requestId: 'test-2',
      path: 'user.create',
      type: 'mutation',
      duration: 100,
      level: 'error',
      ok: false,
      error: 'not found',
    });

    expect(entry.error).toBe('not found');
    expect(entry.ok).toBe(false);
  });
});
