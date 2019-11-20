// Module imports
import React from 'react'
import PropTypes from 'prop-types'




// Component imports
import classNames from '../../helpers/classNames'
import RadioInputOption from './RadioInputOption'




// Component Constants





class RadioInput extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleOptionClick = ({ target }) => {
    const { value, onChange } = this.props

    if (value !== target.value) {
      onChange({ target })
    }
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const {
      as: Element,
      className,
      disabled,
      name,
      options,
      OptionElement,
      value,
    } = this.props

    const classes = classNames(
      'radio-input',
      className,
      ['disabled', disabled],
    )

    return (
      <Element className={classes}>
        {options.map((option) => (
          <OptionElement
            key={option.value}
            option={option}
            onChange={this._handleOptionClick}
            name={name}
            checked={option.value === value} />
        ))}
      </Element>
    )
  }





  /***************************************************************************\
    Prop Definitions
  \***************************************************************************/

  static defaultProps = {
    as: 'div',
    OptionElement: RadioInputOption,
  }


  static propTypes = {
    as: PropTypes.elementType,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    OptionElement: PropTypes.elementType,
    options: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
  }
}





export default RadioInput
