function CarrierIcon ({ className, title, size = '1em', style }) {
  return (
    <svg
      aria-hidden={!title}
      className={className}
      fill="currentColor"
      height={size}
      role={title ? 'img' : undefined}
      style={{ display: 'inline-block', verticalAlign: '-0.125em', ...style }}
      viewBox="0 0 100 100"
      width={size}
      xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      <path d="M50 6 C52 6 54 7 55 9 L93 68 C95 71 95 75 93 78 L90 82 C88 85 85 86 82 86 L68 86 C64 86 60 84 58 80 L54 74 C52 71 48 71 46 74 L42 80 C40 84 36 86 32 86 L18 86 C15 86 12 85 10 82 L7 78 C5 75 5 71 7 68 L45 9 C46 7 48 6 50 6 Z" />
      <circle cx="50" cy="54" r="15" opacity="0.25" />
      <rect height="4" opacity="0.35" rx="2" width="14" x="43" y="52" />
    </svg>
  )
}

export default CarrierIcon
