import StripeBadgeSvg from '../../public/static/svg/stripeBadge.svg'





function StripeBadge (props) {
  return (
    <a
      className="icon light"
      href="https://stripe.com/"
      rel="noopener noreferrer"
      target="_blank">
      <StripeBadgeSvg
        {...props}
        alt="Powered by Stripe"
        height="26px"
        width="119px" />
    </a>
  )
}





export default StripeBadge
