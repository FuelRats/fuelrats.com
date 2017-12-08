// Module imports
import { bindActionCreators } from 'redux'
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'





// Module imports
import { actions } from '../store'
import Component from './Component'





class UserShipsPanel extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static _renderShips (ships) {
    return ships.map((ship, index) => {
      const { id } = ship
      const {
        name,
        platform,
      } = ship.attributes

      console.log('ship', ship)

      const badgeClasses = ['badge', 'platform', 'short', platform].join(' ')

      return (
        <li key={index}>
          <div className={badgeClasses} />

          <Link href={`/rats/${id}`}>
            <a>{name}</a>
          </Link>
        </li>
      )
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const { ships } = this.props

    return (
      <div className="panel user-ships">
        <header>Ships</header>

        <div className="panel-content">
          <div className="row">
            <ul>
              {!ships.retrieving && this._renderShips(ships.ships)}
            </ul>
          </div>

          <form className="row">
            <input className="stretch-9" name="add-ship" placeholder="Add a ship..." type="text" />
            <button data-action="add-ship" type="submit">Add</button>
          </form>
        </div>
      </div>
    )
  }
}





const mapDispatchToProps = dispatch => ({ getRats: bindActionCreators(actions.getRats, dispatch) })

const mapStateToProps = state => {
  const {
    ships,
    user,
  } = state

  return {
    ships,
    user,
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(UserShipsPanel)
