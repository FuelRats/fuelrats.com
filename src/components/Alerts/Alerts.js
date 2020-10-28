import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'

import { selectActiveAlerts } from '~/store/selectors/alerts'

import AlertCard from './AlertCard'
import styles from './Alerts.module.scss'




// Component constants
const cardMotionConfig = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0 },
  exit: {
    opacity: 0,
    height: 0,
    pointerEvents: 'none',
  },
  transition: {
    type: 'spring',
    stiffness: 550,
    damping: 50,
  },
}





function Alerts (props) {
  const {
    className,
  } = props

  const [activeAlerts, overflow] = useSelector(selectActiveAlerts)

  if (typeof window === 'undefined') {
    return <div className={[styles.alerts, className]} />
  }

  return createPortal(
    (
      <div className={[styles.alerts, className]}>
        <AnimateSharedLayout>
          <AnimatePresence>
            {
              activeAlerts.map((alert) => {
                return (
                  <motion.div key={alert.id} layout {...cardMotionConfig}>
                    <AlertCard alert={alert} />
                  </motion.div>
                )
              })
            }
          </AnimatePresence>
        </AnimateSharedLayout>
        {
          (overflow > 0) && (
            <motion.span layout className={styles.overflow}>
              {`+${overflow} more`}
            </motion.span>
          )
        }
      </div>
    ),
    document.getElementById('AlertContainer'),
  )
}

Alerts.propTypes = {
  className: PropTypes.string,
}





export default Alerts
