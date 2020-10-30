export default function NavSection (props) {
  const {
    title,
    children,
  } = props

  return (
    <li>
      {
        title && (
          <header>
            {title}
          </header>
        )
      }
      <ul>
        {children}
      </ul>
    </li>
  )
}
