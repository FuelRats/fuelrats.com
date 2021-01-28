import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { selectDispatchBoard } from '~/store/selectors/dispatch'

import styles from './DispatchTable.module.scss'
import RescueCard from './RescueCard'





function DispatchTable (props) {
  const {
    className,
  } = props

  const rescueIds = useSelector(selectDispatchBoard)

  return (
    <section className={[styles.dispatchTable, className]}>
      <div>
        {
          rescueIds?.map((rescueId) => {
            return (
              <RescueCard
                key={rescueId}
                rescueId={rescueId} />
            )
          })
        }
      </div>
    </section>
  )
}

DispatchTable.propTypes = {
  className: PropTypes.string,
}





export default DispatchTable
