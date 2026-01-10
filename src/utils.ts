let counter = 0;

export function generateRequestId(): string {
  return `${Date.now().toString(36)}-${counter++}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
