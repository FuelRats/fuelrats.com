import pkg from '../../package.json'





// Component constants
/* eslint-disable max-len -- descriptions should be single lines. */
const brands = [
  {
    key: 'atlassian',
    homepage: 'https://www.atlassian.com/',
    description: 'Atlassian graciously provides us with free JIRA and Confluence licenses, as well as a slew of Addons for the above. We\'re not quite sure how we would manage handling the Fuel Rats today without these great tools.',
  },
  {
    key: 'jetbrains',
    homepage: 'https://www.jetbrains.com/',
    description: 'JetBrains suite of IDEs are an invaluable tool to our Techrats. One by one, our techies have abandoned other, no doubt familiar IDEs for the JetBrains tools, simply because they are that much better.',
  },
  {
    key: 'statuspage',
    homepage: 'https://www.statuspage.io/',
    description: 'Whenever something breaks (infrequent) or we need to intentionally break something to rebuild it better, Statuspage keeps the Mischief up to date on what is going on in a very clean and efficient manner.',
  },
  {
    key: 'slack',
    homepage: 'https://slack.com/',
    description: 'Our Techrats extensively use Slack, both for keeping in touch and to streamline notifications from our various systems. Thank you for helping us out, Slack!',
  },
  {
    key: 'onepass',
    homepage: 'https://1password.com/',
    description: '1Password keeps all of our super secret passwords safe, while making it easy to manage who gets them. In a modern age where strong passwords are must, 1Password remembers what our techrats physically can\'t.',
  },
]





function Acknowledgements () {
  return (
    <div className="page-content">
      {
      brands.map((brand) => {
        return (
          <div key={brand.key} className={`credit-section credit-${brand.key}`}>
            <a
              href={brand.homepage}
              rel="noopener noreferrer"
              target="_blank">
              <div className={`brand-image ${brand.key}-brand`} />
            </a>
            <p>{brand.description}</p>
          </div>
        )
      })
    }
      <div className="dependency-list-wrapper">
        <div className="dependency-list">
          <span>{'Fuelrats.com would not be possible without these awesome packages'}</span>
          <ul className="text-mono">
            {
              Object.keys({
                ...pkg.dependencies,
              }).map((dep) => {
                return (
                  <li key={dep}><a href={`https://www.npmjs.com/package/${dep}`} rel="noopener noreferrer" target="_blank">{dep}</a></li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

Acknowledgements.getPageMeta = () => {
  return {
    title: 'Acknowledgements',
    description: 'Explore our Acknowledgements Page to see the incredible companies fueling the Fuel Rats\' lifesaving missions within \'Elite Dangerous\'. We extend our sincerest thanks to our corporate sponsors, whose generous support empowers us to reach stranded pilots across the galaxy and ensure no spaceship runs out of fuel. Discover the organizations that share our passion for community and gaming, and join us in celebrating their valuable contribution to our interstellar rescue endeavors.',
  }
}


export default Acknowledgements
