// Module imports
import React from 'react'
import * as d3 from 'd3'
import moment from 'moment'





// Component imports
import { connect } from '../store'
import Component from './Component'




// Component constants
const DEFAULT_HEIGHT = 300




@connect
class RescuesOverTimeChart extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _getRescuesOverTimeStatistics () {
    await this.props.getRescuesOverTimeStatistics()
  }

  _handleHideTooltip () {
    this.setState({
      showTooltip: false,
    })
  }

  _renderAxes () {
    this._renderXAxis()
    this._renderYAxis()
  }

  _renderXAxis () {
    const { height } = this._svg.getBoundingClientRect()
    const xAxis = d3.select(this._xAxis)
    const axis = d3.axisBottom(this.xScale)

    axis.ticks(d3.timeMonth)
    xAxis.call(axis)
    xAxis.attr('transform', `translate(0, ${height - this._xAxis.getBoundingClientRect().height})`)
  }

  _renderYAxis () {
    const { width } = this._svg.getBoundingClientRect()
    const yAxis = d3.select(this._yAxis)

    yAxis.call(d3.axisRight(this.yScale))
    yAxis.attr('transform', `translate(${width - this._yAxis.getBoundingClientRect().width}, 0)`)
    yAxis.selectAll('text').attr('text-anchor', 'end')
  }

  _renderChart () {
    const { statistics } = this.props
    const { height } = this.state

    // Deserialize the data
    const data = statistics.map((datum) => {
      const newDatum = { ...datum }

      newDatum.attributes.date = moment(datum.attributes.date)
      newDatum.attributes.failure = parseInt(datum.attributes.failure, 10)
      newDatum.attributes.success = parseInt(datum.attributes.success, 10)

      return newDatum
    })

    // Set sizing parameters
    const xAxisMargin = 20
    const yAxisMargin = 40
    const barGap = 2
    const barWidth = 10
    const borderRadius = (barWidth / 2) - 2
    const width = data.length * (barWidth + barGap)

    // Define the X axis scaling metrics
    const xScale = d3.scaleTime()
    this.xScale = xScale
    xScale.domain([
      d3.min(data, (datum) => datum.attributes.date),
      d3.max(data, (datum) => datum.attributes.date),
    ])
    xScale.range([0, width])

    // Define the Y axis scaling metrics
    const yScale = d3.scaleLinear()
    this.yScale = yScale
    yScale.domain([d3.max(data, (datum) => datum.attributes.success + datum.attributes.failure), 0])
    yScale.range([0, height])

    return (
      <svg
        ref={(_svg) => {
          this._svg = _svg
        }}
        height={height + xAxisMargin}
        width={width + yAxisMargin}>
        <g className="data">
          {data.map((rescue) => (
            <g
              className="datum"
              key={rescue.id}
              onBlur={this._handleHideTooltip}
              onFocus={(event) => this._showTooltip(event, rescue)}
              onMouseOut={this._handleHideTooltip}
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
          ))}
        </g>

        <g
          className="axis x"
          ref={(_xAxis) => {
            this._xAxis = _xAxis
          }} />

        <g
          className="axis y"
          ref={(_yAxis) => {
            this._yAxis = _yAxis
          }} />
      </svg>
    )
  }

  _showTooltip (event, rescue) {
    const element = event.target
    const {
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
      '_handleHideTooltip',
      '_renderAxes',
      '_renderXAxis',
      '_renderYAxis',
      '_renderChart',
      '_showTooltip',
    ])

    this.state = {
      height: props.height || DEFAULT_HEIGHT,
      showTooltip: false,
      tooltipContent: null,
      tooltipX: 0,
      tooltipY: 0,
    }
  }

  render () {
    const {
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





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getRescuesOverTimeStatistics']

  static mapStateToProps = (state) => {
    const {
      loading,
      statistics,
    } = state.rescuesOverTime

    return {
      loading,
      statistics,
    }
  }
}





export default RescuesOverTimeChart
