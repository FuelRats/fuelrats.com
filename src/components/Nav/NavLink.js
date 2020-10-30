/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- links are interactable, but eslint cannot statically check it here. */
import Link from 'next/link'




export default function NavLink (props) {
  const {
    children,
    className,
    disabled,
    external,
    onClick,
    ...restProps
  } = props

  return (
    <li>
      {
        external
          ? (
            <a {...restProps} className={[className, { disabled }]} onClick={onClick}>
              <span>
                {children}
              </span>
            </a>
          )
          : (
            <Link {...restProps}>
              <a className={[className, { disabled }]} onClick={onClick}>
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
