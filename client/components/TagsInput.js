// Complete rewrite pending. We will ignore these errors for now.
/* eslint-disable no-magic-numbers, no-negated-condition, prefer-rest-params, react/jsx-handler-names, no-restricted-syntax, no-return-assign, react/no-deprecated */





// Module imports
import debounce from 'lodash/debounce'
import React from 'react'





// Component imports
import Key from './Key'





export default class TagsInputComponent extends React.Component {
  _bindMethods (methods) {
    methods.forEach((method) => this[method] = this[method].bind(this))
  }

  static _renderLoader () {
    return (
      <div className="loader">
        {TagsInputComponent.renderLoader()}
      </div>
    )
  }

  static _renderNoResults () {
    return (
      <div className="no-results">
        {TagsInputComponent.renderNoResults()}
      </div>
    )
  }





  addTag (tag) {
    const { onAdd } = this.props

    if (!this.state.allowDuplicates) {
      const isDuplicate = this.state.tags.findIndex((searchTag) => this.getValue(searchTag) === this.getValue(tag)) !== -1
      if (isDuplicate) {
        return false
      }
    }

    this.setState((prevState) => ({
      options: [],
      selectedOption: null,
      tags: [
        ...prevState.tags,
        tag,
      ],
    }))

    if (onAdd) {
      onAdd(tag)
    }

    this.input.value = ''

    this.log('groupCollapsed', 'adding tag')
    this.log(tag)
    this.log('groupEnd')

    return true
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.onChange && (prevState.tags !== this.state.tags)) {
      this.props.onChange(this.state.tags)
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      options,
      value,
    } = this.props
    const { loading } = this.state
    const newState = {}

    if (value !== nextProps.value) {
      let tags = nextProps.value || []

      if (!Array.isArray(tags)) {
        tags = [tags]
      }

      newState.tags = tags
    }

    if (options !== nextProps.options) {
      newState.options = nextProps.options || []

      if (!Array.isArray(newState.options)) {
        newState.options = [newState.options]
      }
    }

    if (loading !== nextProps.loading) {
      newState.loading = nextProps.loading
    }

