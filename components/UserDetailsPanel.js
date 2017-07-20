// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import moment from 'moment'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Module imports
import {
  actions,
  initStore,
} from '../store'
import Component from './Component'





class UserDetailsPanel extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let {
      attributes,
      id,
    } = this.props

    attributes || (attributes = {})

    let {
      createdAt,
      email,
    } = attributes

    return (
      <div className="panel user-details">
        <header>
          User Details
        </header>

        <div className="panel-content">
          <div className="avatar medium"><img src={`//api.adorable.io/avatars/${id}`} /></div>

          <label>Email:</label>
          <span>
            <a href={`mailto:${email}`}>{email}</a>
          </span>

          <label>Member Since:</label>
          <span>{moment(createdAt).add(1286, 'years').format('DD MMMM, YYYY')}</span>
        </div>
      </div>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    getRats: bindActionCreators(actions.getRats, dispatch),
  }
}

const mapStateToProps = state => {
  return state.user || {}
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UserDetailsPanel)
