import { isError } from 'flux-standard-action'
import PropTypes from 'prop-types'
import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { connect } from '~/store'
import {
  selectRatById,
  selectUserById,
  selectDisplayRatIdByUserId,
  withCurrentUserId,
  selectRatStatisticsById,
} from '~/store/selectors'
import formatAsEliteDate from '~/util/date/formatAsEliteDate'

import CardControls from '../CardControls'
import InlineEditSpan from '../InlineEditSpan'
import Switch from '../Switch'
import DefaultRatButton from './DefaultRatButton'





@connect
class RatCard extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    deleteConfirm: false,
    shipsExpanded: false,
    changes: {},
    validity: {
      name: false,
    },
    editing: false,
    submitting: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleDelete = () => {
    this.setState({ deleteConfirm: true })
  }

  _handleExpandShips = () => {
    this.setState(({ shipsExpanded }) => {
      return {
        shipsExpanded: !shipsExpanded,
      }
    })
  }

  _handleNameChange = ({ target: { value } }) => {
    this.setChanges(
      (_, props) => {
        return { name: value === props.rat.attributes.name ? undefined : value }
      }, // changes
      (_, props) => {
        return { name: value && value !== props.rat.attributes.name }
      }, // validity
    )
  }

  _handleSubmit = async () => {
    const {
      changes,
      deleteConfirm,
    } = this.state

    const {
      updateRat,
      deleteRat,
      rat,
    } = this.props

    if (deleteConfirm) {
      this.setState({
        deleteConfirm: false,
        submitting: 'delete',
      })

      deleteRat(rat)
      return
    }

    this.setState({ submitting: true })

    await updateRat({
      id: rat.id,
      attributes: changes,
    })

    this.setState({
      changes: {},
      editing: false,
      submitting: false,
      validity: {
        name: false,
      },
    })
  }

  _handleEdit = () => {
    this.setState({
      editing: true,
    })
  }

  _handleCancel = () => {
    const {
      deleteConfirm,
    } = this.state

    if (deleteConfirm) {
      this.setState({
        deleteConfirm: false,
      })

      return
    }

    this.setState({
      editing: false,
      changes: {},
      validity: {
        name: false,
      },
    })
  }

  _handleDisplayRatClick = () => {
    this.setState({ submitting: true })
  }

  _handleDisplayRatUpdate = (res) => {
    if (!isError(res)) {
      this.setState({ submitting: false })
    }
  }

  _handleOdysseySwitch = () => {
    return this.props.updateRat({
      id: this.props.rat.id,
      attributes: {
        odyssey: !this.props.rat.attributes.odyssey,
      },
    })
  }



  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      ratIsDisplayRat,
      userHasMultipleRats,
    } = this

    const {
      className,
      rat,
      // ships,
      statistics,
    } = this.props

    const {
      deleteConfirm,
      editing,
      changes,
      shipsExpanded,
      submitting,
    } = this.state

    if (!rat) {
      return null
    }

    const createdAt = formatAsEliteDate(rat.attributes.createdAt)

    const cmdrNameValue = typeof changes.name === 'string' ? changes.name : rat.attributes.name
    const submitText = submitting === 'delete' ? 'Deleting...' : 'Updating...'

    return (
      <div
        className={['panel rat-panel', { expanded: shipsExpanded, editing, submitting }, className]}
        data-loader-text={submitting ? submitText : null}>
        <header>
          <div>
            <span>{'CMDR '}</span>
            <InlineEditSpan
              canEdit={editing}
              inputClassName="dark"
              maxLength={22}
              minLength={1}
              name="name"
              value={cmdrNameValue}
              onChange={this._handleNameChange} />
          </div>
          <div>
            {
              userHasMultipleRats && (
                <DefaultRatButton
                  ratId={rat.id}
                  onClick={this._handleDisplayRatClick}
                  onUpdate={this._handleDisplayRatUpdate} />
              )
            }
            <span className="rat-platform">{rat.attributes.platform.toUpperCase()}</span>
          </div>
        </header>
        {
          rat.attributes.platform === 'pc' && (
            <div className="panel-content">
              <Switch
                checked={rat.attributes.odyssey}
                label="Using Odyssey"
                onClick={this._handleOdysseySwitch} />
            </div>
          )
        }
        <footer className="panel-content">
          <div className="rat-stats">
            <small>
              <span className="text-muted">{'Rescues: '}</span>
              {statistics ? statistics.attributes.firstLimpet : '...'}
            </small>
            <small>
              <span className="text-muted">{'Created: '}</span>
              {createdAt}
            </small>
          </div>
          {/* Disabled until ships are fully implemented
          <div className="rat-ships-expander">
            <button
              className="inline ship-expand-button"
              type="button"
              onClick={this._handleExpandShips}>
              <FontAwesomeIcon icon="angle-down" fixedWidth />
            </button>
          </div>
          */}
          <CardControls
            canDelete={userHasMultipleRats && !ratIsDisplayRat && (statistics && !statistics?.attributes.firstLimpet)}
            canSubmit={this.canSubmit}
            controlType="rat"
            deleteMode={deleteConfirm}
            editMode={editing}
            onCancelClick={this._handleCancel}
            onDeleteClick={this._handleDelete}
            onEditClick={this._handleEdit}
            onSubmitClick={this._handleSubmit} />
        </footer>
      </div>
    )
  }

  setChanges = (changedFields, validatedFields) => {
    this.setState((state, props) => {
      return {
        changes: {
          ...state.changes,
          ...(typeof changedFields === 'function' ? changedFields(state, props) : changedFields),
        },
        validity: {
          ...state.validity,
          ...(typeof validatedFields === 'function' ? validatedFields(state, props) : validatedFields),
        },
      }
    })
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get ratIsDisplayRat () {
    return this.props.userDisplayRatId === this.props.rat.id
  }

  get userHasMultipleRats () {
    return this.props.user.relationships.rats.data.length > 1
  }

  get canSubmit () {
    const {
      changes,
      validity,
    } = this.state

    const hasChanges = Object.values(changes).filter((change) => {
      return typeof change !== 'undefined'
    }).length

    const isValid = Object.values(validity).filter((validityMember) => {
      return validityMember
    }).length

    return hasChanges && isValid
  }



  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = [
    'deleteRat',
    'updateRat',
  ]


  static mapStateToProps = (state, props) => {
    return {
      user: withCurrentUserId(selectUserById)(state),
      userDisplayRatId: withCurrentUserId(selectDisplayRatIdByUserId)(state),
      rat: selectRatById(state, props),
      statistics: selectRatStatisticsById(state, props),
    }
  }





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static propTypes = {
    className: PropTypes.string,
    deleteRat: PropTypes.func,
    rat: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types -- ratId is used in state mapping
    ratId: PropTypes.string.isRequired,
    statistics: PropTypes.object,
    updateRat: PropTypes.func,
    user: PropTypes.object,
    userDisplayRatId: PropTypes.string,
  }
}





export default RatCard
