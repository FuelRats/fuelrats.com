// Module imports
import connect from '../helpers/connect'
import AddNicknameForm from './AddNicknameForm'
//import ConfirmActionButton from './ConfirmActionButton'
import Component from './Component'


class UserNicknamesPanel extends Component {
  _deleteNickname = async (event) => {
    await this.props.deleteNickname(event.target.name)
    return 'Deleted!'
  }

  render () {
    const {
      user,
    } = this.props

    return (
      <div className="panel user-nicknames">
        <header>IRC Nicknames</header>

        <div className="panel-content">
          <ul>
            {(user.attributes && user.attributes.nicknames)
              && user.attributes.nicknames.map(nickname => (
                <li key={nickname}>
                  <span>{nickname}</span>
                  {/* Disabled due to problems with current implementation of IRC nick management.
                      Re-enable after LDAP integration.
                  <ConfirmActionButton
                    name={nickname}
                    onConfirm={this._deleteNickname}>
                    Delete
                  </ConfirmActionButton>
                  */}
                </li>
              ))}
          </ul>
        </div>
        <footer>
          <AddNicknameForm />
        </footer>
      </div>
    )
  }
}





const mapDispatchToProps = ['deleteNickname']
const mapStateToProps = state => ({ user: state.user })




export default connect(mapStateToProps, mapDispatchToProps)(UserNicknamesPanel)
