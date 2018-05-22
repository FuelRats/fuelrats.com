import React from 'react'

const Svg = props => {
  const {
    path,
    ...svgProps
  } = props

  return (
    <svg {...svgProps}>
      <path fill="currentColor" d={path} />
    </svg>
  )
}

export default Svg
