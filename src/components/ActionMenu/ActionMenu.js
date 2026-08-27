import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './ActionMenu.module.scss'


const DROPDOWN_GAP = 4
const VIEWPORT_MARGIN = 8


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
      let top = rect.bottom + DROPDOWN_GAP
      let left = rect.right

      const dropdown = dropdownRef.current
      if (dropdown) {
        const { width, height } = dropdown.getBoundingClientRect()
        // The dropdown is translated by -100%, so `left` is its right edge.
        left = Math.min(left, window.innerWidth - VIEWPORT_MARGIN)
        left = Math.max(left, width + VIEWPORT_MARGIN)
        top = Math.min(top, window.innerHeight - height - VIEWPORT_MARGIN)
        top = Math.max(top, VIEWPORT_MARGIN)
      }

      setPosition({ top, left })
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

  useEffect(() => {
    if (!open) {
      return undefined
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setConfirming(null)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const dropdownCallbackRef = useCallback((node) => {
    dropdownRef.current = node
    if (node && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const { width, height } = node.getBoundingClientRect()
      // The dropdown is translated by -100%, so `left` is its right edge.
      const left = Math.max(
        Math.min(rect.right, window.innerWidth - VIEWPORT_MARGIN),
        width + VIEWPORT_MARGIN,
      )
      const top = Math.max(
        Math.min(rect.bottom + DROPDOWN_GAP, window.innerHeight - height - VIEWPORT_MARGIN),
        VIEWPORT_MARGIN,
      )
      setPosition({ top, left })
      node.querySelector('button')?.focus()
    }
  }, [])

  const handleItemClick = useCallback((item) => {
    if (item.confirm && confirming !== item.key) {
      setConfirming(item.key)
      return
    }
    setConfirming(null)
    setOpen(false)
    item.onAction()
  }, [confirming])

  const portalContainer = typeof document === 'undefined'
    ? null
    : document.getElementById('OverlayContainer')

  return (
    <div className={styles.actionMenu}>
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-haspopup="menu"
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
            ref={dropdownCallbackRef}
            className={styles.dropdown}
            role="menu"
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
                    role="menuitem"
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
