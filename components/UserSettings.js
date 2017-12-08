// Module imports
import React from 'react'
import { connect } from 'react-redux'





// Module imports
import ChangePasswordForm from './ChangePasswordForm'





const UserSettings = () => (
  <div className="user-settings">
    <ChangePasswordForm />
  </div>
)





const mapStateToProps = state => state.user || {}





export default connect(mapStateToProps, null)(UserSettings)