    this.setState(newState)
  }

  componentWillUpdate (nextProps, nextState) {
    const newNextState = { ...nextState }

    if (this.state.tags !== nextState.tags) {
      newNextState.tags = nextState.tags.map((tag) => TagsInputComponent.parseOption(tag))
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      'handleOptionMouseOver',
      'onBlur',
      'onInput',
      'onKeyDown',
      'renderOption',
      'renderTag',
      'search',
      'shouldCaptureKeybind',
    ])

    this.valueProp = props.valueProp || 'value'
    this.search = debounce(this.search, props.searchDebounce || 500)

    let tags = props.value || []

    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    tags = tags.map((tag) => TagsInputComponent.parseOption(tag))

    this.state = {
      allowDuplicates: props['data-allowduplicates'],
      allowNew: props['data-allownew'],
      currentValue: '',
      loading: false,
      newFocus: true,
      options: props.options || [],
      selectedOption: null,
      selectedTag: null,
      tags,
    }
  }

  findOption (optionValue) {
    const option = typeof optionValue !== 'string' ? optionValue : { value: optionValue }
    const optionIndex = this.state.options.findIndex((searchOption) => this.getValue(option) === this.getValue(searchOption))

    if (optionIndex === -1) {
      return false
    }

    return this.state.options[optionIndex]
  }

  findTag (tagValue) {
    const tag = typeof tagValue !== 'string' ? tagValue : { value: tagValue }
    const tagIndex = this.state.tags.findIndex((searchTag) => this.getValue(tag) === this.getValue(searchTag))

    if (tagIndex === -1) {
      return false
    }

    return this.state.tags[tagIndex]
  }

  getSelectedOption () {
    if (this.state.selectedOption !== null) {
      return this.state.options[this.state.selectedOption]
    }

    return false
  }

  getValue (option) {
    let value = option

    switch (typeof this.valueProp) {
      case 'function':
        value = this.valueProp(option)
        break
      case 'string':
        for (const key of this.valueProp.split('.')) {
          value = value[key]
        }
        break
      default:
        throw new TypeError('valueProp must be either a string pointer or function.')
    }
    return value
  }

  handleDelete (event) {
    const { input } = this
    let { selectedTag } = this.state

    if ((selectedTag === null) && ((input.selectionStart + input.selectionEnd) === 0)) {
      selectedTag = this.state.tags.length - 1
    }

    if (selectedTag !== null) {
      event.preventDefault()

      this.removeTag(this.state.tags[selectedTag])

      if (this.state.tags.length && this.state.selectedTag) {
        selectedTag -= 1

        this.setState({ selectedTag })
      }
    }
  }

  handleDownArrow (event) {
    if (!this.state.options.length) {
      return
    }

    event.preventDefault()

    let { selectedOption } = this.state

    if ((selectedOption === null) || (selectedOption >= (this.state.options.length - 1))) {
      selectedOption = 0
    } else {
      selectedOption += 1
    }

    this.setState({ selectedOption })
  }

  handleLeftArrow (event) {
    const { input } = this

    if ((input.selectionStart + input.selectionEnd) !== 0) {
      return
    }

    event.preventDefault()

    let { selectedTag } = this.state

    if (selectedTag === null) {
      selectedTag = this.state.tags.length - 1
    } else if (selectedTag !== 0) {
      selectedTag -= 1
    }

    this.setState({ selectedTag })
  }

  static handleOptionMouseOut (event) {
    event.target.classList.remove('focus')
  }

  handleOptionMouseOver (event, selectedOption) {
    this.setState({ selectedOption })
    event.target.classList.add('focus')
  }

  handleReturn (event) {
    if (event.target.value) {
      event.preventDefault()
    }

    const selectedOption = this.getSelectedOption()

    if (selectedOption) {
      this.addTag(selectedOption)
    } else if (this.state.allowNew) {
      this.addTag({ value: event.target.value })
    }
  }

  handleRightArrow (event) {
    let { selectedTag } = this.state

    if (selectedTag === null) {
      return
    }

    event.preventDefault()

    if (selectedTag < (this.state.tags.length - 1)) {
      selectedTag += 1
    } else {
      selectedTag = null
    }

    this.setState({ selectedTag })
  }

  handleUpArrow (event) {
    if (!this.state.options.length) {
      return
    }

    event.preventDefault()

    let { selectedOption } = this.state

    if (!selectedOption) {
      selectedOption = this.state.options.length - 1
    } else {
      selectedOption -= 1
    }

    this.setState({ selectedOption })
  }

  log () {
    // Default to using console.log
    let type = 'log'

    if (this.props.debug) {
      // Check to see if the first argument passed is a console function. If so,
      // remove it from the arguments and use it instead of log
      if (Object.keys(console).indexOf(arguments[0]) !== -1) {
        type = [].shift.call(arguments)
      }

      /* eslint-disable no-console */
      console[type].apply(this, arguments)
      /* eslint-enable no-console */
    }
  }

  onBlur (event) {
    this.setState({ newFocus: true })
    event.target.parentNode.classList.remove('focus')
  }

  static onFocus (event) {
    event.target.parentNode.classList.add('focus')
  }

  onInput (event) {
    this.setState({ selectedTag: null })

    this.search(event.target.value)
  }

  onKeyDown (event) {
    switch (event.which) {
      case 9: // tab
      case 13: // enter
      case 188: // comma
        this.handleReturn(event)
        break

      case 8: // backspace
      case 46: // delete
        this.handleDelete(event)
        break

      case 37: // left arrow
        this.handleLeftArrow(event)
        break

      case 39: // right arrow
        this.handleRightArrow(event)
        break

      case 38: // up arrow
        this.handleUpArrow(event)
        break

      case 40: // down arrow
        this.handleDownArrow(event)
        break

      default: // literally anything else
        if (event.target.value !== this.state.currentValue) {
          this.setState({ currentValue: event.target.value })
        }
    }
  }

  static parseOption (optionValue) {
    return typeof optionValue !== 'string' ? optionValue : { value: optionValue }
  }

  removeTag = (tag) => this.setState((state) => {
    const tags = [...state.tags]

    tags.splice(tags.indexOf(tag), 1)

    return { tags }
  }, () => {
    const { onRemove } = this.props

    if (onRemove) {
      onRemove(tag)
    }

    this.log('groupCollapsed', 'removing tag')
    this.log('value:', tag)
    this.log('groupEnd')
  })

  render () {
    const {
      'aria-label': ariaLabel,
      className,
      name,
      placeholder,
    } = this.props
    const {
      allowNew,
      currentValue,
      loading,
      newFocus,
      options,
      tags,
    } = this.state
    let classes = ['tags-input']

    if (tags.length) {
      classes.push('has-tags')
    }

    if (className) {
      classes = classes.concat(className)
    }

    const divProps = { ...this.props }

    delete divProps.onAdd
    delete divProps.onChange
    delete divProps.onRemove
    delete divProps.options
    delete divProps.valueProp
    delete divProps.placeholder

    return (
      <div {...divProps} className={classes.join(' ')}>
        <ul className="tags">{this.renderTags()}</ul>

        <input
          aria-label={ariaLabel}
          autoComplete="off"
          name={name}
          onBlur={this.onBlur}
          onFocus={TagsInputComponent.onFocus}
          onInput={this.onInput}
          onKeyDown={this.onKeyDown}
          placeholder={placeholder}
          ref={(input) => this.input = input}
          type="search" />

        {Boolean(allowNew) && this.renderReturnPrompt()}

        {loading && TagsInputComponent._renderLoader()}

        {(!loading && !newFocus && Boolean(currentValue) && !options.length) && TagsInputComponent._renderNoResults()}

        {(!loading && Boolean(options.length)) && (
          <ol className="options">
            {this.renderOptions()}
          </ol>
        )}
      </div>
    )
  }

  static renderLoader () {
    return (
      <span>Loading...</span>
    )
  }

  static renderNoResults () {
    return (
      <span>No results</span>
    )
  }

  renderOption (option, index) {
    const { selectedOption } = this.state

    const classes = ['option']

    if (selectedOption === index) {
      classes.push('focus')
    }

    return (
      <li
        className={classes.join(' ')}
        key={index}
        onBlur={TagsInputComponent.handleOptionMouseOut}
        onFocus={(event) => this.handleOptionMouseOver(event, index)}
        onMouseDown={() => this.addTag(option)}
        onMouseOut={TagsInputComponent.handleOptionMouseOut}
        onMouseOver={(event) => this.handleOptionMouseOver(event, index)}>
        {this.renderValue(option)}
      </li>
    )
  }

  renderOptions () {
    const { options } = this.state

    return (
      <ol className="options">
        {options.map(this.renderOption)}
      </ol>
    )
  }

  renderReturnPrompt () {
    const classes = ['return-prompt']

    if (this.input && this.input.value) {
      classes.push('show')
    }

    return (
      <div className={classes.join(' ')}>
        <span>Press <Key>Return</Key> to add</span>
      </div>
    )
  }

  renderTag (tag, index) {
    const { selectedTag } = this.state

    const classes = ['tag']

    if (selectedTag === index) {
      classes.push('focus')
    }

    return (
      <li className={classes.join(' ')} key={index}>
        {this.renderValue(tag)}

        <button
          onClick={() => this.removeTag(tag)}
          type="button">
          &times;
        </button>
      </li>
    )
  }

  renderTags () {
    const { tags } = this.state

    return tags.map(this.renderTag)
  }

  renderValue (original) {
    return this.getValue(original)
  }

  search (query) {
    if (query) {
      this.log('groupCollapsed', 'search')
      this.log(query ? `query:${query}` : 'no query')
      this.log('groupEnd')
    }
  }

  shouldCaptureKeybind () {
    const { input } = this

    if (!input.selectionStart && !input.selectionEnd) {
      return true
    }

    return false
  }

  updateOptions (options, merge = false) {
    const newState = {
      loading: false,
      newFocus: false,
      options: [...this.state.options],
    }

    if (!merge) {
      newState.options = []
      newState.selectedOption = null
    }

    options.forEach((optionValue) => {
      const option = TagsInputComponent.parseOption(optionValue)

      if (merge && this.findOption(option)) {
        return
      }

      if (!this.props.allowDuplicates && this.findTag(option)) {
        return
      }

      newState.options.push(option)
    })

    this.setState(newState)

    this.log('groupCollapsed', 'updating options')
    this.log('options:', options)
    this.log('groupEnd')
  }





  static get idProp () {
    return 'id'
  }
}
