// Module imports
import React from 'react'





// Component imports
import Component from './Component'
import classNames from '../helpers/classNames'





const getDefaultOptionProps = () => ({
  className: 'option',
  disabled: false,
  displayValue: null,
  show: true,
  value: null,
})





export default class RadioOptionsInput extends Component {
  UNSAFE_componentWillReceiveProps (nextProps) {
    const options = nextProps.options.map((option) => ({ ...getDefaultOptionProps(), ...option }))

    this.setState((state) => ({
      options,
      selectedOption: options.find((option) => option.value === nextProps.value) || state.selectedOption,
    }))
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

    let selectedOption = options.filter((option) => option.value === currentValue)

    if (selectedOption.length > 0) {
      [selectedOption] = selectedOption
    }

    this.state = {
      options,
      selectedOption,
    }
  }

  getCurrentValue () {
    return this.props.value || (this.state.selectedOption ? this.state.selectedOption.value : null) || this.props.defaultValue || null
  }

  handleOptionMouseDown (option) {
    if (!this.props.disabled && !option.disabled && this.getCurrentValue() !== option.value) {
      this.setState({ selectedOption: option })

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
      'radio-input',
      className,
      ['disabled', disabled]
    )

    const divProps = { ...this.props }

    delete divProps.className
    delete divProps.onChange
    delete divProps.options

    return (
      <div {...divProps} className={classes}>
        <ul className="options">{this.renderOptions(options)}</ul>
      </div>
    )
  }

  renderOption (option, index) {
    const {
      className,
      disabled,
      value,
      displayValue,
      show,
    } = option

    if (!value || typeof value !== 'string') {
      throw new Error('Value must be a string.')
    }

    const classes = classNames(
      'option',
      className,
      `${className}-${value}`,
      ['disabled', disabled],
      ['selected', !disabled && this.getCurrentValue() === value]
    )

    const liParams = { ...option }

    delete liParams.className
    delete liParams.disabled
    delete liParams.value
    delete liParams.displayValue
    delete liParams.show

    return show && (
      <li
        {...liParams}
        className={classes}
        key={index}
        name={value}
        onMouseDown={() => this.handleOptionMouseDown(option)}>
        <div className="option-content">
          {displayValue || value}
        </div>
      </li>
    )
  }

  renderOptions (options) {
    return options.map(this.renderOption)
  }
}
