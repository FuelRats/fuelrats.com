// Component imports
import Page from '../components/Page'





// Component constants
const title = 'Acknowledgements'


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
]

const Acknowledgements = () => (
  <div className="page-wrapper">
    <header className="page-header">
      <h1>{title}</h1>
    </header>

    <div className="page-content">
      {
        brands.map(brand => (
          <div key={brand.key} className={`credit-section credit-${brand.key}`}>
            <a
              href={brand.homepage}
              rel="noopener noreferrer"
              target="_blank">
              <div className={`brand-image ${brand.key}-brand`} />
            </a>
            <p>{brand.description}</p>
          </div>
        ))
      }
    </div>
  </div>
)





export default Page(title, false)(Acknowledgements)
