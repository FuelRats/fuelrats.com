// Module imports
import PropTypes from 'prop-types'
import React from 'react'




// Component imports
import RadioInputOption from './RadioInputOption'





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

    return (
      <Element className={['radio-input', { disabled }, className]}>
        {
          options.map((option) => {
            return (
              <OptionElement
                {...option}
                key={option.value}
                checked={option.value === value ?? option.checked}
                disabled={disabled ?? option.disabled}
                name={name}
                onChange={this._handleOptionClick} />
            )
          })
        }
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
