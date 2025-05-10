// Database connection pool configuration
export const DB_POOL_CONFIG = {
  // Pool size configuration
  min: process.env.DB_POOL_MIN ? Number.parseInt(process.env.DB_POOL_MIN, 10) : 2,
  max: process.env.DB_POOL_MAX ? Number.parseInt(process.env.DB_POOL_MAX, 10) : 10,

  // Timeout configuration (in milliseconds)
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT ? Number.parseInt(process.env.DB_IDLE_TIMEOUT, 10) : 30000,
  connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT
    ? Number.parseInt(process.env.DB_CONNECTION_TIMEOUT, 10)
    : 5000,

  // Retry configuration
  retryInterval: process.env.DB_RETRY_INTERVAL ? Number.parseInt(process.env.DB_RETRY_INTERVAL, 10) : 100,
  maxRetries: process.env.DB_MAX_RETRIES ? Number.parseInt(process.env.DB_MAX_RETRIES, 10) : 3,
}

// Function to validate pool configuration
export function validatePoolConfig() {
  const config = { ...DB_POOL_CONFIG }

  // Ensure min is at least 1
  if (config.min < 1) {
    console.warn(`Invalid DB_POOL_MIN (${config.min}), setting to 1`)
    config.min = 1
  }

  // Ensure max is at least min
  if (config.max < config.min) {
    console.warn(`Invalid DB_POOL_MAX (${config.max}), setting to ${config.min}`)
    config.max = config.min
  }

  return config
}
