// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { createStructuredSelector } from 'reselect'

import { formatAsEliteDate } from '~/helpers/formatTime'
import { connect } from '~/store'
import {
  selectDecalEligibility,
  selectDecalsByUserId,
  selectUserById,
  withCurrentUserId,
} from '~/store/selectors'





@connect
class UserDetailsPanel extends React.Component {
  state = {
    redeeming: false,
    decalsVisible: {},
  }




  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleRedeemDecal = async () => {
    const { redeemDecal } = this.props

    this.setState({ redeeming: true })

    await redeemDecal(this.props.user.id)

    this.setState({ redeeming: false })
  }

  _handleDecalVisibilityToggle = (event) => {
    const decalID = event.target.name
    this.setState((state) => {
      return {
        decalsVisible: {
          ...state.decalsVisible,
          [decalID]: !state.decalsVisible[decalID],
        },
      }
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  renderNoDataText () {
    if (!this.props.eligible) {
      return <div className="no-decal">{"Sorry, you're not eligible for a decal."}</div>
    }

    return (
      <div className="redeem">
        <p>{"You're eligible for a decal but you haven't redeemed it yet."}</p>
        <button
          type="button"
          onClick={this._handleRedeemDecal}>
          {'Redeem'}
        </button>
      </div>
    )
  }

  renderDecalCode = (decal) => {
    return (
      <div key={decal.id} className="decal">
        <div className="code">
          <button
            aria-label="Show decal code"
            className="icon toggle"
            name={decal.id}
            type="button"
            onClick={this._handleDecalVisibilityToggle}>
            <FontAwesomeIcon fixedWidth icon={this.state.decalsVisible[decal.id] ? 'eye' : 'eye-slash'} />
          </button>
          {
          this.state.decalsVisible[decal.id]
            ? decal.attributes.code
            : `•••••-•••••-•••••-•••••-${decal.attributes.code.substring(24)}`
        }
        </div>
        <div className="claimed-at">{formatAsEliteDate(decal.attributes.claimedAt)}</div>
      </div>
    )
  }

  renderDecalCodes = () => {
    const { decals } = this.props

    return Boolean(decals.length) && decals.map(this.renderDecalCode)
  }

  render () {
    const { decals } = this.props

    const {
      redeeming,
    } = this.state

    return (
      <div className="panel user-decals">
        <header>{'Decal'}</header>
        <div className="panel-content">
          {
            (redeeming)
              ? (<div className="loading">{'Redeeming decal codes...'}</div>)
              : (this.renderDecalCodes(decals))
          }
          {!decals.length && this.renderNoDataText()}
        </div>
      </div>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['redeemDecal']

  static mapStateToProps = createStructuredSelector({
    decals: withCurrentUserId(selectDecalsByUserId),
    eligible: selectDecalEligibility,
    user: withCurrentUserId(selectUserById),
  })
}





export default UserDetailsPanel
