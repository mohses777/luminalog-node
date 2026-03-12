import * as https from "https";
import * as http from "http";
import { URL } from "url";
<<<<<<< HEAD
import { randomUUID } from "crypto";
=======
>>>>>>> e5f310c033537bbd31a2e61ac1f265e717c2cf99
import {
  LuminaLogOptions,
  LogLevel,
  LogEntry,
  LogBatch,
  IngestionResponse,
} from "./types";

const DEFAULT_ENDPOINT = "https://api.luminalog.cloud/v1/logs";
const DEFAULT_BATCH_SIZE = 100;
<<<<<<< HEAD
const MIN_BATCH_SIZE = 1;
=======
const MIN_BATCH_SIZE = 50;
>>>>>>> e5f310c033537bbd31a2e61ac1f265e717c2cf99
const MAX_BATCH_SIZE = 500;
const DEFAULT_FLUSH_INTERVAL = 5000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

<<<<<<< HEAD

export function generateTraceId(): string {
  return randomUUID();
}


export function generateSpanId(): string {
  return randomUUID();
}


export function getTraceIdFromRequest(req: any): string {
  if (req.headers) {
    const traceId = req.headers['x-trace-id'] ||
      req.headers['x-request-id'];
    if (traceId) return traceId as string;

    const traceparent = req.headers['traceparent'];
    if (traceparent && typeof traceparent === 'string') {
      const parts = traceparent.split('-');
      if (parts.length >= 2) return parts[1];
    }
  }

  return generateTraceId();
}

=======
>>>>>>> e5f310c033537bbd31a2e61ac1f265e717c2cf99
export class LuminaLog {
  private readonly apiKey: string;
  private readonly environment: string;
  private readonly projectId?: string;
  private readonly privacyMode: boolean;
  private readonly minLevel?: LogLevel;
  private readonly batchSize: number;
  private readonly flushInterval: number;
  private readonly endpoint: string;
  private readonly debugMode: boolean;
  private readonly baseMetadata: Record<string, unknown> = {};

  private queue: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isFlushing = false;

  private static readonly LOG_LEVELS: LogLevel[] = ["debug", "info", "warn", "error", "fatal", "panic"];

