// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import React from 'react'





// Component imports
import { actions } from '../store'





const UserDetailsPanel = (props) => {
  let { attributes } = props

  attributes = attributes || {}

  const {
    createdAt,
    email,
    image,
  } = attributes

  return (
    <div className="panel user-details">
      <header>
        Details
      </header>

      <div className="panel-content">
        <div className="avatar medium"><img alt="User's avatar" src={image} /></div>

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





const mapDispatchToProps = dispatch => ({ getRats: bindActionCreators(actions.getRats, dispatch) })

const mapStateToProps = state => state.user || {}





export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsPanel)
