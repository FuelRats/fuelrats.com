// Module imports
import moment from 'moment'
import React from 'react'





// Component imports
import { connect } from '../store'





const UserDetailsPanel = props => {
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





UserDetailsPanel.mapStateToProps = state => state.user || {}





export default connect(UserDetailsPanel)
