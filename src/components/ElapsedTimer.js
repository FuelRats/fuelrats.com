import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import { formatTimeElapsed } from '~/helpers/formatTime'





function ElapsedTimer (props) {
  const {
    as: Element = 'span',
    className,
    from,
  } = props
  const [timeString, setTimeString] = useState('')

  useEffect(() => {
    let timeoutId = null

    function setTime () {
      const [newTimeString, remainderMs] = formatTimeElapsed(from)
      setTimeString(newTimeString)
      timeoutId = setTimeout(setTime, 1000 - remainderMs)
    }

    if (typeof window !== 'undefined') {
      setTime()
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [from])


  return (
    <Element className={className}>{timeString}</Element>
  )
}

ElapsedTimer.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  from: PropTypes.string.isRequired,
}





export default ElapsedTimer
