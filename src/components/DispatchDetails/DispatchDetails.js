import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

import useSelectorWithProps from '~/hooks/useSelectorWithProps'
import { selectRescueById } from '~/store/selectors'

import DispatchDetailsContent from './DispatchDetailsContent'

function DispatchDetails (props) {
  const {
    className,
    rescueId,
  } = props

  const rescue = useSelectorWithProps(props, selectRescueById)
  const router = useRouter()
  useEffect(() => {
    if (rescueId && !rescue) {
      router.replace('/dispatch')
    }
  }, [router, rescue, rescueId])

  return (
    <section className={className}>
      {rescue && <DispatchDetailsContent rescue={rescue} />}
    </section>
  )
}

DispatchDetails.propTypes = {
  className: PropTypes.string,
  rescueId: PropTypes.string,
}





export default DispatchDetails
