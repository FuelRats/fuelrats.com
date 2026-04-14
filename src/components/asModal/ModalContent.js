function ModalContent (props) {
  const {
    as: Element = 'div',
    className,
    children,
    ...restProps
  } = props

  return (
    <Element
      className={['modal-content', className]}
      {...restProps}>

      {children}
    </Element>
  )
}









export default ModalContent
