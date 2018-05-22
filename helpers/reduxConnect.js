import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'





import { actions } from '../store'





export default function (mapStateToProps, _mapDispatchToProps, ...rest) {
  const mapDispatchToProps = (dispatch, ownProps) => {
    let props = {}

    if (Array.isArray(_mapDispatchToProps)) {
      props = _mapDispatchToProps.reduce((accumulator, actionName) => ({
        ...accumulator,
        [actionName]: actions[actionName],
      }), {})
      props = bindActionCreators(props, dispatch)
    } else if (typeof pageActions === 'function') {
      props = _mapDispatchToProps(dispatch, ownProps)
    }

    return props
  }

  return connect(mapStateToProps, mapDispatchToProps, ...rest)
}
