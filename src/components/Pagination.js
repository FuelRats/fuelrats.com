import Link from 'next/link'
import PropTypes from 'prop-types'

import makePaginatedRoute from '~/util/router/makePaginatedRoute'

function Pagination (props) {
  const {
    author,
    category,
    page,
    route,
    totalPages,
  } = props

  return (
    <menu
      type="toolbar">
      <div className="secondary">
        {
          (page > 1) && (
            <Link href={makePaginatedRoute({ route, author, category, page: Math.max(1, page - 1) })}>
              <a className="button">{'Previous Page'}</a>
            </Link>
          )
        }
      </div>

      <div className="primary">
        {
          (page < totalPages) && (
            <Link href={makePaginatedRoute({ route, author, category, page: Math.min(page + 1, totalPages) })}>
              <a className="button">{'Next Page'}</a>
            </Link>
          )
        }
      </div>
    </menu>
  )
}
Pagination.propTypes = {
  author: PropTypes.string,
  category: PropTypes.string,
  page: PropTypes.number,
  route: PropTypes.string,
  totalPages: PropTypes.number,
}




export default Pagination
