// Module imports
import React from 'react'





// Component imports
import Component from './Component'
import UserShipsTable from './UserShipsTable'





export default class extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  render () {
    let {
      ships,
    } = this.props

    return (
      <div className="rat-details">
        <UserShipsTable data={ships} />
      </div>
    )
  }
}
