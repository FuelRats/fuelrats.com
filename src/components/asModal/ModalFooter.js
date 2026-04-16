import clsx from 'clsx'
function ModalFooter (props) {
  const {
    className,
    children,
  } = props

  return (
    <footer className={clsx('modal-footer', className)}>
      <menu type="toolbar">
        {children}
      </menu>
    </footer>
  )
}

function FooterPrimary ({ children, className, ...props }) {
  return (
    <div {...props} className={clsx('primary', className)}>
      {children}
    </div>
  )
}

function FooterSecondary ({ children, className, ...props }) {
  return (
    <div {...props} className={clsx('secondary', className)}>
      {children}
    </div>
  )
}





export default ModalFooter
export {
  FooterPrimary,
  FooterSecondary,
}
