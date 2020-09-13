import PropTypes from 'prop-types'
import React, { useEffect } from 'react'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { useRouter } from '~/routes'
import { selectRescueById } from '~/store/selectors'

import RescueDetailsContent from './RescueDetailsContent'

function RescueDetails (props) {
  const {
    className,
    rescueId,
  } = props

  const rescue = useSelectorWithProps(props, selectRescueById)
  const router = useRouter()
  useEffect(() => {
    if (rescueId && !rescue) {
      router.replaceRoute('dispatch', { })
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
