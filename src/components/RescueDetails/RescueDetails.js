import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { selectRescueById } from '~/store/selectors'
import { selectDispatchBoard } from '~/store/selectors/dispatch'

import RescueDetailsContent from './RescueDetailsContent'

function RescueDetails (props) {
  const {
    className,
    rescueId,
  } = props

  const rescue = useSelector((state) => {
    return selectRescueById(state, props)
  })
  const board = useSelector(selectDispatchBoard)
  const isOnBoard = rescueId && board?.includes(rescueId)
  const router = useRouter()
  useEffect(() => {
    if (rescueId && (!rescue || !isOnBoard)) {
      router.replace('/dispatch')
    }
  }, [router, rescue, rescueId, isOnBoard])

  return (
    <section className={className}>
      {rescue && <RescueDetailsContent rescue={rescue} />}
    </section>
  )
}

RescueDetails.propTypes = {
  className: PropTypes.string,
  rescueId: PropTypes.string,
}





export default RescueDetails
