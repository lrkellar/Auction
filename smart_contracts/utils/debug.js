function debugLog(message, error) {
  if (process.env.DEBUG) {
    if (error) {
      console.error(`[DEBUG] ${message}`, error);
    } else {
      console.debug(`[DEBUG] ${message}`);
    }
  }
}

module.exports = { debugLog };
