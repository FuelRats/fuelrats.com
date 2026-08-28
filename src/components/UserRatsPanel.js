import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AddRatForm from '~/components/Forms/AddRatForm'
import RatCard from '~/components/RatCard'
import { getUserStatistics } from '~/store/actions/statistics'
import {
  selectUserById,
  withCurrentUserId,
  selectRatStatisticsById,
} from '~/store/selectors'





function UserRatsPanel () {
  const user = useSelector(withCurrentUserId(selectUserById))
  const { rats } = user.relationships

  const dispatch = useDispatch()
  const ratStatistics = useSelector((state) => {
    return selectRatStatisticsById(state, { ratId: rats?.data?.[0]?.id })
  })

  useEffect(() => {
    if (!ratStatistics) {
      Promise.resolve(dispatch(getUserStatistics(user.id))).catch(() => {})
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
