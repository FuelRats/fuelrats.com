import Link from 'next/link'




export default function NavItem (props) {
  const {
    children,
    className,
    disabled,
    external,
    ...restProps
  } = props

  return (
    <li>
      {
        external
          ? (
            <a {...restProps} className={[className, { disabled }]}>
              <span>
                {children}
              </span>
            </a>
          )
          : (
            <Link {...restProps}>
              <a className={[className, { disabled }]}>
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
