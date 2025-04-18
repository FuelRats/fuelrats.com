import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState } from 'react'

import makePaginatedRoute from '~/util/router/makePaginatedRoute'

import styles from './Pagination.module.scss'

const DEFAULT_PAGE_SIZE = 25

function Pagination (props) {
  const {
    author,
    category,
    page,
    pageInput,
    pageSize,
    onUpdatePageSize,
    route,
    totalPages = 1,
  } = props

  const [currentPage, setCurrentPage] = useState(page)

  const router = useRouter()

  const showPrevPage = (page > 1 ? '' : 'hidden')
  const showNextPage = (page < totalPages ? '' : 'hidden')

  let prevPage = makePaginatedRoute({
    route, author, category, page: Math.max(1, page - 1),
  })

  let nextPage = makePaginatedRoute({
    route, author, category, page: Math.min(page + 1, totalPages),
  })

  if (pageSize !== DEFAULT_PAGE_SIZE) {
    prevPage = makePaginatedRoute({
      route, author, category, page: Math.max(1, page - 1), limit: pageSize,
    })

    nextPage = makePaginatedRoute({
      route, author, category, page: Math.min(page + 1, totalPages), limit: pageSize,
    })
  }

  const handlePageChange = (input) => {
    setCurrentPage(input.target.value)
  }

  const handlePageUpdate = (input) => {
    input.preventDefault()

    let newRoute = makePaginatedRoute({
      route, author, category, page: Math.max(1, currentPage),
    })

    if (pageSize !== DEFAULT_PAGE_SIZE) {
      newRoute = makePaginatedRoute({
        route, author, category, page: Math.max(1, currentPage), limit: pageSize,
      })
    }

    router.push(newRoute)
  }

  return (
    <menu
      type="toolbar">
      <div className="secondary" style={{ visibility: showPrevPage }}>
        <Link href={prevPage}>
          <a className="button">{'Previous Page'}</a>
        </Link>
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

      {
        (onUpdatePageSize) && (
          <div className={styles.perPage}>
            <select aria-label="Per Page" value={pageSize} onChange={onUpdatePageSize}>
              <option value="5">{'5 Rows'}</option>
              <option value="10">{'10 Rows'}</option>
              <option value="20">{'20 Rows'}</option>
              <option value="25">{'25 Rows'}</option>
              <option value="50">{'50 Rows'}</option>
              <option value="100">{'100 Rows'}</option>
            </select>
          </div>
        )
      }

      <div className="primary" style={{ visibility: showNextPage }}>
        <Link href={nextPage}>
          <a className="button">{'Next Page'}</a>
        </Link>
      </div>
    </menu>
  )
}
Pagination.propTypes = {
  author: PropTypes.string,
  category: PropTypes.string,
  onUpdatePageSize: PropTypes.func,
  page: PropTypes.number,
  pageInput: PropTypes.bool,
  pageSize: PropTypes.number,
  route: PropTypes.string,
  totalPages: PropTypes.number,
}




export default Pagination
