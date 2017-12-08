// Module imports
import { connect } from 'react-redux'





// Module imports
import AddNicknameForm from './AddNicknameForm'





const UserNicknamesPanel = (props) => (
  <div className="panel user-nicknames">
    <header>IRC Nicknames</header>

    <div className="panel-content">
      <ul>
        {(props.user.attributes && props.user.attributes.nicknames) && props.user.attributes.nicknames.map(nickname => <li key={nickname}>{nickname}</li>)}
      </ul>
    </div>

    <footer>
      <AddNicknameForm />
    </footer>
  </div>
)





const mapStateToProps = state => ({ user: state.user })





export default connect(mapStateToProps)(UserNicknamesPanel)
