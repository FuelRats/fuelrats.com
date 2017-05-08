// Module imports
import React from 'react'





// Component imports
import Page from '../components/Page'

import I18nextPage from '../components/I18nextPage'





export default class extends I18nextPage {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    const { t } = this.props

    return (
      <Page title={this.title}>
        <header className="page-header">
          <h1>{t('pages.paperwork')}</h1>
        </header>

        <fieldset>
          <label htmlFor="rats">
            {t('paperwork.rats.question')}
          </label>

          <tags-input id="rats" name="rats"></tags-input>
        </fieldset>

        <fieldset>
          <label htmlFor="firstLimpet">
            {t('paperwork.firstLimpet.question')}
          </label>

          <tags-input id="firstLimpet" data-multiple="false" name="firstLimpet"></tags-input>
        </fieldset>

        <fieldset>
          <label htmlFor="system">
            {t('paperwork.system.question')}
            <small>
              {t('paperwork.system.subtext')}
            </small>
          </label>

          <tags-input id="system" data-multiple="false" name="system"></tags-input>
        </fieldset>

        <fieldset>
          <label>
            {t('paperwork.platform.question')}
          </label>

          <div className="option-group">
            <input defaultChecked="true" id="platform-pc" name="platform" type="radio" value="pc" /> <label htmlFor="platform-pc">{t('common.pc')}</label>

            <input id="platform-xb" name="platform" type="radio" value="xb" /> <label htmlFor="platform-xb">{t('common.xbox')}</label>
          </div>
        </fieldset>

        <fieldset>
          <label>
            {t('paperwork.successful.question')}
          </label>

          <div className="option-group">
            <input defaultChecked="true" id="successful-yes" name="successful" type="radio" value="yes" /> <label htmlFor="successful-yes">{t('common.yes')}</label>

            <input id="successful-no" name="successful" type="radio" value="no" /> <label htmlFor="successful-no">{t('common.no')}</label>
          </div>
        </fieldset>

        <fieldset>
          <label>
            {t('paperwork.codeRed.question')}
          </label>

          <div className="option-group">
            <input defaultChecked="true" id="codeRed-yes" name="codeRed" type="radio" value="yes" /> <label htmlFor="codeRed-yes">{t('common.yes')}</label>

            <input id="codeRed-no" name="codeRed" type="radio" value="no" /> <label htmlFor="codeRed-no">{t('common.no')}</label>
          </div>
        </fieldset>

        <fieldset>
          <label htmlFor="notes">
            {t('paperwork.notes.question')}
          </label>

          <textarea id="notes" name="notes"></textarea>
        </fieldset>

        <menu type="toolbar">
          <div className="primary">
            <button type="submit">
              {t('common.submit')}
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
