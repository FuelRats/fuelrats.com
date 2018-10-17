// Module imports
import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





// Component imports
import Component from './Component'





class ConfirmActionButton extends Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    actionResult: null,
    confirmingAction: false,
    performingAction: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleClick = async (event) => {
    const {
      onConfirm,
      onClick,
    } = this.props

    const {
      confirmingAction,
    } = this.state

    const action = event.target.getAttribute('data-action')

    if (confirmingAction && action === 'confirm') {
      this.setState({ confirmingAction: false, performingAction: true })
      const result = await onConfirm(event)
      if (result) {
        this.setState({ performingAction: false, actionResult: result })
      }
    } else if (confirmingAction && action === 'deny') {
      this.setState({ confirmingAction: false })
    } else if (action === 'confirm') {
      this.setState({ confirmingAction: true })
    }

    if (onClick) {
      onClick(event)
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      children,
      confirmButtonText,
      confirmSubText,
      containerClassName,
      denyButtonText,
      onConfirmText,
    } = this.props

    const {
      actionResult,
      confirmingAction,
      performingAction,
    } = this.state

    return (
      <div className={`action-confirmation-button${containerClassName ? ` ${containerClassName}` : ''}`}>
        {confirmingAction && (<span>{confirmSubText}</span>)}
        {confirmingAction && (
          <button
            className="compact"
            data-action="deny"
            onClick={this._handleClick}
            type="button">
            {denyButtonText}
          </button>
        )}
        <button
          className={confirmingAction ? 'compact green' : 'compact'}
          data-action="confirm"
          onClick={this._handleClick}
          type="button"
          {...this.renderProps}>
          {performingAction && (
            <span name="confirm"><FontAwesomeIcon icon="spinner" pulse /> {onConfirmText}</span>
          )}
          {confirmingAction && confirmButtonText}
          {(!performingAction && !confirmingAction) && (actionResult || children)}
        </button>
      </div>
    )
  }



  get renderProps () {
    const newProps = { ...this.props }

    delete newProps.children
    delete newProps.confirmSubText
    delete newProps.confirmButtonText
    delete newProps.containerClassName
    delete newProps.denyButtonText
    delete newProps.onClick
    delete newProps.onConfirm
    delete newProps.onConfirmText

    return newProps
  }



  /***************************************************************************\
    Prop Properties
  \***************************************************************************/

  static defaultProps = {
    confirmButtonText: 'Yes',
    confirmSubText: 'Are you sure?',
    containerClassName: null,
    denyButtonText: 'No',
    onConfirmText: 'Applying Magic...',
  }

  static propTypes = {
    confirmButtonText: PropTypes.string,
    confirmSubText: PropTypes.string,
    containerClassName: PropTypes.string,
    denyButtonText: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onConfirmText: PropTypes.string,
  }
}




export default ConfirmActionButton
