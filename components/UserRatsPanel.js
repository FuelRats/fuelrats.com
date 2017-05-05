// Module imports
import React from 'react'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div className="panel">
        <header>Rats</header>
  
        <div className="panel-content">
          <div className="row rats"></div>
  
          <form className="row">
            <input className="stretch-9" name="add-rat" placeholder="Add a rat..." />
            <button data-action="add-rat" type="submit">Add</button>
          </form>
        </div>
      </div>
    )
  }
}
