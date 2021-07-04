import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import formatAsEliteDateTime from '~/util/date/formatAsEliteDateTime'

import styles from './Clock.module.scss'





function Clock (props) {
  const {
    className,
  } = props

  const [clock, setClock] = useState('')

  useEffect(
    () => {
      let timeoutRef = null

      function updateClock () {
        const now = Date.now()

        setClock(formatAsEliteDateTime(now, true))

        // Timeout = ms to next second. This keeps the clock in sync with system time up to the ms.
        timeoutRef = setTimeout(updateClock, 1000 - (now % 1000))
      }

      updateClock()

      return () => {
        if (timeoutRef) {
          clearTimeout(timeoutRef)
        }
      }
    },
    [],
  )


  return (
    <div className={[styles.clock, className]}>
      {clock}
    </div>
  )
}

Clock.propTypes = {
  className: PropTypes.string,
}





export default Clock
