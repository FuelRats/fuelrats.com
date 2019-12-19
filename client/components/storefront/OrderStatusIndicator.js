// Module imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'





const OrderStatusIndicator = ({ status }) => {
  const isFulfilled = status === 'fulfilled'
  const isPaid = ['canceled', 'fulfilled', 'paid', 'returned'].includes(status)
  const isReturned = status === 'returned'
  const isCanceled = status === 'canceled'

  return (
    <span
      alt={status}
      className="order-status-indicator"
      role="img">
      <FontAwesomeIcon
        icon="shopping-cart"
        size="lg"
        className="text-success"
        title="created" />

      <FontAwesomeIcon
        icon="arrow-right"
        className="text-muted" />

      {(!isReturned && !isCanceled) && (
        <>
          <FontAwesomeIcon
            icon="money-bill"
            size="lg"
            className={isPaid ? 'text-success' : 'text-muted'}
            title="paid" />

          <FontAwesomeIcon
            icon="arrow-right"
            className="text-muted" />

          <FontAwesomeIcon
            icon="truck"
            size="lg"
            className={isFulfilled ? 'text-success' : 'text-muted'}
            title="fulfilled" />
        </>
      )}

      {isReturned && (
        <FontAwesomeIcon
          icon="undo"
          size="lg"
          className="text-danger"
          title="returned" />
      )}

      {isCanceled && (
        <FontAwesomeIcon
          icon="times-circle"
          size="lg"
          className="text-danger"
          title="cancelled" />
      )}
    </span>
  )
}





export default OrderStatusIndicator
