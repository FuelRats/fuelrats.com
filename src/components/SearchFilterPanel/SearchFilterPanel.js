import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'

import styles from './SearchFilterPanel.module.scss'



function ChipsField ({ field, filters, onFilterChange }) {
  return (
    <div className={styles.filterRow}>
      <span className={styles.filterLabel}>{field.label}</span>
      <div className={styles.chipGroup}>
        {
          field.options.map((opt) => {
            const isActive = filters[field.field] === opt.value
            return (
              <button
                key={opt.value}
                className={clsx(styles.chip, { [styles.chipActive]: isActive })}
                type="button"
                onClick={
                  () => {
                    return onFilterChange(field.field, isActive ? '' : opt.value)
                  }
                }>
                {opt.icon && (<><FontAwesomeIcon fixedWidth icon={opt.icon} />{' '}</>)}
                {opt.label}
              </button>
            )
          })
        }
      </div>
    </div>
  )
}

function ToggleField ({ field, filters, onFilterChange }) {
  const isActive = filters[field.field] === field.activeValue
  return (
    <button
      className={clsx(styles.chip, field.chipClassName, { [styles.chipActive]: isActive })}
      type="button"
      onClick={
        () => {
          return onFilterChange(field.field, isActive ? '' : field.activeValue)
        }
      }>
      {field.label}
    </button>
  )
}

function TextField ({ field, filters, onFilterChange }) {
  return (
    <label className={styles.filterField}>
      <span>{field.label}</span>
      <input
        aria-label={field.label}
        placeholder={field.placeholder}
        type="text"
        value={filters[field.field]}
        onChange={
          (event) => {
            return onFilterChange(field.field, event.target.value)
          }
        } />
    </label>
  )
}

function DateRangeField ({ field, filters, onFilterChange }) {
  return (
    <div className={styles.filterInputRow}>
      <label className={styles.filterField}>
        <span>{`${field.label} after`}</span>
        <input
          aria-label={`${field.label} after`}
          type="date"
          value={filters[field.fieldAfter]}
          onChange={
            (event) => {
              return onFilterChange(field.fieldAfter, event.target.value)
            }
          } />
      </label>
      <label className={styles.filterField}>
        <span>{`${field.label} before`}</span>
        <input
          aria-label={`${field.label} before`}
          type="date"
          value={filters[field.fieldBefore]}
          onChange={
            (event) => {
              return onFilterChange(field.fieldBefore, event.target.value)
            }
          } />
      </label>
    </div>
  )
}


function renderField (field, filters, onFilterChange) {
  switch (field.type) {
    case 'chips':
      return <ChipsField key={field.field} field={field} filters={filters} onFilterChange={onFilterChange} />
    case 'toggle':
      return <ToggleField key={field.field} field={field} filters={filters} onFilterChange={onFilterChange} />
    case 'text':
      return <TextField key={field.field} field={field} filters={filters} onFilterChange={onFilterChange} />
    case 'dateRange':
      return <DateRangeField key={field.fieldAfter} field={field} filters={filters} onFilterChange={onFilterChange} />
    case 'custom':
      return field.render(filters, onFilterChange)
    default:
      return null
  }
}


function SearchFilterPanel ({
  filters,
  onFilterChange,
  onReset,
  showFilters,
  onToggleFilters,
  searchField,
  fields,
  sortOptions,
  sortField = 'sort',
  footerFields,
}) {
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchRow}>
        <FontAwesomeIcon className={styles.searchIcon} icon="search" />
        <input
          aria-label={searchField.label ?? searchField.placeholder}
          className={styles.searchInput}
          placeholder={searchField.placeholder}
          type="text"
          value={filters[searchField.field]}
          onChange={
            (event) => {
              return onFilterChange(searchField.field, event.target.value)
            }
          } />
        <button
          aria-label="Advanced filters"
          className={styles.filterToggle}
          title="Advanced filters"
          type="button"
          onClick={onToggleFilters}>
          <FontAwesomeIcon icon="sliders" />
        </button>
      </div>
      {
        showFilters && (
          <div className={styles.filterPanel}>
            {
              fields?.map((field) => {
                return renderField(field, filters, onFilterChange)
              })
            }

            <div className={styles.filterFooter}>
              {
                footerFields?.map((field) => {
                  return renderField(field, filters, onFilterChange)
                })
              }

              {
                sortOptions && (
                  <label className={styles.sortField}>
                    <span>{'Sort'}</span>
                    <select
                      value={filters[sortField]}
                      onChange={
                        (event) => {
                          return onFilterChange(sortField, event.target.value)
                        }
                      }>
                      {
                        sortOptions.map((opt) => {
                          return <option key={opt.value} value={opt.value}>{opt.label}</option>
                        })
                      }
                    </select>
                  </label>
                )
              }

              <button
                className={styles.resetButton}
                type="button"
                onClick={onReset}>
                {'Reset'}
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}


export default SearchFilterPanel
