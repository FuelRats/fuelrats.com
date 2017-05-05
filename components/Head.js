import NextHead from 'next/head'
import React from 'react'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let adsenseSnippet = '(adsbygoogle = window.adsbygoogle || []).push({' +
      'google_ad_client: "ca-pub-9749247943500937",' +
      'enable_page_level_ads: true' +
    '});'

    return (
      <NextHead>
        <title>{this.props.title} | Fuelrats.com</title>

        <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/assets/favicon/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/assets/favicon/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/assets/favicon/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/assets/favicon/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/assets/favicon/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/assets/favicon/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/assets/favicon/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/assets/favicon/apple-touch-icon-152x152.png" />
        <link rel="icon" type="image/png" href="/assets/favicon/favicon-196x196.png" sizes="196x196" />
        <link rel="icon" type="image/png" href="/assets/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/png" href="/assets/favicon/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/assets/favicon/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" type="image/png" href="/assets/favicon/favicon-128.png" sizes="128x128" />
        <meta name="application-name" content="Fuelrats.com"/>
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-TileImage" content="/assets/favicon/mstile-144x144.png" />
        <meta name="msapplication-square70x70logo" content="/assets/favicon/mstile-70x70.png" />
        <meta name="msapplication-square150x150logo" content="/assets/favicon/mstile-150x150.png" />
        <meta name="msapplication-wide310x150logo" content="/assets/favicon/mstile-310x150.png" />
        <meta name="msapplication-square310x310logo" content="/assets/favicon/mstile-310x310.png" />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
        <link href="/static/compiled/lib.css" rel="stylesheet" />
        <link href="/static/compiled/app.css" rel="stylesheet" />
      </NextHead>
    )
  }
}
