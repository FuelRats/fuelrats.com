import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState } from 'react'

import makePaginatedRoute from '~/util/router/makePaginatedRoute'

import styles from './Pagination.module.scss'

function Pagination (props) {
  const {
    author,
    category,
    page,
    pageInput,
    route,
    totalPages = 1,
  } = props

  const [currentPage, setCurrentPage] = useState(page)

  const router = useRouter()

  const handlePageChange = (input) => {
    setCurrentPage(input.target.value)
  }

  const handlePageUpdate = (input) => {
    input.preventDefault()

    const newRoute = makePaginatedRoute({ route, author, category, page: Math.max(1, currentPage) })

    router.push(newRoute)
  }

  return (
    <menu
      type="toolbar">
      <div className="secondary">
        {
          (currentPage > 1) && (
            <Link href={makePaginatedRoute({ route, author, category, page: Math.max(1, currentPage - 1) })}>
              <a className="button">{'Previous Page'}</a>
            </Link>
          )
        }
      </div>

      {
        (pageInput) && (
          (
            <form className={styles.pageInput} onSubmit={handlePageUpdate}>
              {'Page'}
              <input
                aria-label="Page"
                max={totalPages}
                min="1"
                type="number"
                value={currentPage}
                onChange={handlePageChange} />
              {`of ${totalPages}`}
            </form>
          )
        )
      }

      <div className="primary">
        {
          (page < totalPages) && (
            <Link href={makePaginatedRoute({ route, author, category, page: Math.min(currentPage + 1, totalPages) })}>
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
  pageInput: PropTypes.bool,
  route: PropTypes.string,
  totalPages: PropTypes.number,
}




export default Pagination
