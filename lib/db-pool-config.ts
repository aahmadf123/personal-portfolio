import { Pool } from "pg";
import { EventEmitter } from "events";

// Increase default max listeners to prevent warnings during Netlify builds
EventEmitter.defaultMaxListeners = 20;

// Set maximum pool size based on environment
// - Development: Keep small to save resources
// - Production: Scale with expected concurrent connections
const getMaxPoolSize = () => {
  if (process.env.NODE_ENV === "production") {
    // For Netlify static builds, keep this minimal
    if (process.env.NETLIFY === "true") {
      return 5;
    }
    // For regular production, scale as needed
    return process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 20;
  }
  // Use smaller pool for development
  return process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 5;
};

// Database connection pool configuration
export const DB_POOL_CONFIG = {
  // Pool size configuration
  min: process.env.DB_POOL_MIN
    ? Number.parseInt(process.env.DB_POOL_MIN, 10)
    : 2,
  max: getMaxPoolSize(),

  // Timeout configuration (in milliseconds)
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT
    ? Number.parseInt(process.env.DB_IDLE_TIMEOUT, 10)
    : 30000,
  connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT
    ? Number.parseInt(process.env.DB_CONNECTION_TIMEOUT, 10)
    : 5000,

  // Retry configuration
  retryInterval: process.env.DB_RETRY_INTERVAL
    ? Number.parseInt(process.env.DB_RETRY_INTERVAL, 10)
    : 100,
  maxRetries: process.env.DB_MAX_RETRIES
    ? Number.parseInt(process.env.DB_MAX_RETRIES, 10)
    : 3,
};

// Function to validate pool configuration
export function validatePoolConfig() {
  const config = { ...DB_POOL_CONFIG };

  // Ensure min is at least 1
  if (config.min < 1) {
    console.warn(`Invalid DB_POOL_MIN (${config.min}), setting to 1`);
    config.min = 1;
  }

  // Ensure max is at least min
  if (config.max < config.min) {
    console.warn(
      `Invalid DB_POOL_MAX (${config.max}), setting to ${config.min}`
    );
    config.max = config.min;
  }

  return config;
}
