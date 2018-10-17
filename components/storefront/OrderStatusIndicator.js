// Module imports
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





const OrderStatusIndicator = ({ status }) => {
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
        size="lg"
        className="text-success" />

      <FontAwesomeIcon
        icon="arrow-right"
        className="text-muted" />

      {(!isReturned && !isCanceled) && (
        <>
          <FontAwesomeIcon
            icon="money-bill"
            size="lg"
            className={isPaid ? 'text-success' : 'text-muted'} />

          <FontAwesomeIcon
            icon="arrow-right"
            className="text-muted" />

          <FontAwesomeIcon
            icon="truck"
            size="lg"
            className={isFulfilled ? 'text-success' : 'text-muted'} />
        </>
      )}

      {isReturned && (
        <FontAwesomeIcon
          icon="undo"
          size="lg"
          className="text-danger" />
      )}

      {isCanceled && (
        <FontAwesomeIcon
          icon="times-circle"
          size="lg"
          className="text-danger" />
      )}
    </span>
  )
}





export default OrderStatusIndicator
