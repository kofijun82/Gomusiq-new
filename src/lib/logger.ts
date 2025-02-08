import { User } from '../types';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  user?: Pick<User, 'id' | 'email'>;
  error?: Error;
  context?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatError(error: Error): string {
    return `${error.name}: ${error.message}\n${error.stack || ''}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: Error,
    context?: Record<string, any>
  ): LogEntry {
    const user = window.localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : undefined;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (parsedUser) {
      entry.user = {
        id: parsedUser.id,
        email: parsedUser.email,
      };
    }

    if (error) {
      entry.error = error;
      console.error(error);
    }

    return entry;
  }

  private addLog(entry: LogEntry) {
    this.logs.unshift(entry);
    
    // Keep logs under the maximum limit
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const consoleArgs = [
        `[${entry.level.toUpperCase()}] ${entry.message}`,
        entry.context || '',
        entry.error ? this.formatError(entry.error) : '',
      ].filter(Boolean);

      switch (entry.level) {
        case 'error':
          console.error(...consoleArgs);
          break;
        case 'warn':
          console.warn(...consoleArgs);
          break;
        default:
          console.log(...consoleArgs);
      }
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.addLog(this.createLogEntry('info', message, undefined, context));
  }

  warn(message: string, context?: Record<string, any>) {
    this.addLog(this.createLogEntry('warn', message, undefined, context));
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.addLog(this.createLogEntry('error', message, error, context));
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();