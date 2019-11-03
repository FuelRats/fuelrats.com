// Module imports
import React from 'react'




// Component imports
import { connect } from '../store'
import {
  selectUser,
  withCurrentUser,
} from '../store/selectors'
import RatCard from './RatCard'
import AddRatForm from './AddRatForm'



const UserRatsPanel = ({ user }) => {
  const { rats } = user.relationships

  return (
    <div className="user-rats-tab">
      <div className="add-rat-form-container">
        <AddRatForm />
      </div>
      <div className="rat-cards-container">
        {rats.data.map(({ id }) => (
          <div key={id} className="rat-card-wrapper">
            <RatCard ratId={id} />
          </div>
        ))}
      </div>
    </div>
  )
}





UserRatsPanel.mapStateToProps = (state) => ({
  user: withCurrentUser(selectUser)(state),
})





export default connect(UserRatsPanel)
