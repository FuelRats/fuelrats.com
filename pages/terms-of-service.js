// Module imports
import fetch from 'isomorphic-fetch'
import React from 'react'





// Component imports
import Component from '../components/Component'
import Page from '../components/Page'





// Component constants
const title = 'Terms of Service'





class PrivacyPolicy extends Component {
  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _retrieveBlog () {
    const response = await fetch('/wp-api/pages/3545')
    const page = await response.json()

    this.setState({
      page: response.ok ? page : null,
      retrieving: false,
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._retrieveBlog()
  }

  constructor(props) {
    super(props)

    this.state = {
      page: null,
      retrieving: true,
    }
  }

  render () {
    const {
      page,
      retrieving,
    } = this.state

    let content = null

    if (page) {
      content = page.content.rendered.replace(/<ul>/gi, '<ul class="bulleted">').replace(/<ol>/gi, '<ol class="numbered">')
    }

    /* eslint-disable react/no-danger */
    return (
      <div className="page-wrapper">
        <header className="page-header">
          <h1>{title}</h1>
        </header>

        {retrieving && (
          <article className="loading page-content" />
        )}

        {(!retrieving && page) && (
          <article className="page-content">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: content }} />
          </article>
        )}

        {(!retrieving && !page) && (
          <article className="error page-content" />
        )}
      </div>
    )
    /* eslint-enable */
  }
}





export default Page(title, false)(PrivacyPolicy)
