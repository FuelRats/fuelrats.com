export default function SubNav (props) {
  const {
    children,
    openNav,
    onClick,
    title,
  } = props

  const id = `SubNav-${props.id ?? props.title}`

  return (
    <li>
      <input
        aria-hidden
        hidden
        checked={openNav === id}
        className="subnav-toggle"
        id={id}
        name="subnav"
        type="checkbox"
        onClick={onClick} />
      <label htmlFor={id}>
        <span>
          {title}
        </span>
      </label>
      <ul className="subnav">
        {children}
      </ul>
    </li>
  )
}
