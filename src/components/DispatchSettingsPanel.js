import clsx from 'clsx'
import PropTypes from 'prop-types'
import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react'

import styles from './DispatchSettingsPanel.module.scss'


function DispatchSettingsPanel ({
  className, open, onClose, settings, onUpdate,
}) {
  const panelRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) {
      return undefined
    }
    const handleClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open, onClose])

  // Entry/exit animation
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useLayoutEffect(() => {
    if (open) {
      setVisible(true)
      setClosing(false)
    } else if (visible) {
      setClosing(true)
      const CLOSE_ANIMATION_MS = 150
      const timer = setTimeout(() => {
        setVisible(false)
        setClosing(false)
      }, CLOSE_ANIMATION_MS)
      return () => {
        return clearTimeout(timer)
      }
    }
    return undefined
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps -- only react to open changes

  const handleToggle = useCallback((key) => {
    onUpdate(key, !settings[key])
  }, [settings, onUpdate])

  if (!visible) {
    return null
  }

  return (
    <div ref={panelRef} className={clsx(styles.panel, { [styles.closing]: closing }, className)}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{'Board Settings'}</h3>

        <div className={styles.optionRow}>
          <span className={styles.optionLabel}>{'Auto-open new cases'}</span>
          <button
            className={clsx(styles.toggle, { [styles.toggleOn]: settings.autoOpenNewCases })}
            type="button"
            onClick={
              () => {
                return handleToggle('autoOpenNewCases')
              }
            }>
            {settings.autoOpenNewCases ? 'On' : 'Off'}
          </button>
        </div>
      </section>
    </div>
  )
}

DispatchSettingsPanel.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  settings: PropTypes.shape({
    autoOpenNewCases: PropTypes.bool,
  }).isRequired,
}


export default DispatchSettingsPanel
