// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{this.title}</h1>
        </header>

        <fieldset>
          <label htmlFor="rats">Who arrived for the rescue?</label>

          <tags-input id="rats" name="rats"></tags-input>
        </fieldset>

        <fieldset>
          <label htmlFor="firstLimpet">Who fired the first limpet?</label>

          <tags-input id="firstLimpet" data-multiple="false" name="firstLimpet"></tags-input>
        </fieldset>

        <fieldset>
          <label htmlFor="system">Where did it happen? <small>In what star system did the rescue took place? (put \"n/a\" if not applicable)</small></label>

          <tags-input id="system" data-multiple="false" name="system"></tags-input>
        </fieldset>

        <fieldset>
          <label>What platform was the rescue on?</label>

          <div className="option-group">
            <input defaultChecked="true" id="platform-pc" name="platform" type="radio" value="pc" /> <label htmlFor="platform-pc">PC</label>

            <input id="platform-xb" name="platform" type="radio" value="xb" /> <label htmlFor="platform-xb">Xbox One</label>

            <input id="platform-ps" name="platform" type="radio" value="ps" /> <label htmlFor="platform-ps">Playstation 4</label>
          </div>
        </fieldset>

        <fieldset>
          <label>Was the rescue successful?</label>

          <div className="option-group">
            <input defaultChecked="true" id="successful-yes" name="successful" type="radio" value="yes" /> <label htmlFor="successful-yes">Yes</label>

            <input id="successful-no" name="successful" type="radio" value="no" /> <label htmlFor="successful-no">No</label>
          </div>
        </fieldset>

        <fieldset>
          <label>Was it a code red?</label>

          <div className="option-group">
            <input defaultChecked="true" id="codeRed-yes" name="codeRed" type="radio" value="yes" /> <label htmlFor="codeRed-yes">Yes</label>

            <input id="codeRed-no" name="codeRed" type="radio" value="no" /> <label htmlFor="codeRed-no">No</label>
          </div>
        </fieldset>

        <fieldset>
          <label htmlFor="notes">Notes</label>

          <textarea id="notes" name="notes"></textarea>
        </fieldset>

        <menu type="toolbar">
          <div className="primary">
            <button type="submit">Submit</button>
          </div>
          <div className="secondary"></div>
        </menu>
      </Page>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get title () {
    return 'Paperwork'
  }
}
