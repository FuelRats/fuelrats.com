// Module imports
import React from 'react'





// Component imports
import Component from './Component'
import classNames from '../helpers/classNames'





const getDefaultOptionProps = () => ({
  className: null,
  disabled: false,
  value: null,
  key: '',
})





class RadioCardInput extends Component {
  UNSAFE_componentWillReceiveProps (nextProps) {
    const currentValue = nextProps.value || (this.state.selectedOption ? this.state.selectedOption.key : null) || nextProps.defaultValue || null
    const options = nextProps.options.map((option) => ({ ...getDefaultOptionProps(), ...option }))

    const selectedOption = options.find((option) => option.key === currentValue)

    this.setState({
      options,
      selectedOption,
    })
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      'getCurrentValue',
      'handleOptionMouseDown',
      'renderOptions',
      'renderOption',
    ])

    const currentValue = this.props.value || this.props.defaultValue

    const options = this.props.options.map((option) => ({ ...getDefaultOptionProps(), ...option }))

    let selectedOption = options.find((option) => option.key === currentValue && !option.disabled)
    if (!selectedOption) {
      selectedOption = options.find((option) => !option.disabled)
    }

    if (selectedOption && selectedOption.key !== currentValue) {
      this.props.onChange({
        ...selectedOption,
        name: this.props.name,
      })
    }

    this.state = {
      options,
      selectedOption,
    }
  }

  getCurrentValue () {
    return this.props.value || (this.state.selectedOption ? this.state.selectedOption.key : null) || this.props.defaultValue || null
  }

  handleOptionMouseDown (option) {
    if (!this.props.disabled && !option.disabled && this.getCurrentValue() !== option.key) {
      if (!this.props.value) {
        this.setState({ selectedOption: option })
      }

      if (this.props.onChange) {
        const { name } = this.props
        this.props.onChange({
          ...option,
          name,
        })
      }
    }
  }

  render () {
    const {
      className,
      disabled,
    } = this.props

    const {
      options,
    } = this.state

    const classes = classNames(
      'radio-card-input',
      className,
      ['disabled', disabled]
    )

    const divProps = { ...this.props }

    delete divProps.className
    delete divProps.onChange
    delete divProps.options
    delete divProps.value

    return (
      <div {...divProps} className={classes}>
        <ul className="options">{this.renderOptions(options)}</ul>
      </div>
    )
  }

  renderOption (option) {
    const {
      children,
    } = this.props

    const {
      className,
      disabled,
      key,
    } = option

    if (!key || typeof key !== 'string') {
      throw new Error('key must be a string.')
    }

    const classes = classNames(
      'radio-card',
      className,
      ['disabled', disabled],
      ['selected', !disabled && this.getCurrentValue() === key]
    )

    const liParams = { ...option }

    delete liParams.className
    delete liParams.disabled
    delete liParams.value
    delete liParams.key

    return (
      <li
        {...liParams}
        className={classes}
        key={key}
        name={key}
        onMouseDown={() => this.handleOptionMouseDown(option)}>
        <div className="card-content">
          {children(option)}
        </div>
      </li>
    )
  }

  renderOptions (options) {
    return options.map(this.renderOption)
  }
}


export default RadioCardInput
