// Professional logging system
type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
  error?: Error
}

class Logger {
  private isDev = process.env.NODE_ENV === "development"
  private logs: LogEntry[] = []

  private createLogEntry(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      error,
    }
  }

  private log(entry: LogEntry) {
    this.logs.push(entry)

    // Keep only last 100 logs in memory
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100)
    }

    if (this.isDev) {
      const { level, message, data, error } = entry
      const logMethod = console[level] || console.log

      if (error) {
        logMethod(`[${level.toUpperCase()}] ${message}`, error, data)
      } else {
        logMethod(`[${level.toUpperCase()}] ${message}`, data)
      }
    }
  }

  info(message: string, data?: any) {
    this.log(this.createLogEntry("info", message, data))
  }

  warn(message: string, data?: any) {
    this.log(this.createLogEntry("warn", message, data))
  }

  error(message: string, error?: Error, data?: any) {
    this.log(this.createLogEntry("error", message, data, error))

    // In production, you might want to send errors to a service
    if (!this.isDev && error) {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { message, data })
    }
  }

  debug(message: string, data?: any) {
    if (this.isDev) {
      this.log(this.createLogEntry("debug", message, data))
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const logger = new Logger()
