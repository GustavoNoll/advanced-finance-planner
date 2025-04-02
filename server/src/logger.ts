import { writeFile, appendFile, mkdir } from 'fs/promises';
import path from 'path';

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'ERROR';
  message: string;
  data?: any;
}

/**
 * Logger utility that writes to both file and console
 */
export class Logger {
  private static logFile = path.join(process.cwd(), 'logs', 'indicators.log');

  /**
   * Ensures the logs directory exists
   */
  private static async ensureLogDirectory() {
    const logDir = path.join(process.cwd(), 'logs');
    try {
      await mkdir(logDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, which is fine
    }
  }

  /**
   * Formats a log entry
   */
  private static formatLogEntry(entry: LogEntry): string {
    return `[${entry.timestamp}] ${entry.level}: ${entry.message}${
      entry.data ? `\nData: ${JSON.stringify(entry.data, null, 2)}` : ''
    }\n`;
  }

  /**
   * Logs an info message
   */
  static async info(message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      data,
    };

    const logMessage = this.formatLogEntry(entry);
    console.log(logMessage);
    await this.writeToFile(logMessage);
  }

  /**
   * Logs an error message
   */
  static async error(message: string, error?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      data: error,
    };

    const logMessage = this.formatLogEntry(entry);
    console.error(logMessage);
    await this.writeToFile(logMessage);
  }

  /**
   * Writes a log message to file
   */
  private static async writeToFile(message: string) {
    await this.ensureLogDirectory();
    await appendFile(this.logFile, message);
  }
} 