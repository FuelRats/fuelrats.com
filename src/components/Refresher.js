import PropTypes from 'prop-types'
import { useLayoutEffect, useState } from 'react'

/**
 * Renders text that changes over time, refreshing it when the formatter says it will next change.
 * @param {object} props
 * @param {import('react').ElementType} [props.as] Element to render. Defaults to `span`.
 * @param {string} [props.className]
 * @param {string} props.from Timestamp passed to `fmtFn`.
 * @param {(from: string) => [string, number | null]} props.fmtFn Returns the text and the milliseconds until it next
 * changes, or `null` once it no longer changes. It must be a stable reference (e.g. a module-level function), since a
 * new function restarts the timer on every render.
 * @returns {import('react').ReactElement}
 */
function Refresher (props) {
  const {
    as: Element = 'span',
    className,
    from,
    fmtFn,
  } = props
  const [text, setText] = useState('')

  // A layout effect sets the first text before the browser paints, so the element never shows up empty. Effects don't
  // run during server rendering, which keeps the time-dependent text out of the hydrated markup.
  useLayoutEffect(() => {
    let timeoutId = null

    function refresh () {
      const [newText, next] = fmtFn(from)
      setText(newText)
      if (next !== null) {
        timeoutId = setTimeout(refresh, next)
      }
    }

    refresh()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [from, fmtFn])

  return <Element className={className}>{text}</Element>
}

Refresher.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  fmtFn: PropTypes.func.isRequired,
  from: PropTypes.string.isRequired,
}

export default Refresher
