// Module imports
import React from 'react'





export default class Component extends React.Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _bindMethods (methods) {
    methods.forEach((method) => {
      this[method] = this[method].bind(this)
    })
  }
}
