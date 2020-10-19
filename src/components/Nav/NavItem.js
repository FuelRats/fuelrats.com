import { Link } from '~/routes'

export default function NavItem (props) {
  const {
    as: Element = Link,
    children,
    ...linkProps
  } = props

  return (
    <li>
      <span>
        <Element {...linkProps}>{children}</Element>
      </span>
    </li>
  )
}
