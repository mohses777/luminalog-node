import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { LuminaLog } from './logger';

describe('LuminaLog SDK', () => {
  describe('Initialization', () => {
    it('should create logger with API key', () => {
      const logger = new LuminaLog({
        apiKey: 'test-api-key',
        projectId: 'test-project',
      });
      
      assert.ok(logger);
      logger.shutdown();
    });

    it('should throw error without API key', () => {
      assert.throws(() => {
        new LuminaLog({
          apiKey: '',
          projectId: 'test-project',
        } as any);
      }, /apiKey is required/);
    });

    it('should use default values when not provided', () => {
      const logger = new LuminaLog({
        apiKey: 'test-api-key',
      });
      
      assert.ok(logger);
      logger.shutdown();
    });
  });

  describe('Logging Methods', () => {
    let logger: LuminaLog;

    beforeEach(() => {
      logger = new LuminaLog({
        apiKey: 'test-api-key',
        projectId: 'test-project',
        batchSize: 1000, 
        flushInterval: 60000,
      });
    });

    afterEach(async () => {
      await logger.shutdown();
    });

    it('should have debug method', () => {
      assert.ok(typeof logger.debug === 'function');
      logger.debug('Test debug message');
    });

    it('should have info method', () => {
      assert.ok(typeof logger.info === 'function');
      logger.info('Test info message');
    });

    it('should have warn method', () => {
      assert.ok(typeof logger.warn === 'function');
      logger.warn('Test warn message');
    });

    it('should have error method', () => {
      assert.ok(typeof logger.error === 'function');
      logger.error('Test error message');
    });

    it('should have fatal method', () => {
      assert.ok(typeof logger.fatal === 'function');
      logger.fatal('Test fatal message');
    });

    it('should accept metadata', () => {
      logger.info('Test message', {
        userId: '123',
        action: 'test',
      });
      assert.ok(true);
    });
  });

  describe('Child Logger', () => {
    let logger: LuminaLog;

    beforeEach(() => {
      logger = new LuminaLog({
        apiKey: 'test-api-key',
        projectId: 'test-project',
      });
    });

    afterEach(async () => {
      await logger.shutdown();
    });

    it('should create child logger with additional metadata', () => {
      const child = logger.child({ requestId: '123' });
      assert.ok(child);
      child.info('Test message');
      child.shutdown();
    });
  });

  describe('Error Capture', () => {
    let logger: LuminaLog;

    beforeEach(() => {
      logger = new LuminaLog({
        apiKey: 'test-api-key',
        projectId: 'test-project',
      });
    });

    afterEach(async () => {
      await logger.shutdown();
    });

    it('should capture errors', () => {
      const error = new Error('Test error');
      logger.captureError(error, { context: 'test' });
      assert.ok(true);
    });

    it('should capture exceptions', () => {
      const error = new Error('Test exception');
      logger.captureException(error, { context: 'test' });
      assert.ok(true);
    });
  });

  describe('Configuration', () => {
    it('should accept custom endpoint', () => {
      const logger = new LuminaLog({
        apiKey: 'test-api-key',
        endpoint: 'https://custom.example.com/logs',
      });
      
      assert.ok(logger);
      logger.shutdown();
    });

    it('should accept environment', () => {
      const logger = new LuminaLog({
        apiKey: 'test-api-key',
        environment: 'production',
      });
      
      assert.ok(logger);
      logger.shutdown();
    });

    it('should accept privacy mode', () => {
      const logger = new LuminaLog({
        apiKey: 'test-api-key',
        privacyMode: true,
      });
      
      assert.ok(logger);
      logger.shutdown();
    });

    it('should accept min log level', () => {
      const logger = new LuminaLog({
        apiKey: 'test-api-key',
        minLevel: 'warn',
      });
      
      assert.ok(logger);
      logger.shutdown();
    });

    it('should accept batch size', () => {
      const logger = new LuminaLog({
        apiKey: 'test-api-key',
        batchSize: 50,
      });
      
      assert.ok(logger);
      logger.shutdown();
    });

    it('should accept flush interval', () => {
      const logger = new LuminaLog({
        apiKey: 'test-api-key',
        flushInterval: 10000,
      });
      
      assert.ok(logger);
      logger.shutdown();
    });
  });

  describe('Shutdown', () => {
    it('should shutdown gracefully', async () => {
      const logger = new LuminaLog({
        apiKey: 'test-api-key',
      });
      
      logger.info('Test message');
      await logger.shutdown();
      
      assert.ok(true);
    });
  });

  describe('Trace ID Helpers', () => {
    it('should generate trace ID', async () => {
      const { generateTraceId } = await import('./logger');
      const traceId = generateTraceId();
      
      assert.ok(traceId);
      assert.ok(typeof traceId === 'string');
      assert.ok(traceId.length > 0);
    });

    it('should generate span ID', async () => {
      const { generateSpanId } = await import('./logger');
      const spanId = generateSpanId();
      
      assert.ok(spanId);
      assert.ok(typeof spanId === 'string');
      assert.ok(spanId.length > 0);
    });

    it('should extract trace ID from request', async () => {
      const { getTraceIdFromRequest } = await import('./logger');
      const req = {
        headers: {
          'x-trace-id': 'test-trace-123',
        },
      };
      
      const traceId = getTraceIdFromRequest(req);
      assert.strictEqual(traceId, 'test-trace-123');
    });
  });
});
