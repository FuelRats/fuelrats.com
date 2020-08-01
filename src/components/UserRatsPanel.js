import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { connect } from '~/store'
import { getUserStatistics } from '~/store/actions/statistics'
import {
  selectUserById,
  withCurrentUserId,
  selectRatStatisticsById,
} from '~/store/selectors'

import AddRatForm from './AddRatForm'
import RatCard from './RatCard'



function UserRatsPanel ({ user }) {
  const { rats } = user.relationships

  const dispatch = useDispatch()
  const hasRatStatistics = useSelector((state) => {
    return Boolean(selectRatStatisticsById(state, { ratId: rats?.data[0].id }))
  })

  useEffect(() => {
    if (!hasRatStatistics) {
      dispatch(getUserStatistics(user.id))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="user-rats-tab">
      <div className="add-rat-form-container">
        <AddRatForm />
      </div>
      <div className="rat-cards-container">
        {
          rats.data.map(({ id }) => {
            return (
              <div key={id} className="rat-card-wrapper">
                <RatCard ratId={id} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}





UserRatsPanel.mapStateToProps = (state) => {
  return {
    user: withCurrentUserId(selectUserById)(state),
  }
}





export default connect(UserRatsPanel)
