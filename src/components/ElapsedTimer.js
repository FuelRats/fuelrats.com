import PropTypes from 'prop-types'

import formatTimeElapsed from '~/util/date/formatTimeElapsed'

import Refresher from './Refresher'

function formatElapsedTimer (from) {
  const [text, remainderMs] = formatTimeElapsed(from)
  return [text, 1000 - remainderMs]
}

function ElapsedTimer (props) {
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

ElapsedTimer.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  from: PropTypes.string.isRequired,
}

export default ElapsedTimer
