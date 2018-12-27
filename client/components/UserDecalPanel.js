// Module imports
import moment from 'moment'
import React from 'react'
import ReactTable from 'react-table'





// Module imports
import { connect } from '../store'
import Component from './Component'





// Component constants
const ELITE_GAME_YEAR_DESPARITY = 1286 // Years between IRL year and Elite universe year





@connect
class UserDetailsPanel extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _redeemDecal () {
    const { redeemDecal } = this.props

    this.setState({ redeeming: true })

    await redeemDecal()

    this.setState({
      redeeming: false,
    })
  }

  static _renderClaimedAtRow (row) {
    const rescue = row.original

    return moment(rescue.claimedAt).add(ELITE_GAME_YEAR_DESPARITY, 'years').format('DD MMM, YYYY')
  }

  _renderNoDataText () {
    const {
      eligible,
    } = this.props

    const { checkingEligibility } = this.state

    if (!checkingEligibility) {
      if (!eligible) {
        return 'Sorry, you\'re not eligible for a decal.'
      }

      return (
        <div>
          <p>You're eligible for a decal but you haven't redeemed it yet.</p>
          <button
            onClick={() => this._redeemDecal()}
            type="button">
            Redeem
          </button>
        </div>
      )
    }

    return null
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const {
      checkDecalEligibility,
      eligible,
    } = this.props

    if (!eligible) {
      await checkDecalEligibility()
    }

    this.setState({ checkingEligibility: false })
  }

  constructor (props) {
    super(props)

    this.state = {
      checkingEligibility: true,
      redeeming: false,
    }
  }

  render () {
    const { decals } = this.props

    const {
      checkingEligibility,
      redeeming,
    } = this.state

    return (
      <ReactTable
        className="panel user-decals"
        columns={this.columns}
        data={decals}
        defaultPageSize={10}
        loading={checkingEligibility || redeeming}
        loadingText={checkingEligibility ? 'Checking decal eligibility...' : 'Redeeming decal codes...'}
        manual
        minRows={5}
        noDataText={this._renderNoDataText()}
        showPagination={false} />
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get columns () {
    return [
      {
        accessor: 'attributes.code',
        className: 'code',
        Header: 'Decal Code',
        headerClassName: 'code',
        id: 'code',
        resizable: false,
        sortable: false,
      },
      {
        accessor: 'attributes.claimedAt',
        Cell: this._renderClaimedAtRow,
        className: 'claimedAt',
        Header: 'Redeemed',
        headerClassName: 'claimedAt',
        id: 'claimedAt',
        resizable: false,
        sortable: true,
        width: 120,
      },
    ]
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['checkDecalEligibility', 'redeemDecal']

  static mapStateToProps = (state) => state.decals
}





export default UserDetailsPanel
