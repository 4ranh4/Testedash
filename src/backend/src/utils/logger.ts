import winston from "winston";

// ============================================
// Winston Logger Configuration
// ============================================
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "ads-saas-backend" },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          
          // Add metadata if exists
          if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
          }
          
          return msg;
        })
      )
    }),
    
    // Write errors to error.log
    new winston.transports.File({ 
      filename: "logs/error.log", 
      level: "error",
      format: winston.format.json()
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: "logs/combined.log",
      format: winston.format.json()
    })
  ]
});

// If we're not in production, log to the console with a simpler format
if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
