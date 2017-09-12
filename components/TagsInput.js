import {
  debounce,
} from 'lodash'
import React from 'react'





export default class extends React.Component {
  _bindMethods (methods) {
    methods.forEach(method => this[method] = this[method].bind(this))
  }

  _renderLoader () {
    return (
      <div className="loader">
        {this.renderLoader()}
      </div>
    )
  }





  addTag (tag) {
    let {
      allowDuplicates,
      onAdd,
    } = this.props
    let tags = Object.assign([], this.state.tags)

    if (!allowDuplicates) {
      let duplicateIndex = tags.findIndex(searchTag => {
        return this.getValue(searchTag) === this.getValue(tag)
      })

      if (duplicateIndex !== -1) {
        return false
      }
    }

    tags.push(tag)

    this.setState({
      options: [],
      selectedOption: null,
      tags,
    })

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
    let {
      options,
      value,
    } = this.props
    let newState = {}

    if (value !== nextProps.value) {
      let tags = nextProps.value || []

      if (!Array.isArray(tags)) {
        tags = [tags]
      }

      newState.tags = tags
    }

    if (options !== nextProps.options) {
      let options = nextProps.options || []

      if (!Array.isArray(options)) {
        options = [options]
      }

      newState.options = options
    }

    if (loading !== nextProps.loading) {
      newState.loading = nextProps.loading
    }

    this.setState(newState)
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.state.tags !== nextState.tags) {
      nextState.tags = nextState.tags.map(tag => this.parseOption(tag))
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      'handleOptionMouseOut',
      'handleOptionMouseOver',
      'onBlur',
      'onFocus',
      'onInput',
      'onKeyDown',
      'renderOption',
      'renderTag',
      'search',
      'shouldCaptureKeybind',
    ])

    this.search = debounce(this.search, props.searchDebounce || 500)

    let tags = props.value || []

    if (!Array.isArray(tags)) {
      tags = [tags]
    }

    tags = tags.map(tag => this.parseOption(tag))

    this.state = {
      allowDuplicates: props.allowDuplicates,
      allowMultiple: props.allowMultiple,
      allowNew: props.allowNew,
      currentValue: '',
      debug: props.debug,
      focused: false,
      loading: false,
      options: props.options || [],
      selectedOption: null,
      selectedTag: null,
      tags,
    }
  }

  findOption (option) {
    if (typeof option === 'string') {
      option = {
        value: option
      }
    }

    let optionIndex = this.state.options.findIndex(searchOption => this.getValue(option) === this.getValue(searchOption))

    if (optionIndex === -1) {
      return false
    }

    return this.state.options[optionIndex]
  }

  findTag (tag) {
    if (typeof tag === 'string') {
      tag = {
        value: tag
      }
    }

    let tagIndex = this.state.tags.findIndex(searchTag => this.getValue(tag) === this.getValue(searchTag))

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

    for (let key of this.valueProp.split('.')) {
      value = value[key]
    }

    return value
  }

  handleDelete (event) {
    let input = this.input
    let selectedTag = this.state.selectedTag

    if ((selectedTag === null) && ((input.selectionStart + input.selectionEnd) === 0)) {
      selectedTag = this.state.tags.length - 1
    }

    if (selectedTag !== null) {
      event.preventDefault()

      this.removeTag(this.state.tags[selectedTag])

      if (this.state.tags.length && this.state.selectedTag) {
        selectedTag = selectedTag - 1

        this.setState({ selectedTag })
      }
    }
  }

  handleDownArrow (event) {
    if (!this.state.options.length) {
      return
    }

    event.preventDefault()

    let selectedOption = this.state.selectedOption

    if ((selectedOption === null) || (selectedOption >= (this.state.options.length - 1))) {
      selectedOption = 0

    } else {
      selectedOption = selectedOption + 1
    }

    this.setState({ selectedOption })
  }

  handleLeftArrow (event) {
    let input = this.input

    if ((input.selectionStart + input.selectionEnd) !== 0) {
      return
    }

    event.preventDefault()

    let selectedTag = this.state.selectedTag

    if (selectedTag === null) {
      selectedTag = this.state.tags.length - 1

    } else if (selectedTag !== 0) {
      selectedTag = selectedTag - 1
    }

    this.setState({ selectedTag })
  }

  handleOptionMouseOut (event) {
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

    let selectedOption = this.getSelectedOption()

    if (selectedOption) {
      this.addTag(selectedOption)

    } else if (this.state.allowNew) {
      this.addTag({
        value: event.target.value
      })
    }
  }

  handleRightArrow (event) {
    let selectedTag = this.state.selectedTag

    if (selectedTag === null) {
      return
    }

    event.preventDefault()

    if (selectedTag < (this.state.tags.length - 1)) {
      selectedTag = selectedTag + 1

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

    let selectedOption = this.state.selectedOption

    if (!selectedOption) {
      selectedOption = this.state.options.length - 1

    } else {
      selectedOption = selectedOption - 1
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

      console[type].apply(this, arguments)
    }
  }

  onBlur (event) {
    event.target.parentNode.classList.remove('focus')
  }

  onFocus (event) {
    event.target.parentNode.classList.add('focus')
  }

  onInput (event) {
    this.setState({
      selectedTag: null
    })

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
          this.setState({
            currentValue: event.target.value
          })
        }
    }
  }

  parseOption (option) {
    if (typeof option === 'string') {
      option = {
        value: option
      }
    }

    return option
  }

  removeTag (tag) {
    let tags = Object.assign([], this.state.tags)

    tags.splice(tags.indexOf(tag), 1)

    this.setState({ tags })

    if (this.onRemove) {
      this.onRemove(tag)
    }

    this.log('groupCollapsed', 'removing tag')
    this.log('value:', tag)
    this.log('groupEnd')
  }

  render () {
    let {
      className,
      name,
    } = this.props
    let {
      loading,
    } = this.state
    let classes = ['tags-input']

    if (className) {
      classes = classes.concat(className)
    }

    let divProps = Object.assign({}, this.props)

    delete divProps.onAdd
    delete divProps.onChange
    delete divProps.onRemove
    delete divProps.options

    return (
      <div {...divProps} className={classes.join(' ')}>
        <ul className="tags">{this.renderTags()}</ul>

        <input
          autoComplete={false}
          name={name}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onInput={this.onInput}
          onKeyDown={this.onKeyDown}
          ref={input => this.input = input}
          type="search" />

        {loading && this._renderLoader()}

        {!loading && (
          <ol className="options">
            {this.renderOptions()}
          </ol>
        )}
      </div>
    )
  }

  renderLoader () {
    return (
      <span className="loading">Loading...</span>
    )
  }

  renderOption (option, index) {
    let {
      selectedOption,
    } = this.state

    let classes = ['option']

    if (selectedOption === index) {
      classes.push('focus')
    }

    return (
      <li
        className={classes.join(' ')}
        key={index}
        onMouseDown={() => this.addTag(option)}
        onMouseOut={this.handleOptionMouseOut}
        onMouseOver={event => this.handleOptionMouseOver(event, index)}>
        {this.renderValue(option)}
      </li>
    )
  }

  renderOptions () {
    let {
      options,
    } = this.state

    return options.map(this.renderOption)
  }

  renderTag (tag, index) {
    let {
      selectedTag,
    } = this.state

    let classes = ['tag']

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
    let {
      tags,
    } = this.state

    return tags.map(this.renderTag)
  }

  renderValue (original) {
    return this.getValue(original)
  }

  search (query) {
    if (query) {
      this.log('groupCollapsed', 'search')
      this.log(query ? ('query:' + query) : 'no query')
      this.log('groupEnd')
    }
  }

  shouldCaptureKeybind () {
    let input = this.input

    if (!input.selectionStart && !input.selectionEnd) {
      return true
    }

    return false
  }

  updateOptions (options, merge = false) {
    let newState = {
      loading: false,
      options: Object.assign([], this.state.options),
    }

    if (!merge) {
      newState.options = []
      newState.selectedOption = null
    }

    options.forEach(option => {
      option = this.parseOption(option)

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





  get idProp () {
    return 'id'
  }

  get valueProp () {
    return 'value'
  }
}
