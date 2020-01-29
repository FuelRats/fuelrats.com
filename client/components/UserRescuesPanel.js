// Module imports
import React from 'react'





function UserRescuesPanel () {
  return (
    <div className="row">
      <div className="row">
        <h2>Rescues</h2>
      </div>

      <div className="row" data-hidden>
        <ul className="inline">
          <li>
            #each rats.models
            <button data-rat-id="{attributes.id}" type="button">{}</button>
            /each
          </li>
        </ul>
      </div>

      <div className="rescues" />
    </div>
  )
}





export default UserRescuesPanel
