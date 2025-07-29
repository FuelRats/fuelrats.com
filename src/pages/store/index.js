import Link from 'next/link'

function Store () {
  return (
    <div className="page-content">
      <div className="wrapper">
        {'Thank you for your interest in supporting our mission!'}
        <br />
        {'Unfortunately, due to our payment provider\'s integration with our storefront no longer being supported, our store is currently offline. '}
        {'As a result, in order to reopen our store, we have to drop our old solution and come up with a new one from the ground up. '}
        {'This is on the proverbial to-do list, but is not a small task - as of now, we can\'t promise when it will be finished.'}
        <br />
        {'If you are interested in supporting us in the meantime, we greatly appreciate '}
        <Link href="/donate">{'donations'}</Link>{'.'}
      </div>
    </div>
  )
}

Store.getPageMeta = () => {
  return {
    title: 'Merch Store',
    description: 'Support the Fuel Rats\' mission to aid spaceship pilots in our vast universe!',
  }
}





export default Store
