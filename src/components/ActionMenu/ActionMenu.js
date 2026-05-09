import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './ActionMenu.module.scss'


function ActionMenu ({ items }) {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(null)
  const [position, setPosition] = useState(null)
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!open || !triggerRef.current) {
      setPosition(null)
      return undefined
    }

    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 4,
        left: rect.right,
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return undefined
    }
    const handleClickOutside = (event) => {
      if (
        triggerRef.current?.contains(event.target)
        || dropdownRef.current?.contains(event.target)
      ) {
        return
      }
      setOpen(false)
      setConfirming(null)
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

  const portalContainer = typeof document !== 'undefined'
    ? document.getElementById('ModalContainer')
    : null

  return (
    <div className={styles.actionMenu}>
      <button
        ref={triggerRef}
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
        open && position && portalContainer && createPortal(
          <div
            ref={dropdownRef}
            className={styles.dropdown}
            style={{ top: position.top, left: position.left }}>
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
          </div>,
          portalContainer,
        )
      }
    </div>
  )
}


export default ActionMenu
