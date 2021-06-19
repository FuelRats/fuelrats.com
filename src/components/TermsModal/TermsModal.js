import React from 'react'

import { connect } from '~/store'
import { selectWordpressPageBySlug } from '~/store/selectors'

import asModal, { ModalContent, ModalFooter } from '../asModal'
import styles from './TermsModal.module.scss'





@asModal({ className: 'terms-dialog' })
@connect
class TermsModal extends React.Component {
  /***************************************************************************\
    Class Properties
  \***************************************************************************/

  state = {
    termsAccepted: false,
    loading: true,
  }





  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _handleCheckboxChange = ({ target }) => {
    return this.setState({ termsAccepted: target.checked })
  }

  _handleAccept = () => {
    if (this.state.termsAccepted) {
      this.props.onAccept?.()
    }
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
      title,
    } = this.props

    const {
      termsAccepted,
    } = this.state

    const checkboxId = `termsDialog-${title.replace(/\s/gu, '')}-checkbox`

    return (
      <ModalFooter>
        <div className="secondary" />
        <div className="primary">
          <span key="AgreeCheckbox">
            <input
              aria-label={checkboxLabel}
              checked={termsAccepted}
              className="large"
              id={checkboxId}
              type="checkbox"
              onChange={this._handleCheckboxChange} />
            <label htmlFor={checkboxId}>{checkboxLabel}</label>
          </span>
          <button
            key="NextButton"
            disabled={!termsAccepted}
            type="button"
            onClick={this._handleAccept}>
            {'Next'}
          </button>
        </div>
      </ModalFooter>
    )
  }

  /* eslint-disable react/no-danger */
  renderWordpressPage () {
    const { page } = this.props

    return Boolean(page) && (
      <div dangerouslySetInnerHTML={page && { __html: page.content.rendered.replace(/<ul>/giu, '<ul class="bulleted">').replace(/<ol>/giu, '<ol class="numbered">') }} />
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

    return (
      <>
        <ModalContent className={[styles.content, { error: !loading && !page }]}>
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





export default TermsModal
