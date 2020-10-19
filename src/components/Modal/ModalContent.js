function ModalContent (props) {
  const {
    as: Element,
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





ModalContent.defaultProps = {
  as: 'div',
}





export default ModalContent
