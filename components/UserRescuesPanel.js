// Module imports
import React from 'react'





export default () => {
  return (
    <div className="row">
      <div className="row">
        <h2>Rescues</h2>
      </div>

      <div className="row" data-hidden>
        <ul className="inline">
          <li>
            #each rats.models
            <button data-rat-id="{attributes.id}">{attributes.CMDRname}</button>
            /each
          </li>
        </ul>
      </div>

      <div className="rescues" />
    </div>
  )
}
