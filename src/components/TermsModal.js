// Module imports
import React from 'react'





// Component imports
import classNames from '../helpers/classNames'
import { connect } from '../store'
import { selectWordpressPageBySlug } from '../store/selectors'
import asModal, { ModalContent, ModalFooter } from './Modal'





// Component constants





@asModal({
  className: 'terms-dialog',
  hideClose: true,
})
@connect
class WordpressTermsModal extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    termsAgreed: false,
    loading: true,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleCheckboxChange = ({ target }) => {
    return this.setState({ termsAgreed: target.checked })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const {
      getWordpressPage,
      page,
      slug,
    } = this.props

    if (!page) {
      await getWordpressPage(slug)
    }

    this.setState({
      loading: false,
    })
  }

  renderFooter () {
    const {
      checkboxLabel,
      onClose,
      title,
    } = this.props

    const {
      termsAgreed,
    } = this.state

    const checkboxId = `termsDialog-${title.replace(/\s/gu, '')}-checkbox`

    return (
      <ModalFooter>
        <div className="secondary" />
        <div className="primary">
          <span key="AgreeCheckbox">
            <input
              aria-label={checkboxLabel}
              checked={termsAgreed}
              className="large"
              id={checkboxId}
              type="checkbox"
              onChange={this._handleCheckboxChange} />
            <label htmlFor={checkboxId}>{checkboxLabel}</label>
          </span>
          <button
            key="NextButton"
            disabled={!termsAgreed}
            type="button"
            onClick={onClose}>
            {'Next'}
          </button>
        </div>
      </ModalFooter>
    )
  }

  /* eslint-disable react/no-danger */
  renderWordpressPage () {
    const { page } = this.props

    return (
      <div
        dangerouslySetInnerHTML={page && { __html: page.content.rendered.replace(/<ul>/giu, '<ul class="bulleted">').replace(/<ol>/giu, '<ol class="numbered">') }} />
    )
  }
  /* eslint-enable react/no-danger */

  render () {
    const {
      loading,
    } = this.state

    const {
      page,
    } = this.props

    const classes = classNames(
      ['loading', loading],
      ['error', !loading && !page],
    )

    return (
      <>
        <ModalContent className={classes}>
          {this.renderWordpressPage(page)}
        </ModalContent>
        {this.renderFooter()}
      </>
    )
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = ['getWordpressPage']

  static mapStateToProps = (state, ownProps) => {
    return {
      page: selectWordpressPageBySlug(state, ownProps),
    }
  }
}





export default WordpressTermsModal
