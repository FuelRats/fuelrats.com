// Module imports
import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



// Component imports
import { connect } from '../store'
import { selectUser, selectRatById, selectShipsByRatId } from '../store/selectors'
import classNames from '../helpers/classNames'
import CardControls from './CardControls'
import DefaultRatButton from './RatCard/DefaultRatButton'
import InlineEditSpan from './InlineEditSpan'



// Component Constants
const ELITE_GAME_YEAR_DESPARITY = 1286 // Years between IRL year and Elite universe year





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

  _handleDelete = async (event) => {
    const {
      deleteConfirm,
    } = this.state

    const {
      deleteRat,
      rat,
    } = this.state

    if (deleteConfirm) {
      if (event.target.name === 'cancel') {
        this.setState({ deleteConfirm: false })
        return
      }

      this.setState({
        deleteConfirm: false,
        submitting: 'deleting',
      })

      await deleteRat(rat.id)

      this.setState({
        submitting: false,
      })

      return
    }

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
      (state, props) => ({ name: value && value !== props.rat.attributes.name }) // validity
    )
  }

  _handleSubmit = async () => {
    const {
      updateRat,
    } = this.props

    this.setState({ submitting: true })

    await updateRat()

    this.setState({ submitting: false })
  }

  _handleEdit = () => {
    this.setState({
      editMode: true,
    })
  }

  _handleCancel = () => {
    this.setState({
      editMode: false,
      changes: {},
      validity: {
        name: false,
      },
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      rat,
      // ships,
      ratCount,
    } = this.props

    const {
      deleteConfirm,
      editMode,
      changes,
      shipsExpanded,
      submitting,
    } = this.state

    const createdAt = moment(rat.attributes.createdAt).add(ELITE_GAME_YEAR_DESPARITY, 'years').format('DD MMM YYYY').toUpperCase()

    const classes = classNames(
      'panel',
      'rat-panel',
      ['expanded', shipsExpanded],
      ['editing', editMode],
      ['submitting', submitting]
    )

    const cmdrNameValue = typeof changes.name === 'string' ? changes.name : rat.attributes.name

    return (
      <div className={classes}>
        <header>
          <div>
            <span>CMDR </span>
            <InlineEditSpan
              canEdit={editMode}
              inputClassName="dark"
              name="name"
              onChange={this._handleNameChange}
              value={cmdrNameValue} />
          </div>
          <div>
            {ratCount > 1 && (
              <DefaultRatButton ratId={rat.id} />
            )}
            <span className="rat-platform">{rat.attributes.platform.toUpperCase()}</span>
          </div>
        </header>
        <div className="panel-content">
          ships.
        </div>
        <footer className="panel-content flex center-middle justify-center">
          <div>
            <small>
              <span className="text-muted">Created: </span>
              {createdAt}
            </small>
          </div>
          <div>
            <button
              className="inline ship-expand-button"
              type="button"
              onClick={this._handleExpandShips}>
              <FontAwesomeIcon icon="angle-down" fixedWidth />
            </button>
          </div>
          <div className="rat-controls">
            <CardControls
              canDelete={this.canDelete}
              canSubmit={this.canSubmit}
              controlType="rat"
              deleteMode={deleteConfirm}
              editMode={editMode}
              onCancelClick={this._handleCancel}
              onDeleteClick={this._handleDelete}
              onEditClick={this._handleEdit}
              onSubmitClick={this._handleSubmit} />
          </div>
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

  get canDelete () {
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

  static mapDispatchToProps = []

  static mapStateToProps = (state, props) => ({
    user: selectUser(state),
    rat: selectRatById(state, props),
    ships: selectShipsByRatId(state, props),
  })





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
