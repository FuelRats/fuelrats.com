// Module imports
import { bindActionCreators } from 'redux'
import moment from 'moment'
import React from 'react'
import ReactTable from 'react-table'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'





// Module imports
import {
  actions,
  initStore,
} from '../store'
import Component from './Component'





class RescuesTablePanel extends Component {

  async _getRescuesOverTimeStatistics () {
    this.setState({
      loadingRescuesOverTimeStatistics: true,
    })

    await this.props.getRescuesOverTimeStatistics()

    this.setState({
      loadingRescuesOverTimeStatistics: false,
    })
  }

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._getRescuesOverTimeStatistics()
  }

  render () {
    let {
      rescuesOverTime,
    } = this.props

    return (
      <section className="panel">
      </section>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    getRescuesOverTimeStatistics: bindActionCreators(actions.getRescuesOverTimeStatistics, dispatch),
  }
}

const mapStateToProps = state => {
  let {
    rescuesOverTime,
  } = state.statistics

  return Object.assign({}, {
    rescuesOverTime
  })
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(RescuesTablePanel)
