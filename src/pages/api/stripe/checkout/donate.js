/* eslint-disable no-magic-numbers */

import stripeJs from 'stripe'

import getEnv from '~/util/server/getEnv'
import acceptMethod from '~/util/server/middleware/acceptMethod'
import ipFilter from '~/util/server/middleware/ipFilter'
import jsonApiRoute from '~/util/server/middleware/jsonApiRoute'
import requireFingerprint from '~/util/server/middleware/requireFingerprint'
import trafficController from '~/util/server/middleware/trafficController'



const env = getEnv()
const stripe = stripeJs(env.stripe.secret)

const getDonationItemInfo = (amount) => {
  if (amount >= 3500) {
    return {
      description: 'Mother of rats! Talk about a boatload of generosity! We highly appreciate you going the extra lightyear to help us out. Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins35.png',
    }
  }

  if (amount >= 2000) {
    return {
      description: 'Holy limpet! You sure like to live dangerously! We are most grateful for everything you can give. Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins20.png',
    }
  }

  if (amount >= 1000) {
    return {
      description: 'Wow! This is a major donation for our sake. A contribution like this offsets our running costs for three whole days! Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins10.png',
    }
  }


  if (amount >= 500) {
    return {
      description: 'Thank you so much! A donation like this will go a long way towards covering our running costs. Fly Safe, CMDR o7',
      image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins5.png',
    }
  }

  return {
    description: 'Every little bit helps! Your contribution will ensure our continuous service to the galaxy. Fly Safe, CMDR o7',
    image: 'https://wordpress.fuelrats.com/wp-content/uploads/2020/01/coins1.png',
  }
}




export default jsonApiRoute(
  ipFilter(),
  requireFingerprint(),
  trafficController(),
  acceptMethod.POST(),
  async (ctx) => {
    const {
      body = {},
    } = ctx.req

    const {
      amount,
      currency,
      email,
      customer,
    } = body

    const donationInfo = getDonationItemInfo(amount)

    const session = await stripe.checkout.sessions.create({
      success_url: `${env.appUrl}/donate/success`,
      cancel_url: `${env.appUrl}/donate/cancel`,
      submit_type: 'donate',
      payment_method_types: ['card'],
      allow_promotion_codes: false,
      customer_email: email,
      customer,
      line_items: [{
        name: 'One-time Donation',
        description: donationInfo?.description,
        images: [
          donationInfo?.image,
        ],
        amount,
        currency,
        quantity: 1,
      }],
      metadata: {
        fr_payment_type: 'donate',
      },
    })

    ctx.send({
      id: session.id,
      type: 'stripe-checkout-session',
    })
  },
)
