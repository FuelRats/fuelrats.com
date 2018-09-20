// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





export default ({ status }) => {
  const isFulfilled = status === 'fulfilled'
  const isPaid = ['canceled', 'fulfilled', 'paid', 'returned'].includes(status)
  const isReturned = status === 'returned'
  const isCanceled = status === 'canceled'

  return (
    <span
      alt={status}
      className="order-status-indicator"
      role="img"
      title={status}>
      <FontAwesomeIcon
        icon="shopping-cart"
        className="text-success" />

      <FontAwesomeIcon
        icon="arrow-right"
        className="text-muted" />

      {(!isReturned && !isCanceled) && (
        <>
          <FontAwesomeIcon
            icon="money-bill"
            className={isPaid ? 'text-success' : 'text-muted'} />

          <FontAwesomeIcon
            icon="arrow-right"
            className="text-muted" />

          <FontAwesomeIcon
            icon="truck"
            className={isFulfilled ? 'text-success' : 'text-muted'} />
        </>
      )}

      {isReturned && (
        <FontAwesomeIcon
          icon="undo"
          className="text-danger" />
      )}

      {isCanceled && (
        <FontAwesomeIcon
          icon="times-circle"
          className="text-danger" />
      )}
    </span>
  )
}
