import PropTypes from 'prop-types'
import { useLayoutEffect, useState } from 'react'

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
