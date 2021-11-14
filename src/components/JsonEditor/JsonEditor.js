import PropTypes from 'prop-types'

import JsonObject from '~/components/JsonEditor/JsonObject'
import useForm from '~/hooks/useForm'

import styles from './JsonEditor.module.scss'




// Component Constants





function JsonEditor (props) {
  const {
    className,
    data,
  } = props

  const { Form, state } = useForm({ data })

  return (
    <>
      <Form className={[styles.jsonEditor, className]}>
        <JsonObject name="object" node={data} />
      </Form>
      <br />
      <pre>
        {JSON.stringify(state, null, '  ')}
      </pre>
    </>
  )
}

JsonEditor.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired,
}





export default JsonEditor
