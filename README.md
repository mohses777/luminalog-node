<div align="center">
  <h1>@luminalog/logger</h1>
  <p>Privacy-first logging with AI-powered debugging for Node.js</p>
  
  [![npm version](https://img.shields.io/npm/v/@luminalog/logger.svg)](https://www.npmjs.com/package/@luminalog/logger)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
  [![Node.js Compatibility](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
  
  <p>
    <a href="#installation">Installation</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#documentation">Documentation</a> •
    <a href="#examples">Examples</a> •
    <a href="#support">Support</a>
  </p>
</div>

---

## Features

- 🔒 **Privacy-First** - Automatic PII scrubbing on the server
- ⚡ **Zero Performance Impact** - Async batching (100 logs or 5s intervals)
- 🛡️ **Graceful Degradation** - Queues logs locally if API is unavailable
- 📦 **TypeScript-First** - Full type definitions included
- 🪶 **Zero Dependencies** - Only uses Node.js built-ins
- 🎯 **Error Tracking** - Automatic error grouping and stack traces
- 🔄 **Auto-Retry** - Intelligent retry logic with exponential backoff
- 📊 **Quota Management** - Built-in quota exceeded handling

## Installation

```bash
npm install @luminalog/logger
```

```bash
yarn add @luminalog/logger
```

```bash
pnpm add @luminalog/logger
```

## Quick Start

```typescript
import { LuminaLog } from "@luminalog/logger";

const logger = new LuminaLog({
  apiKey: process.env.LUMINALOG_API_KEY!,
  environment: "production",
});

// Basic logging
logger.info("User logged in", { userId: "123" });
logger.warn("High memory usage", { memoryMB: 512 });
logger.error("Payment failed", { error: "Card declined" });

// Critical errors (sent immediately, bypasses batching)
logger.panic("Database connection lost!");

// Graceful shutdown
await logger.shutdown();
```

## Configuration

### Options

```typescript
const logger = new LuminaLog({
  // Required
  apiKey: string;              // Your LuminaLog API key

  // Optional
  environment?: string;        // Environment name (default: 'default')
  projectId?: string;          // Project identifier
  batchSize?: number;          // Logs before auto-flush (default: 100)
  flushInterval?: number;      // Milliseconds between flushes (default: 5000)
  endpoint?: string;           // Custom API endpoint
  debug?: boolean;             // Enable debug logging (default: false)
});
```

### Environment Variables

Store your API key securely using environment variables:

```bash
# .env
LUMINALOG_API_KEY=your-api-key-here
```

```typescript
import { LuminaLog } from "@luminalog/logger";

const logger = new LuminaLog({
  apiKey: process.env.LUMINALOG_API_KEY!,
  environment: process.env.NODE_ENV || "development",
});
```

## API Reference

### Log Levels

| Level   | Method           | Description                    | Behavior        |
| ------- | ---------------- | ------------------------------ | --------------- |
| `debug` | `logger.debug()` | Detailed debugging information | Batched         |
| `info`  | `logger.info()`  | General operational messages   | Batched         |
| `warn`  | `logger.warn()`  | Warning conditions             | Batched         |
| `error` | `logger.error()` | Error conditions               | Batched         |
| `fatal` | `logger.fatal()` | Fatal errors                   | Batched         |
| `panic` | `logger.panic()` | Critical errors                | Immediate flush |

### Methods

#### `logger.debug(message, metadata?)`

Log a debug message.

```typescript
logger.debug("Cache hit", { key: "user:123", ttl: 3600 });
```

#### `logger.info(message, metadata?)`

Log an informational message.

```typescript
logger.info("User logged in", { userId: "123", ip: "192.168.1.1" });
```

#### `logger.warn(message, metadata?)`

Log a warning message.

```typescript
logger.warn("API rate limit approaching", { current: 950, limit: 1000 });
```

#### `logger.error(message, metadata?)`

Log an error message.

```typescript
logger.error("Payment processing failed", {
  userId: "123",
  amount: 99.99,
  error: "Card declined",
});
```

#### `logger.fatal(message, metadata?)`

Log a fatal error.

```typescript
logger.fatal("Critical service unavailable", { service: "database" });
```

#### `logger.panic(message, metadata?)`

Log a critical error and flush immediately.

```typescript
logger.panic("Database connection lost!", { host: "db.example.com" });
```

#### `logger.captureError(error, context?)`

Capture an exception with full stack trace.

```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.captureError(error, {
    userId: "123",
    operation: "payment_processing",
  });
}
```

#### `logger.flush()`

Manually flush all queued logs.

```typescript
await logger.flush();
```

#### `logger.shutdown()`

Stop the logger and flush remaining logs.

```typescript
await logger.shutdown();
```

## Examples

### Express.js

```typescript
import express from "express";
import { LuminaLog } from "@luminalog/logger";

const app = express();
const logger = new LuminaLog({
  apiKey: process.env.LUMINALOG_API_KEY!,
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.captureError(err, {
    path: req.path,
    method: req.method,
  });
  res.status(500).send("Internal Server Error");
});

const server = app.listen(3000);

// Graceful shutdown
process.on("SIGTERM", async () => {
  await logger.shutdown();
  server.close();
});
```

### Next.js API Routes

```typescript
// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { LuminaLog } from "@luminalog/logger";

const logger = new LuminaLog({
  apiKey: process.env.LUMINALOG_API_KEY!,
  environment: process.env.NODE_ENV,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    logger.info("API request", {
      method: req.method,
      path: req.url,
    });

    // Your logic here
    const users = await getUsers();

    res.status(200).json(users);
  } catch (error) {
    logger.captureError(error as Error, {
      path: req.url,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
}
```

### Nest.js

```typescript
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { LuminaLog } from "@luminalog/logger";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new LuminaLog({
    apiKey: process.env.LUMINALOG_API_KEY!,
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next();
  }
}
```

### AWS Lambda

```typescript
import { LuminaLog } from "@luminalog/logger";

const logger = new LuminaLog({
  apiKey: process.env.LUMINALOG_API_KEY!,
  environment: "production",
});

export const handler = async (event: any) => {
  try {
    logger.info("Lambda invoked", { eventType: event.type });

    // Your logic here
    const result = await processEvent(event);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    logger.captureError(error as Error, { event });
    throw error;
  } finally {
    await logger.shutdown();
  }
};
```

## Documentation

- 📘 [Full Documentation](https://luminalog.cloud/docs)
- 🚀 [Quick Start Guide](https://luminalog.cloud/docs/quick-start)
- 📖 [Node.js SDK Reference](https://luminalog.cloud/docs/sdk/nodejs)
- � [REST API Reference](https://luminalog.cloud/docs/sdk/rest-api)

## Support

- 🐛 [Report a Bug](https://github.com/mohses777/luminalog-node/issues)
- 📧 [Email Support](mailto:support@luminalog.cloud)
- 𝕏 [Twitter / X](https://x.com/LuminaLogCloud)

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © [LuminaLog Team](https://luminalog.cloud)

---

<div align="center">
  <p>Built with ❤️ by the LuminaLog team</p>
  <p>
    <a href="https://luminalog.cloud">Website</a> •
    <a href="https://luminalog.cloud/docs">Docs</a> •
    <a href="https://x.com/LuminaLogCloud">Twitter</a> •
    <a href="https://github.com/mohses777/luminalog-node">GitHub</a>
  </p>
</div>
