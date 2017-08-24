// Module imports
import { bindActionCreators } from 'redux'
import * as d3 from 'd3'
import React from 'react'
import withRedux from 'next-redux-wrapper'





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
    let radius = Math.min(width, height) / 2

    let rescuesByPlatform = [
      {
        color: '#d65050',
        name: 'PC',
        value: rescuesBySystem.reduce((accumulator, datum) => {
          return accumulator + parseInt(datum.attributes.pc)
        }, 0),
      },
      {
        color: '#003791',
        name: 'PS4',
        value: rescuesBySystem.reduce((accumulator, datum) => {
          return accumulator + parseInt(datum.attributes.ps)
        }, 0),
      },
      {
        color: '#107c10',
        name: 'XB',
        value: rescuesBySystem.reduce((accumulator, datum) => {
          return accumulator + parseInt(datum.attributes.xb)
        }, 0),
      }
    ]

    let haloWidth = 40
    let packMargin = 20

    let arc = d3.arc()
    arc.outerRadius(radius - 10)
    arc.innerRadius(radius - haloWidth)

    let pie = d3.pie()
    pie.sort(null)
    pie.value(datum => datum.value)
    pie.padAngle(.03)

    let pack = d3.pack()
    pack.size([width - ((haloWidth + packMargin) * 2), height - ((haloWidth + packMargin) * 2)])
    pack.padding(1.5)

    let root = d3.hierarchy({ children: rescuesBySystem })
    root.sum(datum => datum.attributes ? datum.attributes.count : 0)

    let systems = pack(root).leaves()

    return (
      <svg
        height={height}
        width={width}>
        <g
          className="systems"
          transform={`translate(${haloWidth + packMargin}, ${haloWidth + packMargin})`}>
          {systems.map((system, index) => {
            let classes = ['system']
            let highestPerformingPlatform = null
            let id = null
            let systemName = null
            let successRate = 0

            if (system.data.attributes) {
              successRate = system.data.attributes.success / system.data.attributes.count
              systemName = system.data.attributes.system
              id = systemName.toLowerCase().replace(/\s/g, '_')

              classes.push([
                {
                  platform: 'pc',
                  value: system.data.attributes.pc,
                },
                {
                  platform: 'ps',
                  value: system.data.attributes.ps,
                },
                {
                  platform: 'xb',
                  value: system.data.attributes.xb,
                },
              ].reduce((a, b) => a.value > b.value ? a : b).platform)
            }

            return (
              <g
                className="datum"
                key={index}
                onMouseOut={this._hideTooltip}
                onMouseOver={(event) => this._showTooltip(event, system)}
                transform={`translate(${system.x}, ${system.y})`}>
                <circle
                  className={classes.join(' ')}
                  id={id}
                  r={system.r} />

                <clipPath
                  id={`clip-${id}`}>
                  <use xlinkHref={`#${id}`} />
                </clipPath>

                <text
                  className="system-name"
                  clipPath={`url(#clip-${id})`}
                  textAnchor="middle"
                  y={4}>
                  {systemName}
                </text>
              </g>
            )
          })}
        </g>

        <g
          className="platforms"
          transform={`translate(${width / 2},${height / 2})`}>
          {pie(rescuesByPlatform).map((platform, index) => {
            return (
              <g>
                <path
                  d={arc(platform)}
                  fill={platform.data.color}
                  key={index} />

                <text
                  dy="0.4em"
                  textAnchor="middle"
                  transform={`translate(${arc.centroid(platform)})`}>
                  {platform.data.name}
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
          <header>{datum.data.id}</header>

          <table>
            <thead>
              <tr>
                <th></th>

                <th>Successful</th>

                <th>Failed</th>

                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th>PC</th>

                <td>{datum.data.attributes.pc} <span className="codeRed">({datum.data.attributes.codeRed})</span></td>

                <td>{datum.data.attributes.failure}</td>

                <td>{datum.data.attributes.pc}</td>
              </tr>

              <tr>
                <th>XB</th>

                <td>{datum.data.attributes.xb} <span className="codeRed">({datum.data.attributes.codeRed})</span></td>

                <td>{datum.data.attributes.failure}</td>

                <td>{datum.data.attributes.xb}</td>
              </tr>

              <tr>
                <th>PS</th>

                <td>{datum.data.attributes.ps} <span className="codeRed">({datum.data.attributes.codeRed})</span></td>

                <td>{datum.data.attributes.failure}</td>

                <td>{datum.data.attributes.ps}</td>
              </tr>

              <tr>
                <th>All</th>

                <td>{datum.data.attributes.success} <span className="codeRed">({datum.data.attributes.codeRed})</span></td>

                <td>{datum.data.attributes.failure}</td>

                <td>{datum.data.attributes.count}</td>
              </tr>
            </tbody>
          </table>
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
