// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import React from 'react'
import withRedux from 'next-redux-wrapper'

import {
  actions,
  initStore,
} from '../store'





class Dialog extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <dialog className="loading fade-in" open={this.props.isVisible}>
        {this.props.closeIsVisible && (
          <button
            className="close icon secondary"
            onClick={this.props.hideDialog}>
            <i className="fa fa-fw fa-times"></i>
          </button>
        )}

        {this.props.title && (
          <header>
            <h2>{this.props.title}</h2>
          </header>
        )}

        <div className="content">
          {this.props.body}
        </div>

        {this.props.menuIsVisible && (
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
  return state.dialog
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Dialog)
