// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { formatAsEliteDate } from '../helpers/formatTime'





// Module imports
import { connect } from '../store'
import {
  selectDecalEligibility,
  selectDecalsByUserId,
  withCurrentUserId,
} from '../store/selectors'





@connect
class UserDetailsPanel extends React.Component {
  state = {
    checkingEligibility: true,
    redeeming: false,
    decalsVisible: {},
  }




  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleRedeemDecal = async () => {
    const { redeemDecal } = this.props

    this.setState({ redeeming: true })

    await redeemDecal()

    this.setState({ redeeming: false })
  }

  _handleDecalVisibilityToggle = (event) => {
    const decalID = event.target.name
    this.setState((state) => ({
      decalsVisible: {
        ...state.decalsVisible,
        [decalID]: !state.decalsVisible[decalID],
      },
    }))
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const {
      checkDecalEligibility,
      eligible,
    } = this.props

    if (!eligible) {
      await checkDecalEligibility()
    }

    this.setState({ checkingEligibility: false })
  }

  renderNoDataText () {
    const {
      eligible,
    } = this.props

    const { checkingEligibility } = this.state

    if (!checkingEligibility) {
      if (!eligible) {
        return <div className="no-decal">Sorry, you're not eligible for a decal.</div>
      }

      return (
        <div className="redeem">
          <p>You're eligible for a decal but you haven't redeemed it yet.</p>
          <button
            onClick={this._handleRedeemDecal}
            type="button">
            Redeem
          </button>
        </div>
      )
    }

    return null
  }

  renderDecalCode = (decal) => (
    <div className="decal" key={decal.id}>
      <div className="code">
        <button
          aria-label="Show decal code"
          className="icon toggle"
          name={decal.id}
          onClick={this._handleDecalVisibilityToggle}
          type="button">
          <FontAwesomeIcon icon={this.state.decalsVisible[decal.id] ? 'eye' : 'eye-slash'} fixedWidth />
        </button>
        {this.state.decalsVisible[decal.id]
          ? decal.attributes.code
          : `•••••-•••••-•••••-•••••-${decal.attributes.code.substring(24)}`}
      </div>
      <div className="claimed-at">{formatAsEliteDate(decal.attributes.claimedAt)}</div>
    </div>
  )

  renderDecalCodes = () => {
    const { decals } = this.props

    return Boolean(decals.length) && decals.map(this.renderDecalCode)
  }

  render () {
    const { decals } = this.props

    const {
      checkingEligibility,
      redeeming,
    } = this.state

    const loadingText = checkingEligibility ? 'Checking decal eligibility...' : 'Redeeming decal codes...'

    return (
      <div className="panel user-decals">
        <header>Decal</header>
        <div className="panel-content">
          {(checkingEligibility || redeeming)
            ? (<div className="loading">{loadingText}</div>)
            : (this.renderDecalCodes(decals))}
          {!decals.length && this.renderNoDataText()}
        </div>
      </div>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['checkDecalEligibility', 'redeemDecal']

  static mapStateToProps = (state) => ({
    decals: withCurrentUserId(selectDecalsByUserId)(state),
    eligible: selectDecalEligibility(state),
  })
}





export default UserDetailsPanel
