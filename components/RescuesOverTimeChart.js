// Module imports
import { bindActionCreators } from 'redux'
import * as d3 from 'd3'
import moment from 'moment'
import React from 'react'
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

  async _getRescuesOverTimeStatistics () {
    this.setState({
      loadingRescuesOverTimeStatistics: true,
    })

    await this.props.getRescuesOverTimeStatistics()

    this.setState({
      loadingRescuesOverTimeStatistics: false,
    })
  }

  _hideTooltip () {
    this.setState({
      showTooltip: false,
    })
  }

  _renderAxes () {
    this._renderXAxis()
    this._renderYAxis()
  }

  _renderXAxis () {
    let height = this._svg.getBoundingClientRect().height
    let xAxis = d3.select(this._xAxis)
    let axis = d3.axisBottom(this.xScale)

    axis.ticks(d3.timeMonth)
    xAxis.call(axis)
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
    let data = rescuesOverTime.map(datum => {
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
                className="datum"
                key={index}
                onMouseOut={this._hideTooltip}
                onMouseOver={(event) => this._showTooltip(event, rescue)}
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

  _showTooltip (event, rescue) {
    let element = event.target
    let {
      right,
      top,
    } = element.getBoundingClientRect()

    this.setState({
      showTooltip: true,
      tooltipContent: (
        <div>
          <strong>{rescue.attributes.date.format('DD MMM, YYYY')}</strong><br />
          Successful: {rescue.attributes.success}<br />
          Failure: {rescue.attributes.failure}<br />
          Total: {rescue.attributes.total}
        </div>
      ),
      tooltipX: right,
      tooltipY: top,
    })
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

    this._bindMethods([
      '_getRescuesOverTimeStatistics',
      '_hideTooltip',
      '_renderAxes',
      '_renderXAxis',
      '_renderYAxis',
      '_renderChart',
      '_showTooltip',
    ])

    this.state = {
      height: props.height || 300,
      loadingRescuesOverTimeStatistics: false,
      showTooltip: false,
      tooltipContent: null,
      tooltipX: 0,
      tooltipY: 0,
    }
  }

  render () {
    let {
      showTooltip,
      tooltipContent,
      tooltipX,
      tooltipY,
    } = this.state

    return (
      <section className="panel">
        <header>
          Rescues Over Time
        </header>

        <div className="panel-content rescues-over-time-chart">
          {this._renderChart()}
        </div>

        <div
          className="tooltip"
          style={{
            left: tooltipX,
            opacity: showTooltip ? 1 : 0,
            top: tooltipY,
          }}>
          {tooltipContent}
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
