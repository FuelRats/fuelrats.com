import { useEffect } from 'react'




const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'iframe',
].join(',')


function getFocusableElements (container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
    .filter((el) => {
      return el.offsetParent !== null || el === document.activeElement
    })
}


/**
 * Traps focus within the given container while enabled. On enable, moves
 * focus to the first focusable element inside. On disable/unmount,
 * restores focus to whatever had it when the trap engaged.
 * @param {import('react').RefObject<HTMLElement>} containerRef
 * @param {boolean} [enabled]
 */
export default function useFocusTrap (containerRef, enabled = true) {
  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) {
      return undefined
    }

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    // Move focus into the container if it isn't already.
    if (!container.contains(document.activeElement)) {
      const focusables = getFocusableElements(container)
      focusables[0]?.focus()
    }

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') {
        return
      }
      const focusables = getFocusableElements(container)
      if (focusables.length === 0) {
        event.preventDefault()
        return
      }
      const [first] = focusables
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [enabled, containerRef])
}
