import clsx from 'clsx'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Key from './Key'




// Constants
const DEFAULT_SEARCH_DEBOUNCE_MS = 500

const KEYS = {
  TAB: 9,
  ENTER: 13,
  COMMA: 188,
  BACKSPACE: 8,
  DELETE: 46,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
}




function resolveValue (item, valueProp) {
  if (typeof valueProp === 'function') {
    return valueProp(item)
  }
  if (typeof valueProp !== 'string') {
    throw new TypeError('valueProp must be either a string pointer or function.')
  }

  let value = item
  for (const key of valueProp.split('.')) {
    if (value == null) {
      return undefined
    }
    value = value[key]
  }
  return value
}


function parseOption (optionValue) {
  return typeof optionValue === 'string' ? { value: optionValue } : optionValue
}


function defaultRenderValue (item, valueProp) {
  return resolveValue(item, valueProp)
}


function defaultRenderLoader () {
  return <span>{'Loading...'}</span>
}


function defaultRenderNoResults () {
  return <span>{'No results'}</span>
}




function TagsInput (props) {
  const {
    'aria-label': ariaLabel,
    className,
    disabled,
    name,
    options: optionsProp,
    placeholder,
    searchDebounce = DEFAULT_SEARCH_DEBOUNCE_MS,
    value: valueProp,
    valueProp: valuePropAccessor = 'value',
    onAdd,
    onChange,
    onRemove,
    onSearch,
    renderValue,
    renderLoader = defaultRenderLoader,
    renderNoResults = defaultRenderNoResults,
    ...passthroughProps
  } = props

  const isSingle = Boolean(passthroughProps['data-single'])
  const allowNew = Boolean(passthroughProps['data-allownew'])
  const allowDuplicates = Boolean(passthroughProps['data-allowduplicates'])

  const inputRef = useRef(null)
  const containerRef = useRef(null)

  const getValue = useCallback((item) => {
    return resolveValue(item, valuePropAccessor)
  }, [valuePropAccessor])

  const initialTags = useMemo(() => {
    const asArray = valueProp ? (Array.isArray(valueProp) ? valueProp : [valueProp]) : []
    return asArray.map(parseOption)
  }, [valueProp])

  const [tags, setTags] = useState(initialTags)
  const [options, setOptions] = useState(() => {
    return (Array.isArray(optionsProp) ? optionsProp : (optionsProp ? [optionsProp] : []))
  })
  const [loading, setLoading] = useState(false)
  const [currentValue, setCurrentValue] = useState('')
  const [newFocus, setNewFocus] = useState(true)
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedTag, setSelectedTag] = useState(null)

  // Sync from incoming `value` prop
  useEffect(() => {
    setTags(initialTags)
  }, [initialTags])

  // Sync from incoming `options` prop
  useEffect(() => {
    if (optionsProp !== undefined) {
      setOptions(Array.isArray(optionsProp) ? optionsProp : [optionsProp])
    }
  }, [optionsProp])

  const findTag = useCallback((candidate) => {
    const parsed = parseOption(candidate)
    return tags.find((tag) => {
      return getValue(tag) === getValue(parsed)
    }) ?? null
  }, [tags, getValue])

  const addTag = useCallback((tag) => {
    if (!allowDuplicates && findTag(tag)) {
      return false
    }
    const nextTags = isSingle ? [tag] : [...tags, tag]
    setTags(nextTags)
    setOptions([])
    setSelectedOption(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onAdd?.(tag)
    onChange?.(nextTags)
    return true
  }, [allowDuplicates, findTag, isSingle, tags, onAdd, onChange])

  const removeTag = useCallback((tag) => {
    if (isSingle) {
      const nextValue = getValue(tag)
      setTags([])
      setCurrentValue(nextValue)
      setNewFocus(false)
      // Put the previous value back into the input so the user can edit it.
      queueMicrotask(() => {
        if (inputRef.current) {
          inputRef.current.value = nextValue
          inputRef.current.focus()
          inputRef.current.setSelectionRange(0, nextValue?.length ?? 0)
        }
      })
      onRemove?.(tag)
      onChange?.([])
      return
    }

    const nextTags = tags.filter((candidate) => {
      return candidate !== tag
    })
    setTags(nextTags)
    onRemove?.(tag)
    onChange?.(nextTags)
  }, [isSingle, tags, getValue, onRemove, onChange])

  // Wrapped search with loading-state management and debouncing.
  const runSearch = useCallback(async (query) => {
    if (!onSearch) {
      return
    }
    setLoading(true)
    try {
      const result = await onSearch(query)
      const nextOptions = Array.isArray(result) ? result.map(parseOption) : []
      // Filter out already-selected tags when duplicates aren't allowed.
      const filtered = allowDuplicates
        ? nextOptions
        : nextOptions.filter((option) => {
          return !tags.some((tag) => {
            return getValue(tag) === getValue(option)
          })
        })
      setOptions(filtered)
      setSelectedOption(null)
      setNewFocus(false)
    } finally {
      setLoading(false)
    }
  }, [onSearch, allowDuplicates, tags, getValue])

  const debouncedSearch = useMemo(() => {
    return debounce((query) => {
      return runSearch(query)
    }, searchDebounce)
  }, [runSearch, searchDebounce])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleInput = useCallback((event) => {
    setSelectedTag(null)
    setCurrentValue(event.target.value)
    debouncedSearch(event.target.value)
  }, [debouncedSearch])

  const handleFocus = useCallback((event) => {
    event.target.parentNode.classList.add('focus')
  }, [])

  const handleBlur = useCallback((event) => {
    setNewFocus(true)
    event.target.parentNode.classList.remove('focus')
  }, [])

  const handleReturn = useCallback((event) => {
    if (event.target.value) {
      event.preventDefault()
    }
    const selected = selectedOption !== null ? options[selectedOption] : null
    if (selected) {
      addTag(selected)
    } else if (allowNew && event.target.value) {
      addTag({ value: event.target.value })
    }
  }, [selectedOption, options, allowNew, addTag])

  const handleDelete = useCallback((event) => {
    const input = inputRef.current
    if (!input) {
      return
    }
    let target = selectedTag
    if (target === null && (input.selectionStart + input.selectionEnd) === 0) {
      target = tags.length - 1
    }
    if (target !== null && target >= 0 && tags[target]) {
      event.preventDefault()
      removeTag(tags[target])
      if (tags.length > 1 && selectedTag !== null) {
        setSelectedTag(target - 1)
      }
    }
  }, [selectedTag, tags, removeTag])

  const handleLeftArrow = useCallback((event) => {
    const input = inputRef.current
    if (!input || (input.selectionStart + input.selectionEnd) !== 0) {
      return
    }
    event.preventDefault()
    setSelectedTag((prev) => {
      if (prev === null) {
        return tags.length - 1
      }
      return prev === 0 ? 0 : prev - 1
    })
  }, [tags.length])

  const handleRightArrow = useCallback((event) => {
    if (selectedTag === null) {
      return
    }
    event.preventDefault()
    setSelectedTag((prev) => {
      if (prev < tags.length - 1) {
        return prev + 1
      }
      return null
    })
  }, [selectedTag, tags.length])

  const handleUpArrow = useCallback((event) => {
    if (!options.length) {
      return
    }
    event.preventDefault()
    setSelectedOption((prev) => {
      if (!prev) {
        return options.length - 1
      }
      return prev - 1
    })
  }, [options.length])

  const handleDownArrow = useCallback((event) => {
    if (!options.length) {
      return
    }
    event.preventDefault()
    setSelectedOption((prev) => {
      if (prev === null || prev >= options.length - 1) {
        return 0
      }
      return prev + 1
    })
  }, [options.length])

  const handleKeyDown = useCallback((event) => {
    switch (event.which) {
      case KEYS.TAB:
      case KEYS.ENTER:
      case KEYS.COMMA:
        handleReturn(event)
        break
      case KEYS.BACKSPACE:
      case KEYS.DELETE:
        handleDelete(event)
        break
      case KEYS.LEFT:
        handleLeftArrow(event)
        break
      case KEYS.RIGHT:
        handleRightArrow(event)
        break
      case KEYS.UP:
        handleUpArrow(event)
        break
      case KEYS.DOWN:
        handleDownArrow(event)
        break
      default:
        break
    }
  }, [handleReturn, handleDelete, handleLeftArrow, handleRightArrow, handleUpArrow, handleDownArrow])

  const renderItem = useCallback((item) => {
    return renderValue ? renderValue(item) : defaultRenderValue(item, valuePropAccessor)
  }, [renderValue, valuePropAccessor])

  return (
    <div
      {...passthroughProps}
      ref={containerRef}
      className={clsx('tags-input', { 'has-tags': tags.length > 0 }, className)}>
      <ul className="tags">
        {tags.map((tag, index) => {
          return (
            <li key={index} className={clsx('tag', { focus: selectedTag === index })}>
              {renderItem(tag)}
              <button
                type="button"
                onClick={() => {
                  return removeTag(tag)
                }}>
                {'\u00d7'}
              </button>
            </li>
          )
        })}
      </ul>

      <input
        ref={inputRef}
        aria-label={ariaLabel}
        autoComplete="off"
        disabled={disabled}
        name={name}
        placeholder={placeholder}
        type="search"
        onBlur={handleBlur}
        onFocus={handleFocus}
        onInput={handleInput}
        onKeyDown={handleKeyDown} />

      {allowNew && (
        <div className={clsx('return-prompt', { show: currentValue })}>
          <span>{'Press '}<Key>{'Return'}</Key>{' to add'}</span>
        </div>
      )}

      {loading && <div className="loader">{renderLoader()}</div>}

      {(!loading && !newFocus && Boolean(currentValue) && !options.length) && (
        <div className="no-results">{renderNoResults()}</div>
      )}

      {
        (!loading && Boolean(options.length)) && (
          <ol className="options">
            {options.map((option, index) => {
              return (
                <li
                  key={index}
                  className={clsx('option', { focus: selectedOption === index })}
                  onMouseDown={() => {
                    return addTag(option)
                  }}
                  onMouseOver={() => {
                    return setSelectedOption(index)
                  }}
                  onFocus={() => {
                    return setSelectedOption(index)
                  }}>
                  {renderItem(option)}
                </li>
              )
            })}
          </ol>
        )
      }
    </div>
  )
}




export default TagsInput
