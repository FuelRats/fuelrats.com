import React from 'react'

function Svg (props) {
  const {
    path,
    pathProps,
    ...svgProps
  } = props

  return (
    <svg {...svgProps}>
      {
        Array.isArray(path)
          ? (path.map((pathPart, index) => {
            return (
              <path
                fill="currentColor"
                {...(Array.isArray(pathProps) ? pathProps[index] : pathProps)}
                key={pathPart}
                d={pathPart} />
            )
          })) : (
            <path fill="currentColor" {...pathProps} d={path} />
          )
      }
    </svg>
  )
}

export default Svg
