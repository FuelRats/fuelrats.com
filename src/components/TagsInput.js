// Complete rewrite pending. We will ignore these errors for now.
/* eslint-disable
    no-magic-numbers,
    no-negated-condition,
    no-restricted-syntax,
    no-return-assign,
    react/jsx-no-bind,
    react/no-unsafe,
    react/state-in-constructor,
    arrow-body-style,
*/

import debounce from 'lodash/debounce'
import React from 'react'

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
    const { onAdd, onChange } = this.props

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
    }), () => {
      if (onAdd) {
        onAdd(tag)
      }

      if (onChange) {
        onChange(this.state.tags)
      }
    })

    this.input.value = ''

    return true
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
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

  UNSAFE_componentWillUpdate (nextProps, nextState) {
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
    const { onChange, onRemove } = this.props

    if (onRemove) {
      onRemove(tag)
    }

    if (onChange) {
      onChange(this.state.tags)
    }
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

    const divProps = { ...this.props }

    delete divProps.onAdd
    delete divProps.onChange
    delete divProps.onRemove
    delete divProps.options
    delete divProps.valueProp
    delete divProps.placeholder

    return (
      <div {...divProps} className={['tags-input', { 'has-tags': tags.length > 0 }, className]}>
        <ul className="tags">{this.renderTags()}</ul>

        <input
          ref={(input) => this.input = input}
          aria-label={ariaLabel}
          autoComplete="off"
          disabled={this.props.disabled}
          name={name}
          placeholder={placeholder}
          type="search"
          onBlur={this.onBlur}
          onFocus={TagsInputComponent.onFocus}
          onInput={this.onInput}
          onKeyDown={this.onKeyDown} />

        {Boolean(allowNew) && this.renderReturnPrompt()}

        {loading && TagsInputComponent._renderLoader()}

        {(!loading && !newFocus && Boolean(currentValue) && !options.length) && TagsInputComponent._renderNoResults()}

        {
          (!loading && Boolean(options.length)) && (
            <ol className="options">
              {this.renderOptions()}
            </ol>
          )
        }
      </div>
    )
  }

  static renderLoader () {
    return (
      <span>{'Loading...'}</span>
    )
  }

  static renderNoResults () {
    return (
      <span>{'No results'}</span>
    )
  }

  renderOption (option, index) {
    const { selectedOption } = this.state

    return (
      <li
        key={index}
        className={['option', { focus: selectedOption === index }]}
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
    return (
      <div className={['return-prompt', { show: this.input && this.input.value }]}>
        <span>{'Press '}<Key>{'Return'}</Key>{' to add'}</span>
      </div>
    )
  }

  renderTag (tag, index) {
    const { selectedTag } = this.state

    return (
      <li key={index} className={['tag', { focus: selectedTag === index }]}>
        {this.renderValue(tag)}

        <button
          type="button"
          onClick={() => this.removeTag(tag)}>
          {'\u00d7'}
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

  search () {
    /* To be implemented by extending classes. we just silently return here. */
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
  }





  static get idProp () {
    return 'id'
  }
}
