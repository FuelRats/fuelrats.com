import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { useCallback, useState } from 'react'




function ConfirmActionButton (props) {
  const {
    children,
    className,
    confirmButtonText = 'Yes',
    confirmSubText = 'Are you sure?',
    denyButtonText = 'No',
    onClick,
    onConfirm,
    onConfirmText = 'Applying Magic...',
    ...passthroughProps
  } = props

  const [confirmingAction, setConfirmingAction] = useState(false)
  const [performingAction, setPerformingAction] = useState(false)

  const handleClick = useCallback(async (event) => {
    const action = event.target.getAttribute('data-action')

    if (confirmingAction && action === 'confirm') {
      setConfirmingAction(false)
      setPerformingAction(true)
      const result = await onConfirm(event)
      if (result) {
        setPerformingAction(false)
      }
    } else if (confirmingAction && action === 'deny') {
      setConfirmingAction(false)
    } else if (action === 'confirm') {
      setConfirmingAction(true)
    }

    if (onClick) {
      onClick(event)
    }
  }, [confirmingAction, onClick, onConfirm])

  const buttonSize = className?.includes('icon') ? 'icon' : 'compact'

  return (
    <div className={clsx('action-confirmation-button', className)}>
      {confirmingAction && (<span>{confirmSubText}</span>)}
      <button
        aria-label={confirmButtonText}
        className={clsx(buttonSize, { green: confirmingAction })}
        data-action="confirm"
        title={confirmButtonText}
        type="button"
        onClick={handleClick}
        {...passthroughProps}>
        {
          performingAction && (
            <span name="confirm"><FontAwesomeIcon fixedWidth pulse icon="spinner" /> {onConfirmText}</span>
          )
        }
        {confirmingAction && <FontAwesomeIcon fixedWidth icon="check" />}
        {(!performingAction && !confirmingAction) && (children)}
      </button>
      {
        confirmingAction && (
          <button
            aria-label={denyButtonText}
            className={buttonSize}
            data-action="deny"
            title={denyButtonText}
            type="button"
            onClick={handleClick}>
            <FontAwesomeIcon fixedWidth icon="xmark" />
          </button>
        )
      }
    </div>
  )
}

ConfirmActionButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  confirmButtonText: PropTypes.string,
  confirmSubText: PropTypes.string,
  denyButtonText: PropTypes.string,
  onClick: PropTypes.func,
  onConfirm: PropTypes.func.isRequired,
  onConfirmText: PropTypes.string,
}




export default ConfirmActionButton
