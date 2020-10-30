/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- links are interactable, but eslint cannot statically check it here. */
import Link from 'next/link'
import { useCallback } from 'react'

import { useNavContext } from './Nav'





export default function NavLink (props) {
  const {
    children,
    className,
    disabled,
    external,
    onClick,
    ...restProps
  } = props

  const { globalClick } = useNavContext() ?? {}

  const handleClick = useCallback(() => {
    onClick?.()
    globalClick?.()
  }, [globalClick, onClick])

  return (
    <li>
      {
        external
          ? (
            <a {...restProps} className={[className, { disabled }]} onClick={handleClick}>
              <span>
                {children}
              </span>
            </a>
          )
          : (
            <Link {...restProps}>
              <a className={[className, { disabled }]} onClick={handleClick}>
                <span>
                  {children}
                </span>
              </a>
            </Link>
          )
      }
    </li>
  )
}
