// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import moment from 'moment'
import React from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'





// Module imports
import { actions } from '../store'
import Component from './Component'





class UserDetailsPanel extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _redeemDecal () {
    let {
      eligible,
      redeemDecal,
    } = this.props

    await redeemDecal()

    this.setState({ loading: false })
  }

  _renderClaimedAtRow (row) {
    let rescue = row.original

    return moment(rescue.claimedAt).add(1286, 'years').format('DD MMM, YYYY')
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    let {
      checkDecalEligibility,
      eligible,
    } = this.props

    if (!eligible) {
      await checkDecalEligibility()
    }

    this.setState({ eligibilityChecked: true })
  }

  componentWillReceiveProps (nextProps) {
    let { eligible } = this.props

    if ((eligible !== nextProps.eligible) && nextProps.eligible) {
      this._redeemDecal()
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      eligibilityChecked: false,
      loading: true,
    }
  }

  render () {
    let {
      decals,
      eligible,
    } = this.props

    let {
      eligibilityChecked,
      loading,
    } = this.state

    return (
      <ReactTable
        className="panel user-decals"
        columns={this.columns}
        data={decals}
        defaultPageSize={10}
        loading={loading}
        loadingText={!eligibilityChecked ? `Checking decal eligibility...` : `Retrieving decal codes...`}
        manual
        minRows={1}
        noDataText={(eligibilityChecked && !eligible) ? `Sorry, you're not eligible for a decal.` : null}
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





const mapDispatchToProps = dispatch => {
  return {
    checkDecalEligibility: bindActionCreators(actions.checkDecalEligibility, dispatch),
    redeemDecal: bindActionCreators(actions.redeemDecal, dispatch),
  }
}

const mapStateToProps = state => {
  return state.decals
}





export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsPanel)
