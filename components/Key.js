import React from 'react'





export default class Key extends React.Component {
  render () {
    let { children } = this.props
    let key = children

    switch (key.toLowerCase()) {
      case 'alt':
      case 'option':
        key = `⌥ Opt`
        break

      case 'backspace':
      case 'delete':
        key = `⌫ Del`
        break

      case 'command':
      case 'meta':
      case 'super':
        key = `⌘ Cmd`
        break

      case 'control':
        key = `Ctrl`
        break

      case 'enter':
      case 'return':
        key = `${key} ⏎`
        break

      case 'shift':
        key = `⇧ ${key}`
        break

      case 'plus':
        key = `+`
        break

      case 'minus':
        key = `-`
        break

      default:
        key = key.toUpperCase()
    }

    return (
      <kbd>
        {key}
      </kbd>
    )
  }
}
