# trpc-log

Lightweight request logging middleware for tRPC v11.

## Install

```bash
npm install trpc-log
```

## Usage

```typescript
import { initTRPC } from '@trpc/server';
import { createLogMiddleware } from 'trpc-log';

const t = initTRPC.create();

// basic — logs to console
const logged = t.procedure.use(createLogMiddleware());

// with options
const logged = t.procedure.use(createLogMiddleware({
  logInput: true,
  slowThreshold: 500,
}));

// custom logger (pino, winston, etc)
import pino from 'pino';
const log = pino();

const logged = t.procedure.use(createLogMiddleware({
  logger: (entry) => log.info(entry, `${entry.type} ${entry.path}`),
}));
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logger` | `function \| object` | `console.log` | Log function or logger instance |
| `level` | `string` | `'info'` | Default log level |
| `logInput` | `boolean` | `false` | Include procedure input |
| `logResult` | `boolean` | `false` | Include result data |
| `slowThreshold` | `number` | — | ms threshold for slow warnings |
| `onError` | `function` | — | Error callback |
| `formatEntry` | `function` | — | Custom formatter |

## Log Entry

```json
{
  "requestId": "m1abc-0",
  "path": "user.getById",
  "type": "query",
  "duration": 42.5,
  "durationMs": "43ms",
  "level": "info",
  "ok": true,
  "timestamp": "2025-01-15T14:23:00.000Z"
}
```

## License

MIT
