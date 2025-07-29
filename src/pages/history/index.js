import Quote from '~/components/Quote'

function History () {
  return (
    <div className="page-content">
      <div className="wrapper">
        <h2>
          {'Why are we called The Mischief?'}
        </h2>

        <Quote author="Forum: Traveller_GG" date="05 Jun 3301">
          <p>
            {'A few idle thoughts:'}
          </p>
          <p>
            {'Did you know a group of rats is called a mischief? How utterly appropriate'}
          </p>
          <p>
            {'The aglie kangaroo rat\'s taxonomy is Dipodomys agilis. Given our willingness to jump great distances I can\'t help but think this would be a suitable Latinname'}
            {'for the group. We need shoulder patches!!'}
          </p>
          <p>
            {'If someone posted that they were out of fuel and a nearby rat jumped to help, but it turned out to be a pirate; would this be a Rat Trap (and you\'ve been caught)'}
          </p>
        </Quote>

        <h2>
          {'What\'s the obsession with Snickers?'}
        </h2>

        <Quote author="CMDR Surly Badger" date="28 Jun 3301">
          <p>
            {'Today, one of the Fuel Rats was attacked while attempting to deliver fuel for a rescue.'}
          </p>
          <p>
            {'We all knew that something like this could happen. We had a bit of coordination to do back at the Rat\'s Nest and the CMDR who was surprised was replaced with a'}
            {'volunteer hostage, CMDR Domaq.'}
          </p>
          <p>
            {'The pirates\' demand was 200t of platinum. Our counter-offer was that we\'d take him back if they gave us 100t of gold and 3 Snickers Bars. CMDR Domaq did his best'}
            {'to be an annoying rat, but eventually the pirates got as bored of us as we were of them, and opened fire on Domaq. CMDR Chance also attempted to join as a hostage'}
            {'but experienced instancing problems, then finally arrived in time to get shot down to 80% hull.'}
            <strong>
              <em>
                {'We appreciate and applaud the actions of both the Fuel Rat who responded in good faith to what turned out to be a trap, and to CMDRs Domaq and Chance who went'}
                {'and stuck their noses back into the trap to demonstrate the fearless sense of humor of the Fuel Rats!'}
              </em>
            </strong>
          </p>
          <p>
            {'We cannot be "The Good Guys" if we take sides, assemble war-fleets, blacklist people who don\'t play the way we want. Their actions speak for themselves: trapping'}
            {'someone who came to help with a war-fleet that outnumbers them. Our actions speak for us, as well:'}
          </p>
          <ul>
            <li>{'We have Fuel'}</li>
            <li>{'You don\'t'}</li>
            <li>{'Any questions?'}</li>
          </ul>
          <p>
            {'Any other response eventually turns us into a War-Guild, or an extortion racket - or encourages more pirates to amuse themselves by wasting their time and ours.'}
          </p>
          <p>
            {'In other words, '}
            <strong><em>{'today\'s incident changes nothing. '}</em></strong>
            {'To change our behaviors at all would make us less than we are, right now. Let\'s not do that.'}
          </p>
          <p>
            {'We come with fuel (and hopefully guns and shields) but we come to help not make war. If we\'re attacked,'}
            <strong><em>{'run away.'}</em></strong>
            {'When you\'re not being a Fuel Rat, behave however you like, on your own, but please - if you\'re responding to the Rat-Signal - rise above; we\'re here to help.'}
          </p>
          <p>
            {'If you need fuel, just holler.'}
          </p>
        </Quote>

        <br />

        {'Want to know more about the history of the Fuel Rats? We have a more in-depth history available '}
        <a href="https://confluence.fuelrats.com/display/public/FRKB/History" rel="noreferrer" target="_blank">{'on our knowledge base'}</a>{'.'}
      </div>
    </div>
  )
}

History.getPageMeta = () => {
  return {
    title: 'History',
    description: 'Random bits of Fuel Rats history to nibble on.',
  }
}





export default History