  constructor(options: LuminaLogOptions) {
    if (!options.apiKey) {
      throw new Error("LuminaLog: apiKey is required");
    }

    this.apiKey = options.apiKey;
    this.environment = options.environment || "default";
    this.projectId = options.projectId;
    this.privacyMode = options.privacyMode || false;
    this.minLevel = options.minLevel;
<<<<<<< HEAD

    const requestedBatchSize = options.batchSize || DEFAULT_BATCH_SIZE;
    if (requestedBatchSize < MIN_BATCH_SIZE) {
      console.warn(
        `[LuminaLog] Warning: batchSize must be at least 1. Using 1 instead.`
=======
    
    // Enforce batch size limits
    const requestedBatchSize = options.batchSize || DEFAULT_BATCH_SIZE;
    if (requestedBatchSize < MIN_BATCH_SIZE) {
      console.warn(
        `[LuminaLog] Warning: batchSize ${requestedBatchSize} is below minimum ${MIN_BATCH_SIZE}. Using ${MIN_BATCH_SIZE} instead to optimize costs.`
>>>>>>> e5f310c033537bbd31a2e61ac1f265e717c2cf99
      );
      this.batchSize = MIN_BATCH_SIZE;
    } else if (requestedBatchSize > MAX_BATCH_SIZE) {
      console.warn(
        `[LuminaLog] Warning: batchSize ${requestedBatchSize} exceeds maximum ${MAX_BATCH_SIZE}. Using ${MAX_BATCH_SIZE} instead.`
      );
      this.batchSize = MAX_BATCH_SIZE;
    } else {
      this.batchSize = requestedBatchSize;
    }
<<<<<<< HEAD

=======
    
>>>>>>> e5f310c033537bbd31a2e61ac1f265e717c2cf99
    this.flushInterval = options.flushInterval || DEFAULT_FLUSH_INTERVAL;
    this.endpoint = options.endpoint || DEFAULT_ENDPOINT;
    this.debugMode = options.debug || false;

    this.startFlushTimer();
    this.setupShutdownHooks();

    this.log("debug", "LuminaLog SDK initialized", {
      environment: this.environment,
    });
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log("debug", message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log("warn", message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.log("error", message, metadata);
  }

  fatal(message: string, metadata?: Record<string, unknown>): void {
    this.log("fatal", message, metadata);
  }

<<<<<<< HEAD

=======
  
>>>>>>> e5f310c033537bbd31a2e61ac1f265e717c2cf99
  child(metadata: Record<string, unknown>): LuminaLog {
    const childLogger = new LuminaLog({
      apiKey: this.apiKey,
      environment: this.environment,
      projectId: this.projectId,
      privacyMode: this.privacyMode,
      minLevel: this.minLevel,
      batchSize: this.batchSize,
      flushInterval: this.flushInterval,
      endpoint: this.endpoint,
      debug: this.debugMode,
    });
<<<<<<< HEAD

    (childLogger as any).baseMetadata = { ...this.baseMetadata, ...metadata };

=======
    
    (childLogger as any).baseMetadata = { ...this.baseMetadata, ...metadata };
    
>>>>>>> e5f310c033537bbd31a2e61ac1f265e717c2cf99
    return childLogger;
  }

  captureError(error: Error, context?: Record<string, unknown>): void {
    const errorPayload: import("./types").ErrorPayload = {
      type: error.name || "Error",
      message: error.message,
      stack_trace: error.stack
        ? error.stack.split("\n").map((line) => line.trim())
        : [],
      context,
    };

    const entry: import("./types").LogEntry = {
      timestamp: new Date().toISOString(),
      level: "error",
      message: error.message,
      environment: this.environment,
      privacy_mode: this.privacyMode,
      error: errorPayload,
      metadata: context,
    };

    this.queue.push(entry);

    if (this.queue.length >= this.batchSize) {
      void this.flush();
    }
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    this.captureError(error, context);
  }

  panic(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createEntry("panic", message, metadata);
    this.queue.push(entry);
    void this.flush();
  }

  async flush(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0) {
      return;
    }

    this.isFlushing = true;
    const logsToSend = [...this.queue];
    this.queue = [];

    try {
      await this.sendBatchWithRetry(logsToSend);
      if (this.debugMode) {
        console.log(`[LuminaLog] Flushed ${logsToSend.length} logs`);
      }
    } catch (error) {
      this.queue = [...logsToSend, ...this.queue];
      if (this.debugMode) {
        console.error("[LuminaLog] Failed to flush logs after retries:", error);
      }
    } finally {
      this.isFlushing = false;
    }
  }

  async shutdown(): Promise<void> {
    this.stopFlushTimer();
    await this.flush();
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    if (this.minLevel && !this.shouldLog(level)) {
      return;
    }

    const entry = this.createEntry(level, message, metadata);
    this.queue.push(entry);

    if (this.queue.length >= this.batchSize) {
      void this.flush();
    }
  }


  private shouldLog(level: LogLevel): boolean {
    if (!this.minLevel) {
      return true;
    }

    const minIndex = LuminaLog.LOG_LEVELS.indexOf(this.minLevel);
    const currentIndex = LuminaLog.LOG_LEVELS.indexOf(level);
<<<<<<< HEAD

=======
    
>>>>>>> e5f310c033537bbd31a2e61ac1f265e717c2cf99
    return currentIndex >= minIndex;
  }

  private createEntry(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): LogEntry {
    let finalMetadata = metadata ? { ...this.baseMetadata, ...metadata } : { ...this.baseMetadata };

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: this.environment,
      privacy_mode: this.privacyMode,
      metadata: Object.keys(finalMetadata).length > 0 ? finalMetadata : undefined,
    };

    if (this.projectId) {
      entry.project_id = this.projectId;
    }

    return entry;
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      void this.flush();
    }, this.flushInterval);

    this.flushTimer.unref();
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private setupShutdownHooks(): void {
    const gracefulShutdown = async () => {
      await this.shutdown();
    };

    process.on("beforeExit", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  }

  private async sendBatchWithRetry(
    logs: LogEntry[],
    attempt: number = 1
  ): Promise<IngestionResponse> {
    try {
      return await this.sendBatch(logs);
    } catch (error: any) {
      if (error.message?.includes("429") || error.message?.includes("HTTP 4")) {
        throw error;
      }

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
        if (this.debugMode) {
          console.log(
            `[LuminaLog] Retry ${attempt}/${MAX_RETRIES} after ${delay}ms...`
          );
        }
        await this.sleep(delay);
        return this.sendBatchWithRetry(logs, attempt + 1);
      }

      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async sendBatch(logs: LogEntry[]): Promise<IngestionResponse> {
    const batch: LogBatch = {
      api_key: this.apiKey,
      logs,
    };

    const body = JSON.stringify(batch);
    const url = new URL(this.endpoint);
    const isHttps = url.protocol === "https:";
    const client = isHttps ? https : http;

    return new Promise((resolve, reject) => {
      const req = client.request(
        {
          hostname: url.hostname,
          port: url.port || (isHttps ? 443 : 80),
          path: url.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
            "User-Agent": "@luminalog/logger/0.1.0",
            "x-api-key": this.apiKey,
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            if (
              res.statusCode &&
              res.statusCode >= 200 &&
              res.statusCode < 300
            ) {
              try {
                const parsed = JSON.parse(data);
                if (!parsed.debug_user_id) {
                  console.warn("Warning: No debug_user_id in response");
                }
                resolve(parsed as IngestionResponse);
              } catch {
                resolve({ message: "OK", processed: logs.length });
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.debug_user_id === undefined)
                    console.log("Warning: No debug_user_id in response");
                } catch (e) { }
              }
            } else if (res.statusCode === 429) {
              console.error(
                "[LuminaLog] 🚨 LOG QUOTA EXCEEDED: Your plan limit has been reached. Logs will be dropped until you upgrade. Visit your dashboard to upgrade: https://luminalog.cloud/dashboard/billing"
              );
              resolve({
                message: "Quota Exceeded - Logs Dropped",
                processed: 0,
              });
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          });
        }
      );

      req.on("error", reject);
      req.write(body);
      req.end();
    });
  }
}
