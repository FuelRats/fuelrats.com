import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'





class ConfirmActionButton extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
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
        this.setState({ performingAction: false })
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
      className,
      denyButtonText,
      onConfirmText,
    } = this.props

    const {
      confirmingAction,
      performingAction,
    } = this.state

    const buttonSize = className.includes('icon') ? 'icon' : 'compact'

    return (
      <div className={['action-confirmation-button', className]}>
        {confirmingAction && (<span>{confirmSubText}</span>)}
        <button
          className={[buttonSize, { green: confirmingAction }]}
          data-action="confirm"
          title={confirmButtonText}
          type="button"
          onClick={this._handleClick}
          {...this.renderProps}>
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
              className={buttonSize}
              data-action="deny"
              title={denyButtonText}
              type="button"
              onClick={this._handleClick}>
              <FontAwesomeIcon fixedWidth icon="times" />
            </button>
          )
        }
      </div>
    )
  }



  get renderProps () {
    const newProps = { ...this.props }

    delete newProps.children
    delete newProps.className
    delete newProps.confirmSubText
    delete newProps.confirmButtonText
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
    denyButtonText: 'No',
    onConfirmText: 'Applying Magic...',
  }

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    confirmButtonText: PropTypes.string,
    confirmSubText: PropTypes.string,
    denyButtonText: PropTypes.string,
    onClick: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
    onConfirmText: PropTypes.string,
  }
}




export default ConfirmActionButton
