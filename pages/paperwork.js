// Module imports
import React from 'react'





// Component imports
import Component from '../components/Component'
import Page from '../components/Page'
import i18next from '../components/i18next'





export default class extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps () {
    console.log('getting initial props')
//    await new Promise(resolve => i18next.on('loaded', resolve))
    return {}
  }

  render () {
//    console.log('rendering', i18next)


    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{i18next.t('pages.paperwork')}</h1>
        </header>

        <fieldset>
          <label htmlFor="rats">
            {i18next.t('paperwork.rats.question')}
          </label>

          <tags-input id="rats" name="rats"></tags-input>
        </fieldset>

        <fieldset>
          <label htmlFor="firstLimpet">
            {i18next.t('paperwork.firstLimpet.question')}
          </label>

          <tags-input id="firstLimpet" data-multiple="false" name="firstLimpet"></tags-input>
        </fieldset>

        <fieldset>
          <label htmlFor="system">
            {i18next.t('paperwork.system.question')}
            <small>
              {i18next.t('paperwork.system.subtext')}
            </small>
          </label>

          <tags-input id="system" data-multiple="false" name="system"></tags-input>
        </fieldset>

        <fieldset>
          <label>
            {i18next.t('paperwork.platform.question')}
          </label>

          <div className="option-group">
            <input defaultChecked="true" id="platform-pc" name="platform" type="radio" value="pc" /> <label htmlFor="platform-pc">{i18next.t('common.pc')}</label>

            <input id="platform-xb" name="platform" type="radio" value="xb" /> <label htmlFor="platform-xb">{i18next.t('common.xbox')}</label>
          </div>
        </fieldset>

        <fieldset>
          <label>
            {i18next.t('paperwork.successful.question')}
          </label>

          <div className="option-group">
            <input defaultChecked="true" id="successful-yes" name="successful" type="radio" value="yes" /> <label htmlFor="successful-yes">{i18next.t('common.yes')}</label>

            <input id="successful-no" name="successful" type="radio" value="no" /> <label htmlFor="successful-no">{i18next.t('common.no')}</label>
          </div>
        </fieldset>

        <fieldset>
          <label>
            {i18next.t('paperwork.codeRed.question')}
          </label>

          <div className="option-group">
            <input defaultChecked="true" id="codeRed-yes" name="codeRed" type="radio" value="yes" /> <label htmlFor="codeRed-yes">{i18next.t('common.yes')}</label>

            <input id="codeRed-no" name="codeRed" type="radio" value="no" /> <label htmlFor="codeRed-no">{i18next.t('common.no')}</label>
          </div>
        </fieldset>

        <fieldset>
          <label htmlFor="notes">
            {i18next.t('paperwork.notes.question')}
          </label>

          <textarea id="notes" name="notes"></textarea>
        </fieldset>

        <menu type="toolbar">
          <div className="primary">
            <button type="submit">
              {i18next.t('common.submit')}
            </button>
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
    return 'Home'
  }
}
