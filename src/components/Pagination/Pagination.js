import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo, useState } from 'react'

import safeParseInt from '~/util/safeParseInt'

import styles from './Pagination.module.scss'

/**
 *
 * @param {object} props
 * @param {number} [props.defaultPageSize]
 * @param {number} props.page
 * @param {Function} props.onGenerateRoute
 * @param {number} [props.pageSize]
 * @param {Array<number>} [props.pageSizeOptions]
 * @param {boolean} [props.showPageInput]
 * @param {number} props.totalPages
 * @returns {React.ReactNode}
 */
function Pagination (props) {
  const {
    defaultPageSize,
    onGenerateRoute,
    page,
    pageSize,
    pageSizeOptions,
    showPageInput,
    totalPages,
  } = props

  const [pageInput, setPageInput] = useState(page)

  const router = useRouter()

  const showPrevPage = (page > 1 ? '' : 'hidden')
  const showNextPage = (page < totalPages ? '' : 'hidden')

  const makePageRoute = useCallback(({
    page: nextPage = page,
    limit: nextLimit = pageSize,
  }) => {
    return onGenerateRoute({
      page: Math.max(Math.min(nextPage, totalPages), 1),
      limit: (typeof nextLimit !== 'number' || nextLimit === defaultPageSize)
        ? undefined
        : nextLimit,
    })
  }, [defaultPageSize, page, onGenerateRoute, pageSize, totalPages])

  const prevPage = useMemo(() => {
    return makePageRoute({ page: page - 1 })
  }, [page, makePageRoute])

  const nextPage = useMemo(() => {
    return makePageRoute({ page: page + 1 })
  }, [page, makePageRoute])

  const handlePageInputChange = useCallback((event) => {
    setPageInput((lastVal) => {
      return safeParseInt(event.target.value) ?? lastVal
    })
  }, [])

  const handlePageSizeChange = useCallback((event) => {
    event.preventDefault()
    router.push(makePageRoute({ limit: safeParseInt(event.target.value) }))
  }, [makePageRoute, router])

  const handleSubmitNextPage = useCallback((event) => {
    event.preventDefault()
    router.push(makePageRoute({ page: pageInput }))
  }, [makePageRoute, pageInput, router])

  return (
    <menu
      type="toolbar">
      <div className="secondary" style={{ visibility: showPrevPage }}>
        <Link className="button" href={prevPage}>{'Previous Page'}</Link>
      </div>
      {
        (showPageInput) && (
          (
            <form className={styles.pageInput} onSubmit={handleSubmitNextPage}>
              {'Page'}
              <input
                aria-label="Page"
                max={totalPages}
                min="1"
                type="number"
                value={pageInput}
                onChange={handlePageInputChange} />
              {`of ${totalPages}`}
            </form>
          )
        )
      }
      {
        (pageSizeOptions?.length) && (
          <div className={styles.perPage}>
            <select aria-label="Per Page" value={pageSize} onChange={handlePageSizeChange}>
              {
                pageSizeOptions?.map(({ label, value }) => {
                  return (
                    <option key={`${label}${value}`} value={value}>
                      {label}
                    </option>
                  )
                })
              }
            </select>
          </div>
        )
      }
      <div className="primary" style={{ visibility: showNextPage }}>
        <Link className="button" href={nextPage}>{'Next Page'}</Link>
      </div>
    </menu>
  )
}
Pagination.propTypes = {
  defaultPageSize: PropTypes.number,
  onGenerateRoute: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })),
  showPageInput: PropTypes.bool,
  totalPages: PropTypes.number.isRequired,
}




export default Pagination
