// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ asPath, query }) {
    return Object.assign({
      path: asPath,
    }, query)
  }

  render () {
    let {
      path,
    } = this.props

    return (
      <Page path={path} title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        <div className="page-content">
          <iframe
            className="page-content"
            src="https://clients.fuelrats.com:7778/" />
        </div>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Get Help'
  }
}
