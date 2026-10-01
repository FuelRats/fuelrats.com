import PropTypes from 'prop-types'

import formatQuoteTime from '~/util/date/formatQuoteTime'

import Refresher from './Refresher'

function formatElapsedTimer (from) {
  const [text, next] = formatQuoteTime(from)
  return [text, next]
}

function QuoteTimer (props) {
  const {
    as: Element = 'span',
    className,
    from,
  } = props

  return (
    <Refresher
      as={Element}
      className={className}
      fmtFn={formatElapsedTimer}
      from={from} />
  )
}

QuoteTimer.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  from: PropTypes.string.isRequired,
}

export default QuoteTimer
