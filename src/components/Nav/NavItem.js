import { Link } from '~/routes'

export default function NavItem ({ children, className, ...restProps }) {
  return (
    <li>
      <Link {...restProps}>
        <a className={className}>
          <span>
            {children}
          </span>
        </a>
      </Link>
    </li>
  )
}
