import { useRef, useEffect, createContext } from 'react'




const FormContext = createContext([])

export default function useFormComponent (formContext) {
  const contextRef = useRef()
  contextRef.current = formContext

  const FormRef = useRef()
  if (!FormRef.current) {
    FormRef.current = (props) => {
      const {
        children,
        ...formProps
      } = props

      const {
        handleSubmit,
        validateAll,
        ctx,
      } = contextRef.current

      // eslint-disable-next-line react-hooks/rules-of-hooks -- This is fine in execution
      useEffect(() => {
        validateAll(ctx.state)
      // eslint-disable-next-line react-hooks/exhaustive-deps -- We only want this to run once.
      }, [])

      return (
        <form {...formProps} onSubmit={handleSubmit}>
          <FormContext.Provider value={contextRef.current}>
            {children}
          </FormContext.Provider>
        </form>
      )
    }
    FormRef.current.displayName = 'Form'
  }

  return FormRef.current
}





export {
  FormContext,
}
