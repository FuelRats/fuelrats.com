// Module imports
import { bindActionCreators } from 'redux'
import * as d3 from 'd3'
import * as d3ScaleChromatic from 'd3-scale-chromatic'
import React from 'react'
import withRedux from 'next-redux-wrapper'

Object.assign(d3, d3ScaleChromatic)





// Module imports
import {
  actions,
  initStore,
} from '../store'
import Component from './Component'





class RescuesBySystemChart extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _getRescuesBySystemStatistics () {
    this.setState({
      loadingRescuesBySystemStatistics: true,
    })

    await this.props.getRescuesBySystemStatistics()

    this.setState({
      loadingRescuesBySystemStatistics: false,
    })
  }

  _hideTooltip () {
    this.setState({
      showTooltip: false,
    })
  }

  _renderChart () {
    let {
      rescuesBySystem,
    } = this.props
    let {
      height,
      width,
    } = this.state

    let pack = d3.pack()
    pack.size([width, height])
    pack.padding(1.5)

    let root = d3.hierarchy({ children: rescuesBySystem })
    root.sum(datum => datum.attributes ? datum.attributes.count : 0)

    let data = pack(root).leaves()

    return (
      <svg
        ref={_svg => this._svg = _svg}
        height={height}
        width={width}>
        <g className="data">
          {data.map((datum, index) => {
            let id = null
            let system = null
            let successRate = 0

            if (datum.data.attributes) {
              successRate = datum.data.attributes.success / datum.data.attributes.count
              system = datum.data.attributes.system
              id = system.toLowerCase().replace(/\s/g, '_')
            }

            return (
              <g
                className="datum"
                key={index}
                onMouseOut={this._hideTooltip}
                onMouseOver={(event) => this._showTooltip(event, datum)}
                transform={`translate(${datum.x}, ${datum.y})`}>
                <circle
                  className="system"
                  id={id}
                  r={datum.r}
                  fill={d3.interpolateRdYlGn(successRate)} />

                <clipPath
                  id={`clip-${id}`}>
                  <use xlinkHref={`#${id}`} />
                </clipPath>

                <text
                  className="system-name"
                  clipPath={`url(#clip-${id})`}
                  textAnchor="middle"
                  y={4}>
                  {system}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    )
  }

  _showTooltip (event, datum) {
    let element = event.target
    let {
      height,
      right,
      top,
    } = element.getBoundingClientRect()

    this.setState({
      showTooltip: true,
      tooltipContent: (
        <div>
          <strong>{datum.data.id}</strong><br />
          Successful: {datum.data.attributes.success}<br />
          Failure: {datum.data.attributes.failure}<br />
          Total: {datum.data.attributes.count}
        </div>
      ),
      tooltipX: right,
      tooltipY: top + (height / 2),
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._getRescuesBySystemStatistics()
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      '_getRescuesBySystemStatistics',
      '_hideTooltip',
      '_showTooltip',
    ])

    this.state = {
      height: props.height || 500,
      loadingRescuesBySystemStatistics: false,
      showTooltip: false,
      tooltipContent: null,
      tooltipX: 0,
      tooltipY: 0,
      width: props.width || 500,
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
          Rescues by System
        </header>

        <div className="panel-content rescues-by-system-chart">
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
    getRescuesBySystemStatistics: bindActionCreators(actions.getRescuesBySystemStatistics, dispatch),
  }
}

const mapStateToProps = state => {
  let {
    rescuesBySystem,
  } = state.statistics

  return Object.assign({}, {
    rescuesBySystem
  })
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(RescuesBySystemChart)
