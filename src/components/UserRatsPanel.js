import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { getUserStatistics } from '~/store/actions/statistics'
import {
  selectUserById,
  withCurrentUserId,
  selectRatStatisticsById,
} from '~/store/selectors'

import AddRatForm from './AddRatForm'
import RatCard from './RatCard'





function UserRatsPanel () {
  const user = useSelector(withCurrentUserId(selectUserById))
  const { rats } = user.relationships

  const dispatch = useDispatch()
  const ratStatistics = useSelectorWithProps({ ratId: rats?.data[0].id }, selectRatStatisticsById)

  useEffect(() => {
    if (!ratStatistics) {
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





export default UserRatsPanel
