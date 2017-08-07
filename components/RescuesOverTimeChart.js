// Module imports
import { bindActionCreators } from 'redux'
import * as d3 from 'd3'
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





class RescuesOverTimeChart extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _deserializedRescuesOverTime () {
    let {
      rescuesOverTime,
    } = this.props

    return rescuesOverTime.map(rescue => {
      return {
        failure: rescue.attributes.failure,
        success: rescue.attributes.success,
      }
    })
  }

  async _getRescuesOverTimeStatistics () {
    this.setState({
      loadingRescuesOverTimeStatistics: true,
    })

    await this.props.getRescuesOverTimeStatistics()

    this.setState({
      loadingRescuesOverTimeStatistics: false,
    })
  }

  _renderChart () {
    let {
      rescuesOverTime,
    } = this.props
    let {
      height,
    } = this.state

    // Deserialize the data
    let data = rescuesOverTime.slice(0, 366).map(datum => {
      datum.attributes.date = moment(datum.attributes.date)
      datum.attributes.failure = parseInt(datum.attributes.failure)
      datum.attributes.success = parseInt(datum.attributes.success)

      return datum
    })

    // Set sizing parameters
    let barGap = 2
    let barWidth = 10
    let width = data.length * (barWidth + barGap)

    // Define the X axis scaling metrics
    let xScale = d3.scaleTime()
    xScale.domain([
      d3.min(data, datum => datum.attributes.date),
      d3.max(data, datum => datum.attributes.date),
    ])
    xScale.range([0, width])

    // Define the Y axis scaling metrics
    let yScale = d3.scaleLinear()
    yScale.domain([0, d3.max(data, d => d.attributes.success + d.attributes.failure)])
    yScale.range([0, height])

    return (
      <svg
        height={height}
        width={width}>
        {data.map((rescue, index) => {
          return (
            <g
              className="rescue"
              key={index}
              transform={`translate(${xScale(rescue.attributes.date)}, 0)`}>
              <rect
                className="success"
                data-rescues={rescue.attributes.success}
                height={yScale(rescue.attributes.success)}
                width={barWidth}
                y={height - yScale(rescue.attributes.success + rescue.attributes.failure)} />
              <rect
                className="failure"
                data-rescues={rescue.attributes.failure}
                height={yScale(rescue.attributes.failure)}
                width={barWidth}
                y={height - yScale(rescue.attributes.failure)} />
            </g>
          )
        })}
      </svg>
    )
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._getRescuesOverTimeStatistics()
  }

  constructor (props) {
    super(props)

    this._bindMethods(['_getRescuesOverTimeStatistics', '_renderChart'])

    this.state = {
      height: props.height || 300
    }
  }

  render () {
    return (
      <section className="panel">
        <header>
          Rescues Over Time
        </header>

        <div className="panel-content rescues-over-time-chart">
          {this._renderChart()}
        </div>
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





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(RescuesOverTimeChart)
