/**
 * Reads a required environment variable, throwing if it is missing or empty.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable "${key}" is not set.`);
  }
  return value;
}

/**
 * Reads an optional environment variable, returning undefined if absent.
 */
export function optionalEnv(key: string): string | undefined {
  return process.env[key] || undefined;
}
