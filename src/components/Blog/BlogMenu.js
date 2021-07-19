import Link from 'next/link'
import PropTypes from 'prop-types'

import makeBlogRoute from '~/util/router/makeBlogRoute'

function BlogMenu (props) {
  const {
    author,
    category,
    page,
    totalPages,
  } = props

  return (
    <menu
      type="toolbar">
      <div className="secondary">
        {
          (page > 1) && (
            <Link href={makeBlogRoute({ author, category, page: Math.max(1, page - 1) })}>
              <a className="button">{'Previous Page'}</a>
            </Link>
          )
        }
      </div>

      <div className="primary">
        {
          (page < totalPages) && (
            <Link href={makeBlogRoute({ author, category, page: Math.min(page + 1, totalPages) })}>
              <a className="button">{'Next Page'}</a>
            </Link>
          )
        }
      </div>
    </menu>
  )
}
BlogMenu.propTypes = {
  author: PropTypes.string,
  category: PropTypes.string,
  page: PropTypes.number,
  totalPages: PropTypes.number,
}




export default BlogMenu
