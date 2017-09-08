// Module imports
import React from 'react'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  constructor (props) {
    super(props)

    this.state = {
      currentPassword: '',
      newPassword: '',
    }
  }

  render () {
    return(
      <div className="password-group">
        <input
          {...this.props}
          type="password" />
      </div>
    )
  }
}
