import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

import styles from './Quote.module.scss'


function Quote (props) {
  const {
    author,
    children,
    date,
  } = props

  return (
    <blockquote className={styles.quote}>
      {
        (props.date || props.author) && (
          <div className="header">
            {
              props.date && (
                <span className={styles.quoteDate}><FontAwesomeIcon fixedWidth icon="calendar-alt" /> {date}</span>
              )
            }
            {
              props.author && (
                <span className={styles.quoteAuthor}>{author}</span>
              )
            }
          </div>
        )
      }

      <div className={styles.quoteContent}>
        {children}
      </div>
    </blockquote>
  )
}

Quote.propTypes = {
  author: PropTypes.string,
  children: PropTypes.node,
  date: PropTypes.string,
}





export default Quote
