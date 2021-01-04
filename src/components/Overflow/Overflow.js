import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

import styles from './Overflow.module.scss'





function Overflow (props) {
  const {
    children,
    className,
    icon = 'ellipsis-h',
    menuClassName,
  } = props

  return (
    <>
      <button className={[styles.button, className]} type="button">
        <FontAwesomeIcon fixedWidth icon={icon} />
      </button>
      <div className={[styles.menu, menuClassName]}>
        <ul>
          {children}
        </ul>
      </div>
    </>
  )
}

Overflow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  icon: PropTypes.string,
  menuClassName: PropTypes.string,
}





export default Overflow
