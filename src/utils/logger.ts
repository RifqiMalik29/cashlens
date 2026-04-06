/* eslint-disable no-console */
/**
 * Centralized debug logger for CashLens
 *
 * In production, console logs are disabled to:
 * - Improve performance
 * - Reduce bundle size
 * - Prevent sensitive data leakage
 *
 * Usage:
 *   import { logger } from '@utils/logger';
 *
 *   logger.debug('Debug message', data);  // Only in __DEV__
 *   logger.info('Info message', data);    // Only in __DEV__
 *   logger.warn('Warning message', data); // Only in __DEV__
 *   logger.error('Error message', error); // Always logged (including production)
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
  enabled?: boolean;
  prefix?: string;
}

class Logger {
  private enabled: boolean;
  private prefix: string;

  constructor(config: LoggerConfig = {}) {
    this.enabled = config.enabled ?? __DEV__;
    this.prefix = config.prefix ?? "";
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = __DEV__
      ? new Date().toISOString().split("T")[1].split(".")[0]
      : "";
    return `${this.prefix}[${level.toUpperCase()}]${timestamp ? ` ${timestamp}` : ""} ${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (!this.enabled) return;
    console.debug(this.formatMessage("debug", message), ...args);
  }

  info(message: string, ...args: unknown[]): void {
    if (!this.enabled) return;
    console.info(this.formatMessage("info", message), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    if (!this.enabled) return;
    console.warn(this.formatMessage("warn", message), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    // Errors are always logged, even in production
    console.error(this.formatMessage("error", message), ...args);
  }

  /**
   * Create a child logger with a specific prefix
   */
  child(prefix: string): Logger {
    return new Logger({
      enabled: this.enabled,
      prefix: `${this.prefix}${prefix} `
    });
  }
}

// Export default logger instance
export const logger = new Logger({ prefix: "[CashLens]" });

// Export factory function for custom loggers
export function createLogger(prefix: string): Logger {
  return logger.child(prefix);
}
