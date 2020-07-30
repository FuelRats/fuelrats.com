import { useEffect } from 'react'


function getWindow () {
  return typeof window === 'undefined' ? undefined : window
}

/**
 * Hook which attaches an event listener function to a target.
 *
 * @param {string} type A string representing the event type to listen for
 * @param {Function} listener Function which is called when the event is triggered
 * @param {object?} options An options object which determines behavior of the event listener
 * @param {boolean} options.listen Boolean value which determines if the event listener should be mounted.
 * @param {boolean} options.capture see [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)
 * @param {boolean} options.once see [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)
 * @param {boolean} options.passive see [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)
 * @param {EventTarget?} target EventTarget to attach the listener to. Defaults to `window`
 */
export default function useEventListener (type, listener, options = {}, target = getWindow()) {
  const { listen = true, capture = false, once = false, passive = false } = options

  useEffect(() => {
    if (listen && typeof target !== undefined) {
      target.addEventListener(type, listener, { capture, once, passive })
    }

    return () => {
      if (listen && typeof target !== undefined) {
        target.removeEventListener(type, listener, { capture, once, passive })
      }
    }
  }, [capture, listen, listener, once, passive, target, type])
}
