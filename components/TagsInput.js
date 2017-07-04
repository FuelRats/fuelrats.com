import React from 'react'





export default class extends React.Component {
  _bindMethods (methods) {
    methods.forEach(method => this[method] = this[method].bind(this))
  }





  addTag (tag) {
    let tags = this.state.tags

    if (!this.props.allowDuplicates) {
      let duplicateIndex = tags.findIndex(searchTag => {
        return searchTag.value === tag.value
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

    if (this.props.onAdd) {
      this.props.onAdd(tag)
    }

    return true

    this.log('groupCollapsed', 'adding tag')
    this.log(tag)
    this.log('groupEnd')
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.onChange && (prevState.tags !== this.state.tags)) {
      this.props.onChange(this.state.tags)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      let tags = nextProps.value || []

      if (!Array.isArray(tags)) {
        tags = [tags]
      }

      this.setState({ tags })
    }
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
      'shouldCaptureKeybind',
    ])

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
      options: [],
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

    let optionIndex = this.state.options.findIndex(searchOption => option.value === searchOption.value)

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

    let tagIndex = this.state.tags.findIndex(searchTag => tag.value === searchTag.value)

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
    let successfullyAddedTag

    if (selectedOption) {
      successfullyAddedTag = this.addTag(selectedOption)

    } else if (this.state.allowNew) {
      successfullyAddedTag = this.addTag({
        value: event.target.value
      })
    }

    if (successfullyAddedTag) {
      event.target.value = ''
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
        this.setState({
          currentValue: event.target.value
        })
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
    let classes = ['tags-input']
    let options = this.renderOptions()
    let tags = this.renderTags()

    if (this.props.className) {
      classes = classes.concat(this.props.className)
    }

    let divProps = Object.assign({}, this.props)

    delete divProps.onAdd
    delete divProps.onChange
    delete divProps.onRemove

    return (
      <div {...divProps} className={classes.join(' ')}>
        <ul className="tags">{tags}</ul>

        <input
          name={this.props.name}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onInput={this.onInput}
          onKeyDown={this.onKeyDown}
          ref={input => this.input = input}
          type="search" />

        <ol className="options">{options}</ol>
      </div>
    )
  }

  renderOptions () {
    return this.state.options.map((option, index) => {
      let classes = ['option']

      if (this.state.selectedOption === index) {
        classes.push('focus')
      }

      return (
        <li
          className={classes.join(' ')}
          key={index}
          onMouseDown={() => this.addTag(option)}
          onMouseOut={this.handleOptionMouseOut}
          onMouseOver={event => this.handleOptionMouseOver(event, index)}>
          {option.value}
        </li>
      )
    })
  }

  renderTags () {
    return this.state.tags.map((tag, index) => {
      let classes = ['tag']

      if (this.state.selectedTag === index) {
        classes.push('focus')
      }

      return (
        <li className={classes.join(' ')} key={index}>
          <span>{tag.value}</span>

          <button onClick={() => this.removeTag(tag)}>
            &times;
          </button>
        </li>
      )
    })
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
      options: Object.assign([], this.state.options)
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
}
