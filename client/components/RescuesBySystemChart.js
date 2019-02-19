/* eslint-disable no-magic-numbers */

// Module imports
import * as d3 from 'd3'
import React from 'react'





// Module imports
import { connect } from '../store'
import Component from './Component'




@connect
class RescuesBySystemChart extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _getRescuesBySystemStatistics () {
    await this.props.getRescuesBySystemStatistics()
  }

  _handleHideTooltip () {
    this.setState({
      showTooltip: false,
    })
  }

  _renderChart () {
    const { statistics } = this.props
    const {
      height,
      width,
    } = this.state
    const radius = Math.min(width, height) / 2

    const rescuesByPlatform = [
      {
        color: '#d65050',
        name: 'PC',
        safeName: 'pc',
        value: statistics.reduce((accumulator, datum) => accumulator + parseInt(datum.attributes.pc, 10), 0),
      },
      {
        color: '#003791',
        name: 'PS4',
        safeName: 'ps',
        value: statistics.reduce((accumulator, datum) => accumulator + parseInt(datum.attributes.ps, 10), 0),
      },
      {
        color: '#107c10',
        name: 'XB',
        safeName: 'xb',
        value: statistics.reduce((accumulator, datum) => accumulator + parseInt(datum.attributes.xb, 10), 0),
      },
    ]

    const haloWidth = 40
    const packMargin = 20

    const arc = d3.arc()
    arc.outerRadius(radius - 10)
    arc.innerRadius(radius - haloWidth)

    const pie = d3.pie()
    pie.sort(null)
    pie.value((datum) => datum.value)
    pie.padAngle(0.03)

    const pack = d3.pack()
    pack.size([width - ((haloWidth + packMargin) * 2), height - ((haloWidth + packMargin) * 2)])
    pack.padding(10)

    const root = d3.hierarchy({ children: statistics })
    root.sum((datum) => (datum.attributes ? datum.attributes.count : 0))

    const systems = pack(root).leaves()

    return (
      <svg
        height={height}
        width={width}>
        <defs>
          <filter
            height="200%"
            id="glow"
            width="200%"
            x="-50%"
            y="-50%">
            <feGaussianBlur
              result="coloredBlur"
              stdDeviation="2" />

            <feMerge>
              <feMergeNode
                in="coloredBlur" />

              <feMergeNode
                in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          className="systems"
          transform={`translate(${haloWidth + packMargin}, ${haloWidth + packMargin})`}>
          {systems.map(this._renderSystem)}
        </g>

        <g
          className="platforms"
          transform={`translate(${width / 2},${height / 2})`}>
          {pie(rescuesByPlatform).map((platform) => (
            <g key={platform.data.safeName}>
              <path
                className={['platform', platform.data.safeName].join(' ')}
                d={arc(platform)}
                filter="url(#glow)" />

              <text
                dy="0.4em"
                textAnchor="middle"
                transform={`translate(${arc.centroid(platform)})`}>
                {platform.data.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    )
  }

  _renderSystem (system, index) {
    const classes = ['system']
    let id = null
    let systemName = null

    if (system.data.attributes) {
      systemName = system.data.attributes.system

      id = systemName ? systemName.toLowerCase().replace(/\s/gu, '_') : 'No system assigned'

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
      ].reduce((plat1, plat2) => (plat1.value > plat2.value ? plat1 : plat2)).platform)
    }

    if (system.r) {
      return (
        <g
          className="datum"
          filter="url(#glow)"
          key={index}
          onBlur={this._handleHideTooltip}
          onFocus={(event) => this._showTooltip(event, system)}
          onMouseOut={this._handleHideTooltip}
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
    }

    return null
  }

  _showTooltip (event, datum) {
    const element = event.target
    const {
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
                <th aria-hidden />

                <th>Successful</th>

                <th>Failed</th>

                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th>PC</th>

                <td>{datum.data.attributes.pcsuccess} <span className="codeRed">({datum.data.attributes.pccoderedsuccess})</span></td>

                <td>{datum.data.attributes.pcfailure} <span className="codeRed">({datum.data.attributes.pccoderedfailure})</span></td>

                <td>{datum.data.attributes.pc} <span className="codeRed">({datum.data.attributes.pccodered})</span></td>
              </tr>

              <tr>
                <th>XB</th>

                <td>{datum.data.attributes.xbsuccess} <span className="codeRed">({datum.data.attributes.xbcoderedsuccess})</span></td>

                <td>{datum.data.attributes.xbfailure} <span className="codeRed">({datum.data.attributes.xbcoderedfailure})</span></td>

                <td>{datum.data.attributes.xb} <span className="codeRed">({datum.data.attributes.xbcodered})</span></td>
              </tr>

              <tr>
                <th>PS</th>

                <td>{datum.data.attributes.pssuccess} <span className="codeRed">({datum.data.attributes.pscoderedsuccess})</span></td>

                <td>{datum.data.attributes.psfailure} <span className="codeRed">({datum.data.attributes.pscoderedfailure})</span></td>

                <td>{datum.data.attributes.ps} <span className="codeRed">({datum.data.attributes.pscodered})</span></td>
              </tr>

              <tr>
                <th>All</th>

                <td>{datum.data.attributes.success} <span className="codeRed">({datum.data.attributes.coderedsuccess})</span></td>

                <td>{datum.data.attributes.failure} <span className="codeRed">({datum.data.attributes.coderedfailure})</span></td>

                <td>{datum.data.attributes.count} <span className="codeRed">({datum.data.attributes.codered})</span></td>
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
      '_handleHideTooltip',
      '_renderSystem',
      '_showTooltip',
    ])

    this.state = {
      height: props.height || 500,
      showTooltip: false,
      tooltipContent: null,
      tooltipX: 0,
      tooltipY: 0,
      width: props.width || 500,
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





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getRescuesBySystemStatistics']

  static mapStateToProps = (state) => {
    const {
      loading,
      statistics,
    } = state.rescuesBySystem

    return {
      loading,
      statistics,
    }
  }
}





export default RescuesBySystemChart
