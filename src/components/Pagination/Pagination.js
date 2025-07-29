import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState } from 'react'

import styles from './Pagination.module.scss'

const DEFAULT_PAGE_SIZE = 25
const DEFAULT_PAGE_SIZE_OPTIONS = [
  { value: 5, label: '5 Rows' },
  { value: 10, label: '10 Rows' },
  { value: 20, label: '20 Rows' },
  { value: 25, label: '25 Rows' },
  { value: 50, label: '50 Rows' },
  { value: 100, label: '100 Rows' },
]

function Pagination (props) {
  const {
    author,
    category,
    page,
    pageInput,
    pageSize = DEFAULT_PAGE_SIZE,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    onUpdatePageSize,
    onMakeRoute,
    route,
    totalPages = 1,
    ...routeParams
  } = props

  const [currentPage, setCurrentPage] = useState(page)

  const router = useRouter()

  const showPrevPage = (page > 1 ? '' : 'hidden')
  const showNextPage = (page < totalPages ? '' : 'hidden')

  // Use the provided route generator or fall back to legacy behavior
  const generateRoute = onMakeRoute || ((routeOptions) => {
    const { author: routeAuthor, category: routeCategory, page: routePage, ...query } = routeOptions
    let parsedRoute = `/${route}`

    if (routeAuthor) {
      parsedRoute += `/author/${routeAuthor}`
    } else if (routeCategory) {
      parsedRoute += `/category/${routeCategory}`
    }

    if (typeof routePage === 'number' && routePage > 1) {
      parsedRoute += `/page/${routePage}`
    }

    const queryString = Object.keys(query).length > 0 
      ? `?${new URLSearchParams(query).toString()}`
      : ''

    return `${parsedRoute}${queryString}`
  })

  const prevPage = generateRoute({
    author,
    category,
    page: Math.max(1, page - 1),
    ...(pageSize !== DEFAULT_PAGE_SIZE && { limit: pageSize }),
    ...routeParams,
  })

  const nextPage = generateRoute({
    author,
    category,
    page: Math.min(page + 1, totalPages),
    ...(pageSize !== DEFAULT_PAGE_SIZE && { limit: pageSize }),
    ...routeParams,
  })

  const handlePageChange = (input) => {
    setCurrentPage(input.target.value)
  }

  const handlePageUpdate = (input) => {
    input.preventDefault()

    const newRoute = generateRoute({
      author,
      category,
      page: Math.max(1, currentPage),
      ...(pageSize !== DEFAULT_PAGE_SIZE && { limit: pageSize }),
      ...routeParams,
    })

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
              {pageSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
  onMakeRoute: PropTypes.func,
  onUpdatePageSize: PropTypes.func,
  page: PropTypes.number,
  pageInput: PropTypes.bool,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  })),
  route: PropTypes.string,
  totalPages: PropTypes.number,
}




export default Pagination
