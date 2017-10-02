// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'





// Module imports
import { actions } from '../store'
import Component from './Component'





class UserDetailsPanel extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    await this.props.checkDecalEligibility()

    this.setState({ eligibilityChecked: true })
  }

  constructor (props) {
    super(props)

    this.state = {
      eligibilityChecked: false,
    }
  }

  render () {
    let {
      decals,
      eligible,
    } = this.props

    let { eligibilityChecked } = this.state

    return (
      <div className="panel user-decals">
        <header>
          Decal
        </header>

        <div className="panel-content">
          {(eligibilityChecked && !eligible) && (
            `Sorry, you're not eligible for a decal at this time.`
          )}

          {(eligibilityChecked && eligible) && (
            `Woot! You're eligible for a decal!`
          )}

          {!eligibilityChecked && (
            `Checking eligibility...`
          )}
        </div>
      </div>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    checkDecalEligibility: bindActionCreators(actions.checkDecalEligibility, dispatch),
  }
}

const mapStateToProps = state => {
  return state.decals
}





export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsPanel)
