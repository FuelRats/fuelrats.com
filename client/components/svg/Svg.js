import React from 'react'

const Svg = (props) => {
  const {
    path,
    pathProps,
    ...svgProps
  } = props

  return (
    <svg {...svgProps}>
      <path fill="currentColor" {...pathProps} d={path} />
    </svg>
  )
}

export default Svg
