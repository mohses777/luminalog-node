export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal" | "panic";

export interface ErrorPayload {
  type: string;
  message: string;
  stack_trace?: string[];
  fingerprint?: string;
  context?: Record<string, unknown>;
}

export interface LuminaLogOptions {
  apiKey: string;
  environment?: string;
  projectId?: string;
  privacyMode?: boolean;
  minLevel?: LogLevel;
  batchSize?: number;
  flushInterval?: number;
  endpoint?: string;
  debug?: boolean;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  environment: string;
  project_id?: string;
  privacy_mode?: boolean;
  error?: ErrorPayload;
  metadata?: Record<string, unknown>;
  trace_id?: string;
  span_id?: string;
  parent_span_id?: string;
}

export interface LogBatch {
  api_key: string;
  logs: LogEntry[];
}

export interface IngestionResponse {
  message: string;
  processed: number;
}