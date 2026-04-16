import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useState, useCallback, useRef, useEffect } from 'react'

import styles from './CopyToClipboard.module.scss'




// Component Constants
const CLICKED_STATE_RESET_TIME = 1500 // 1.5 seconds




async function writeToClipboard (text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  throw new Error('Clipboard API unavailable')
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
      // eslint-disable-next-line no-console
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
      onClick={handleClick}>
      {children}
      {
        doHint && (
          <span className={styles.icon}>
            <FontAwesomeIcon icon={copied ? 'clipboard-check' : 'clipboard-list'} size="lg" />
          </span>
        )
      }
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
