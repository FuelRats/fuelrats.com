/* eslint-disable no-unused-vars */
/* eslint-disable no-magic-numbers */





// Module imports
import Router from 'koa-router'
import stripeJs from 'stripe'

import createControlTower from './TrafficControl'
import authorizeUser from './authorization'
import prepareResponse from './document'



const donationTiers = [
  {
    gt: 3599, // 3600+
    description: 'Every little bit helps! Your contribution will ensure our continuous service to the galaxy. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins1.png',
  },
  {
    gt: 1999, // 2000-3599
    lt: 3600,
    description: 'Thank you so much! A donation like this will go a long way towards covering our running costs. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins5.png',
  },
  {
    gt: 999, // 1000-1999
    lt: 2000,
    description: 'Wow! This is a major donation for our sake. A contribution like this offsets our running costs for three whole days! Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins10.png',
  },
  {
    gt: 499, // 500-999
    lt: 1000,
    description: 'Holy limpet! You sure like to live dangerously! We are most grateful for everything you can give. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins20.png',
  },
  {
    lt: 500, // 0-499
    description: 'Mother of rats! Talk about a boatload of generosity! We highly appreciate you going the extra lightyear to help us out. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins35.png',
  },
]

const configureStripeApi = (router) => {
  const trafficControl = createControlTower()
  const stApiRouter = new Router()
  stApiRouter.use(prepareResponse)
  stApiRouter.use(trafficControl)
  stApiRouter.use(authorizeUser)


  stApiRouter.post('/checkout/donate', (ctx) => {
    const stripe = stripeJs(ctx.state.env.stripe.secret)
    const {
      body = {},
    } = ctx.request

    const {
      amount,
      currency,
      email,
      customer,
    } = body

    const donationInfo = donationTiers.find((tier) => {
      return amount > (tier.gt ?? 0) && amount < (tier.lt ?? Infinity)
    })

    ctx.body = { data: 'woop!' } /* await stripe.checkout.sessions.create({
      success_url: `${ctx.state.env.publicUrl}/donate/success`,
      cancel_url: `${ctx.state.env.publicUrl}/donate/cancel`,
      submit_type: 'donate',
      payment_method_types: ['card'],
      customer_email: email,
      customer,
      line_items: [{
        name: 'One-time Donation',
        description: donationInfo?.description,
        images: [donationInfo?.image],
        amount,
        currency,
        quantity: 1,
      }],
    }) */
  })

  router.use('/st-api', stApiRouter.routes(), stApiRouter.allowedMethods())
}





export default configureStripeApi
