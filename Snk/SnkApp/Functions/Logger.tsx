// ✅ Toggle logging here
const isLoggingEnabled = true; // set false in production

// ✅ Custom log function
export function log(...args) {
  if (isLoggingEnabled) {
    console.log(...args);
  }
}
