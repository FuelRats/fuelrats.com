import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useState, useCallback, useRef, useEffect } from 'react'

import styles from './CopyToClipboard.module.scss'




// Component Constants
const CLICKED_STATE_RESET_TIME = 1500 // 1.5 seconds




async function writeToClipboard (text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (err) {
      console.warn('[Clipboard] writeText failed, using fallback:', err.message)
    }
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  if (!document.execCommand('copy')) {
    console.error('[Clipboard] execCommand fallback also failed')
  }
  document.body.removeChild(textarea)
}




function CopyToClipboard (props) {
  const {
    as: Component = 'span',
    doHint,
    className,
    children,
    text,
  } = props
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef()


  const handleClick = useCallback(async () => {
    try {
      await writeToClipboard(String(text))
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      return
    }

    if (copied) {
      clearTimeout(timeoutRef.current)
    } else {
      setCopied(true)
    }
    timeoutRef.current = setTimeout(() => {
      setCopied(false)
      timeoutRef.current = undefined
    }, CLICKED_STATE_RESET_TIME)
  }, [copied, text])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }, [handleClick])

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])


  return (
    <Component
      aria-label={`Click to copy: ${text}`}
      className={clsx(styles.copyToClipboard, className, { [styles.copied]: copied })}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}>
      {children}
      {
        doHint && (
          <span className={styles.icon}>
            <FontAwesomeIcon icon={copied ? 'clipboard-check' : 'clipboard-list'} size="lg" />
          </span>
        )
      }
      <span aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </Component>
  )
}

CopyToClipboard.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
  doHint: PropTypes.bool,
  text: PropTypes.any.isRequired,
}





export default CopyToClipboard
