// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'





// Component imports
import { actions } from '../store'





class Dialog extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let {
      body,
      closeIsVisible,
      hideDialog,
      isVisible,
      menuIsVisible,
      title,
    } = this.props

    return (
      <dialog className="loading fade-in" open={isVisible}>
        {closeIsVisible && (
          <button
            className="close icon secondary"
            onClick={hideDialog}>
            <i className="fa fa-fw fa-times"></i>
          </button>
        )}

        {title && (
          <header>
            <h2>{title}</h2>
          </header>
        )}

        <div className="content">
          {body}
        </div>

        {menuIsVisible && (
          <footer>
            <menu type="toolbar">
              <div className="secondary">
                <button name="cancel" type="button">Close</button>
              </div>

              <div className="primary">
                <button name="confirm" type="button">Confirm</button>
              </div>
            </menu>
          </footer>
        )}
      </dialog>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    hideDialog: bindActionCreators(actions.hideDialog, dispatch),
  }
}

const mapStateToProps = state => {
  return Object.assign({}, state.dialog)
}





export default connect(mapStateToProps, mapDispatchToProps)(Dialog)
