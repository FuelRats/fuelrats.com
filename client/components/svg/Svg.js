import React from 'react'

const Svg = (props) => {
  const {
    path,
    pathProps,
    ...svgProps
  } = props

  return (
    <svg {...svgProps}>
      {
        Array.isArray(path)
          ? (path.map((pathPart, index) => (
            <path
              fill="currentColor"
              {...(Array.isArray(pathProps) ? pathProps[index] : pathProps)}
              d={pathPart}
              key={pathPart} />
          ))) : (
            <path fill="currentColor" {...pathProps} d={path} />
          )
      }
    </svg>
  )
}

export default Svg
