import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

import { selectRescueById } from '~/store/selectors'

import RescueDetailsContent from './RescueDetailsContent'

function RescueDetails (props) {
  const {
    className,
    rescueId,
  } = props

  const rescue = useSelector((state) => {
    return selectRescueById(state, props)
  })
  const router = useRouter()
  useEffect(() => {
    if (rescueId && !rescue) {
      router.replace('/dispatch')
    }
  }, [router, rescue, rescueId])

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
