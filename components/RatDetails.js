// Module imports
import React from 'react'





// Component imports
import UserShipsTable from './UserShipsTable'





export default props => (
  <div className="rat-details">
    <UserShipsTable data={props.ships} />
  </div>
)
