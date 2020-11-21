function ModalFooter (props) {
  const {
    className,
    children,
  } = props

  return (
    <footer className={['modal-footer', className]}>
      <menu type="toolbar">
        {children}
      </menu>
    </footer>
  )
}

function FooterPrimary ({ children, className, ...props }) {
  return (
    <div {...props} className={['primary', className]}>
      {children}
    </div>
  )
}

function FooterSecondary ({ children, className, ...props }) {
  return (
    <div {...props} className={['secondary', className]}>
      {children}
    </div>
  )
}





export default ModalFooter
export {
  FooterPrimary,
  FooterSecondary,
}
