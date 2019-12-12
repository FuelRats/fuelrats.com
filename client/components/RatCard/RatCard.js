// Module imports
import React from 'react'
import PropTypes from 'prop-types'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



// Component imports
import { connect, actionStatus } from '../../store'
import {
  selectRatById,
  selectShipsByRatId,
  selectUserById,
  selectDisplayRatIdByUserId,
  selectPageViewMetaById,
  withCurrentUserId,
} from '../../store/selectors'
import { formatAsEliteDate } from '../../helpers/formatTime'
import classNames from '../../helpers/classNames'
import CardControls from '../CardControls'
import DefaultRatButton from './DefaultRatButton'
import InlineEditSpan from '../InlineEditSpan'





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
    editMode: false,
    submitting: false,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleDelete = () => {
    this.setState({ deleteConfirm: true })
  }

  _handleExpandShips = () => {
    this.setState(({ shipsExpanded }) => ({
      shipsExpanded: !shipsExpanded,
    }))
  }

  _handleNameChange = ({ target: { value } }) => {
    this.setChanges(
      (state, props) => ({ name: value === props.rat.attributes.name ? undefined : value }), // changes
      (state, props) => ({ name: value && value !== props.rat.attributes.name }), // validity
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

      deleteRat(rat.id)
      return
    }

    this.setState({ submitting: true })

    await updateRat(rat.id, changes)

    this.setState({
      changes: {},
      editMode: false,
      submitting: false,
      validity: {
        name: false,
      },
    })
  }

  _handleEdit = () => {
    this.setState({
      editMode: true,
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
      editMode: false,
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
    if (res.status === actionStatus.SUCCESS) {
      this.setState({ submitting: false })
    }
  }



  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    const {
      ratId,
      getRescues,
      rescueCount,
      rescueCountPageViewId,
    } = this.props

    if (!rescueCount) {
      getRescues({
        firstLimpetId: ratId,
        limit: 1,
      }, {
        pageView: rescueCountPageViewId,
      })
    }
  }

  renderDeleteConfirmMessage = () => {
    const {
      rescueCount,
    } = this.props

    if (!rescueCount) {
      return null
    }

    return (<small>This rat has {rescueCount} rescues. Are you sure?  </small>)
  }

  render () {
    const {
      ratIsDisplayRat,
      userHasMultipleRats,
    } = this

    const {
      rat,
      // ships,
      rescueCount,
    } = this.props

    const {
      deleteConfirm,
      editMode,
      changes,
      shipsExpanded,
      submitting,
    } = this.state

    if (!rat) {
      return null
    }

    const createdAt = formatAsEliteDate(rat.attributes.createdAt)

    const classes = classNames(
      'panel',
      'rat-panel',
      ['expanded', shipsExpanded],
      ['editing', editMode],
      ['submitting', submitting],
    )

    const cmdrNameValue = typeof changes.name === 'string' ? changes.name : rat.attributes.name
    const submitText = submitting === 'delete' ? 'Deleting...' : 'Updating...'

    return (
      <div className={classes} data-loader-text={submitting ? submitText : null}>
        <header>
          <div>
            <span>CMDR </span>
            <InlineEditSpan
              canEdit={editMode}
              inputClassName="dark"
              name="name"
              minLength={1}
              maxLength={18}
              onChange={this._handleNameChange}
              value={cmdrNameValue} />
          </div>
          <div>
            {userHasMultipleRats && (
              <DefaultRatButton
                ratId={rat.id}
                onClick={this._handleDisplayRatClick}
                onUpdate={this._handleDisplayRatUpdate} />
            )}
            <span className="rat-platform">{rat.attributes.platform.toUpperCase()}</span>
          </div>
        </header>
        {/* Disabled until ships are fully implemented
        <div className="panel-content">
          ships.
        </div>
        */}
        <footer className="panel-content">
          <div className="rat-stats">
            <small>
              <span className="text-muted">Rescues: </span>
              {typeof rescueCount === 'number' ? rescueCount : '...'}
            </small>
            <small>
              <span className="text-muted">Created: </span>
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
            canDelete={userHasMultipleRats && !ratIsDisplayRat}
            canSubmit={this.canSubmit}
            controlType="rat"
            deleteConfirmMessage={this.renderDeleteConfirmMessage}
            deleteMode={deleteConfirm}
            editMode={editMode}
            onCancelClick={this._handleCancel}
            onDeleteClick={this._handleDelete}
            onEditClick={this._handleEdit}
            onSubmitClick={this._handleSubmit} />
        </footer>
      </div>
    )
  }

  setChanges = (changedFields, validatedFields) => this.setState((state, props) => ({
    changes: {
      ...state.changes,
      ...(typeof changedFields === 'function' ? changedFields(state, props) : changedFields),
    },
    validity: {
      ...state.validity,
      ...(typeof validatedFields === 'function' ? validatedFields(state, props) : validatedFields),
    },
  }))





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

    const hasChanges = Object.values(changes).filter((change) => typeof change !== 'undefined').length
    const isValid = Object.values(validity).filter((validityMember) => validityMember).length

    return hasChanges && isValid
  }



  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = [
    'deleteRat',
    'getRescues',
    'updateRat',
  ]


  static mapStateToProps = (state, props) => {
    const pageViewId = `ratcard-rescuecount-${props.ratId}`
    const rescueCountPageViewMeta = selectPageViewMetaById(state, { pageViewId })

    return {
      user: withCurrentUserId(selectUserById)(state),
      userDisplayRatId: withCurrentUserId(selectDisplayRatIdByUserId)(state),
      rat: selectRatById(state, props),
      ships: selectShipsByRatId(state, props),
      rescueCount: rescueCountPageViewMeta && rescueCountPageViewMeta.total,
      rescueCountPageViewId: pageViewId,
    }
  }





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {}

  static propTypes = {
    /* eslint-disable-next-line react/no-unused-prop-types */// Used in such a way that eslint cannot detect it's use
    ratId: PropTypes.string.isRequired,
  }
}





export default RatCard
