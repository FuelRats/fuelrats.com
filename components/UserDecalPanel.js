// Module imports
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import React from 'react'
import ReactTable from 'react-table'





// Module imports
import { actions } from '../store'
import Component from './Component'





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

    return moment(rescue.claimedAt).add(1286, 'years').format('DD MMM, YYYY')
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
}





const mapDispatchToProps = dispatch => ({
  checkDecalEligibility: bindActionCreators(actions.checkDecalEligibility, dispatch),
  redeemDecal: bindActionCreators(actions.redeemDecal, dispatch),
})

const mapStateToProps = state => state.decals





export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsPanel)
