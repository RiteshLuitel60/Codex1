export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function isRedisConfigured() {
  return Boolean(process.env.REDIS_HOST || process.env.REDIS_URL);
}
