// Module imports
import React from 'react'





export default class extends React.Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  render () {
    let assistCount = parseInt(Math.random() * 100)
    let firstLimpetCount = parseInt(Math.random() * 100)
    let failureCount = parseInt(Math.random() * 100)
    let successRate = parseInt(Math.random() * 100)

    return (
      <section className="panel">
        <table className="full-width padded stats">
          <colgroup>
            <col />
  
            <col />
  
            <col />
  
            <col />
          </colgroup>
  
          <thead>
            <tr>
              <td>Rescues</td>
  
              <td>Assists</td>
  
              <td>Failures</td>
  
              <td>Success Rate</td>
            </tr>
          </thead>
  
          <tbody>
            <tr>
              <td className="rescues-count">{firstLimpetCount}</td>
  
              <td className="assists-count">{assistCount}</td>
  
              <td className="failures-count">{failureCount}</td>
  
              <td className="success-rate">{successRate}%</td>
            </tr>
          </tbody>
        </table>
      </section>
    )
  }
}
