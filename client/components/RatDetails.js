// Module imports
import React from 'react'





// Component imports
import UserShipsTable from './UserShipsTable'





const RatDetails = (props) => (
  <div className="rat-details">
    <UserShipsTable data={props.ships} />
  </div>
)





export default RatDetails
