import Link from 'next/link'





function NavItem ({ item, ...linkProps }) {
  const {
    onClick,
    className,
    href,
    title,
  } = item

  return (
    <li className={className}>
      <Link href={href}>
        <a {...linkProps} {...(onClick ? { href: '#', onClick } : {})}>
          <span>{title}</span>
        </a>
      </Link>
    </li>
  )
}





export default NavItem
