import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

function Refresher (props) {
  const {
    as: Element = 'span',
    className,
    from,
    fmtFn,
  } = props
  const [text, setText] = useState('')

  useEffect(() => {
    let timeoutId = null

    function refresh () {
      const [newText, next] = fmtFn(from)
      setText(newText)
      if (next !== null) {
        timeoutId = setTimeout(refresh, next)
      }
    }

    if (typeof window !== 'undefined') {
      refresh()
    }

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
