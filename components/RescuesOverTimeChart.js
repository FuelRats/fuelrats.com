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

  _renderAxes () {
    this._renderXAxis()
    this._renderYAxis()
  }

  _renderXAxis () {
    let height = this._svg.getBoundingClientRect().height
    let xAxis = d3.select(this._xAxis)

    xAxis.call(d3.axisBottom(this.xScale))
    xAxis.attr('transform', `translate(0, ${height - this._xAxis.getBoundingClientRect().height})`)
  }

  _renderYAxis () {
    let width = this._svg.getBoundingClientRect().width
    let yAxis = d3.select(this._yAxis)

    yAxis.call(d3.axisRight(this.yScale))
    yAxis.attr('transform', `translate(${width - this._yAxis.getBoundingClientRect().width}, 0)`)
    yAxis.selectAll('text')
      .attr('text-anchor', 'end')
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
    let xAxisMargin = 20
    let yAxisMargin = 40
    let barGap = 2
    let barWidth = 10
    let borderRadius = (barWidth / 2) - 2
    let width = data.length * (barWidth + barGap)

    // Define the X axis scaling metrics
    let xScale = this.xScale = d3.scaleTime()
    xScale.domain([
      d3.min(data, datum => datum.attributes.date),
      d3.max(data, datum => datum.attributes.date),
    ])
    xScale.range([0, width])

    // Define the Y axis scaling metrics
    let yScale = this.yScale = d3.scaleLinear()
    yScale.domain([d3.max(data, d => d.attributes.success + d.attributes.failure), 0])
    yScale.range([0, height])

    return (
      <svg
        ref={_svg => this._svg = _svg}
        height={height + xAxisMargin}
        width={width + yAxisMargin}>
        <g className="data">
          {data.map((rescue, index) => {
            return (
              <g
                className="rescue"
                key={index}
                transform={`translate(${xScale(rescue.attributes.date)}, 0)`}>
                <rect
                  className="success"
                  data-rescues={rescue.attributes.success}
                  height={yScale(0) - yScale(rescue.attributes.success + rescue.attributes.failure)}
                  rx={borderRadius}
                  ry={borderRadius}
                  width={barWidth}
                  y={yScale(rescue.attributes.success + rescue.attributes.failure)} />

                <rect
                  className="failure"
                  data-rescues={rescue.attributes.failure}
                  height={yScale(0) - yScale(rescue.attributes.failure)}
                  rx={borderRadius}
                  ry={borderRadius}
                  width={barWidth}
                  y={yScale(rescue.attributes.failure)} />
              </g>
            )
          })}
        </g>

        <g
          className="axis x"
          ref={_xAxis => this._xAxis = _xAxis} />

        <g
          className="axis y"
          ref={_yAxis => this._yAxis = _yAxis} />
      </svg>
    )
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._getRescuesOverTimeStatistics()
  }

  componentDidUpdate () {
    this._renderAxes()
  }

  constructor (props) {
    super(props)

    this._bindMethods(['_getRescuesOverTimeStatistics', '_renderAxes', '_renderXAxis', '_renderYAxis', '_renderChart'])

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
