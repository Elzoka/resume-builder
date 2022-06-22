import winston from "winston";
import config from "@/config";

const { combine, timestamp, printf, ms, colorize } = winston.format;

const custom_format = printf(
  ({ level, message, label, timestamp, ms, service, ...meta }) => {
    const rest = meta[Symbol.for("splat")] || [];

    const stringifiedRest = rest
      .map((el) => (el instanceof Error ? el.stack : JSON.stringify(el)))
      .join(" ");

    return `${timestamp} [${service}] ${level}: ${message} ${stringifiedRest} (${ms})`;
  }
);

const logger = winston.createLogger({
  level: config.log_level,
  silent: process.env.NODE_ENV === "test",
  format: combine(colorize(), timestamp(), ms(), custom_format),
  defaultMeta: { service: config.service },
  transports: [new winston.transports.Console()],
});

export default logger;
