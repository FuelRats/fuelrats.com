// Module imports
import React from 'react'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <div className="panel">
        <header>IRC Nicknames</header>
  
        <div className="panel-content">
          <div className="row nicknames"></div>
  
          <form className="row">
            <input className="stretch-9" name="add-nickname" placeholder="Add a nickname..." />
            <button data-action="add-nickname" type="submit">Add</button>
          </form>
        </div>
      </div>
    )
  }
}
