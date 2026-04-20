const { LuminaLog, generateTraceId, generateSpanId } = require("../../dist");

async function main() {
  const logger = new LuminaLog({
    apiKey: process.env.LUMINALOG_API_KEY || "demo-api-key",
    environment: process.env.NODE_ENV || "development",
    projectId: "node-basic-example",
    debug: true,
  });

  const traceId = generateTraceId();
  const spanId = generateSpanId();

  logger.info("Node example started", {
    runtime: "node",
    trace_id: traceId,
    span_id: spanId,
  });

  const requestLogger = logger.child({
    service: "example-api",
    route: "/checkout",
  });

  requestLogger.warn("Payment provider latency elevated", {
    trace_id: traceId,
    span_id: spanId,
    latency_ms: 842,
  });

  try {
    throw new Error("Card processor timeout");
  } catch (error) {
    requestLogger.captureError(error, {
      trace_id: traceId,
      span_id: spanId,
      order_id: "ord_123",
    });
  }

  await logger.shutdown();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
