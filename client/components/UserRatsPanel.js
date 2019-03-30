// Module imports
import React from 'react'




// Component imports
import { connect } from '../store'
import { selectUser } from '../store/selectors'
import RatCard from './RatCard'
import AddRatForm from './AddRatForm'



const UserRatsPanel = ({ user }) => {
  const { rats } = user.relationships

  return (
    <div className="user-rats-tab flex column">
      <div className="flex justify-end">
        <AddRatForm />
      </div>
      <div className="flex">
        {rats.data.map(({ id }) => <RatCard key={id} ratId={id} />)}
      </div>
    </div>
  )
}





UserRatsPanel.mapStateToProps = (state) => ({
  user: selectUser(state),
})





export default connect(UserRatsPanel)
