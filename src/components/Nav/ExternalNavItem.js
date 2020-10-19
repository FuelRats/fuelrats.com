export default function ExternalNavItem ({ children, ...restProps }) {
  return (
    <a {...restProps}>
      <span>
        {children}
      </span>
    </a>
  )
}
