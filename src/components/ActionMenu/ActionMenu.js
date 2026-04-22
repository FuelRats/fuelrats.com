import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './ActionMenu.module.scss'


function ActionMenu ({ items }) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
        setConfirming(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleItemClick = useCallback((item) => {
    if (item.confirm && confirming !== item.key) {
      setConfirming(item.key)
      return
    }
    setConfirming(null)
    setOpen(false)
    item.onAction()
  }, [confirming])

  return (
    <div ref={menuRef} className={styles.actionMenu}>
      <button
        className={styles.trigger}
        title="Actions"
        type="button"
        onClick={
          () => {
            setOpen((prev) => {
              return !prev
            })
            setConfirming(null)
          }
        }>
        <FontAwesomeIcon fixedWidth icon="ellipsis-h" />
      </button>
      {
        open && (
          <div className={styles.dropdown}>
            {
              items.map((item) => {
                if (item.divider) {
                  return <div key={item.key} className={styles.divider} />
                }
                return (
                  <button
                    key={item.key}
                    className={clsx(styles.item, { [styles.danger]: item.danger })}
                    type="button"
                    onClick={
                      () => {
                        return handleItemClick(item)
                      }
                    }>
                    {item.icon && (<FontAwesomeIcon fixedWidth icon={item.icon} />)}
                    {confirming === item.key ? (item.confirmLabel ?? 'Confirm?') : item.label}
                  </button>
                )
              })
            }
          </div>
        )
      }
    </div>
  )
}


export default ActionMenu
