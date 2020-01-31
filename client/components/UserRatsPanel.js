// Module imports
import React from 'react'




// Component imports
import { connect } from '../store'
import {
  selectUserById,
  withCurrentUserId,
} from '../store/selectors'
import AddRatForm from './AddRatForm'
import RatCard from './RatCard'



function UserRatsPanel ({ user }) {
  const { rats } = user.relationships

  return (
    <div className="user-rats-tab">
      <div className="add-rat-form-container">
        <AddRatForm />
      </div>
      <div className="rat-cards-container">
        {
          rats.data.map(({ id }) => (
            <div key={id} className="rat-card-wrapper">
              <RatCard ratId={id} />
            </div>
          ))
        }
      </div>
    </div>
  )
}





UserRatsPanel.mapStateToProps = (state) => ({
  user: withCurrentUserId(selectUserById)(state),
})





export default connect(UserRatsPanel)
