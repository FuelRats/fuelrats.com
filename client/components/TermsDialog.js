// Module imports
import React from 'react'





// Component imports
import Component from './Component'
import Dialog from './Dialog'





class TermsDialog extends Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  async componentDidMount () {
    const {
      dialogContent,
    } = this.props

    let content = null

    if (typeof dialogContent === 'function') {
      content = await dialogContent()
    }

    this.setState({
      content,
      loading: false,
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      content: null,
      termsAgreed: false,
      loading: true,
    }
  }

  render () {
    const {
      content,
      loading,
    } = this.state

    return (
      <Dialog
        className="terms-dialog"
        controls={this.controls}
        title={this.props.title}
        showClose={false}
        onClose={this.props.onClose}>

        {loading && (
          <div className="loading content" />
        )}

        {(!loading && content) && (
          <div className="content">
            {content}
          </div>
        )}

        {(!loading && !content) && (
          <div className="error content" />
        )}
      </Dialog>
    )
  }

  get controls () {
    const {
      termsAgreed,
    } = this.state

    const checkboxId = `termsDialog-${this.props.title.replace(/\s/gu, '')}-checkbox`

    return {
      primary: [
        (
          <span key="AgreeCheckbox">
            <input
              checked={termsAgreed}
              className="large"
              id={checkboxId}
              onChange={({ target }) => this.setState({ termsAgreed: target.checked })}
              type="checkbox" />
            <label htmlFor={checkboxId}>{this.props.checkboxLabel}</label>
          </span>
        ),
        (
          <button
            disabled={!termsAgreed}
            key="NextButton"
            onClick={() => this.props.onClose()}
            type="button">
            Next
          </button>
        ),
      ],
    }
  }
}





export default TermsDialog
