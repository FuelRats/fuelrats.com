import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import PropTypes from 'prop-types'




function Breadcrumbs ({ items }) {
  if (!items?.length) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {
          items.map((item, index) => {
            return (
              <li key={item.label}>
                {
                  item.href
                    ? (<Link href={item.href}>{item.label}</Link>)
                    : (<span>{item.label}</span>)
                }
                {
                  index < items.length - 1 && (
                    <FontAwesomeIcon
                      aria-hidden
                      fixedWidth
                      className="breadcrumb-separator"
                      icon="chevron-right" />
                  )
                }
              </li>
            )
          })
        }
      </ol>
    </nav>
  )
}

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    label: PropTypes.string.isRequired,
  })).isRequired,
}




export default Breadcrumbs
