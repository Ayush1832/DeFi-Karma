// No-op replacement for Base Account telemetry to prevent errors
// This file replaces @base-org/account/src/core/telemetry/initCCA

export async function loadTelemetryScript(): Promise<void> {
  // No-op - return immediately without loading anything
  return Promise.resolve();
}

export function initCCA(): void {
  // No-op - do nothing
}

// Export default to match the original module structure
const telemetry = {
  loadTelemetryScript,
  initCCA,
};

export default telemetry;
