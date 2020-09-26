const DEFAULT_TIMER = 500 // 0.5 seconds


/**
 * provides a safe way to call `requestIdleCallback`. Uses `setTimeout` in the event that `requestIdleCallback` is unavailable
 *
 * WARNING: Avoid using in server executed code.
 *
 * @param {Function} callback function to run when application is "idle"
 * @param {number} delay Time (in milliseconds) the fallback `setTimeout` method should wait before the callback is executed.
 */
export default function safeIdleCallback (callback, delay = DEFAULT_TIMER) {
  if (typeof window !== 'undefined' && window.requestIdleCallback) {
    requestIdleCallback(callback)
  } else {
    setTimeout(callback, delay)
  }
}
