import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { isError } from 'flux-standard-action'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import CMDRFieldset from '~/components/Fieldsets/CMDRFieldset'
import ExpansionFieldset from '~/components/Fieldsets/ExpansionFieldset'
import ApiErrorBox from '~/components/MessageBox/ApiErrorBox'
import SelectFieldset from '~/components/Fieldsets/SelectFieldset'
import useForm from '~/hooks/useForm'
import { createRat } from '~/store/actions/rats'
import friendlyApiError from '~/util/friendlyApiError'
import getResponseError from '~/util/getResponseError'

import styles from './AddRatForm.module.scss'
import clsx from 'clsx'



// Component Constants
const initialState = {
  name: '',
  platform: '',
  expansion: '',
}


function AddRatForm () {
  const dispatch = useDispatch()
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState(null)
  const handleToggleForm = useCallback(() => {
    setFormOpen((state) => {
      return !state
    })
    setError(null)
  }, [])


  const onSubmit = async ({ name, platform, expansion }) => {
    setError(null)
    const response = await dispatch(createRat({
      attributes: {
        name: name.trim(),
        platform,
        expansion: platform === 'pc' ? expansion : 'horizons3',
      },
    }))
    if (isError(response)) {
      setError(getResponseError(response))
      return
    }
    setFormOpen(false)
  }


  const { Form, canSubmit, submitting, state } = useForm({ onSubmit, data: initialState })

  return (
    <Form className={clsx('compact', styles.addRatForm, { [styles.formOpen]: formOpen })}>
      {
        error && (
          <ApiErrorBox
            error={error}
            renderError={(err) => {
              return friendlyApiError(err, {
                pointerMessages: {
                  '/data/attributes/name': { detail: err.detail ?? 'CMDR name is invalid.' },
                },
              })
            }} />
        )
      }
      {
        formOpen && (
          <div className="formCol">
            <div className="formRow">
              <CMDRFieldset
                required
                aria-label="Commander Name"
                fieldsetClassName={styles.cmdrField}
                id="NewRatName"
                maxLength={22}
                minLength={1}
                name="name"
                placeholder="CMDR Name" />

              <SelectFieldset
                required
                aria-label="Platform"
                fieldsetClassName={styles.platformField}
                id="NewRatPlatform"
                name="platform"
                placeholder="Platform">
                <option value="pc">{'PC'}</option>
                <option value="xb">{'XB1'}</option>
                <option value="ps">{'PS4'}</option>
              </SelectFieldset>
            </div>

            {
              state.platform === 'pc' && (
                <ExpansionFieldset
                  required
                  aria-label="Expansion"
                  id="NewRatExpansion"
                  label="Game Version"
                  name="expansion" />
              )
            }

          </div>
        )
      }
      <div className={styles.formControl}>
        {
          formOpen && (
            <button
              aria-label="submit new commander"
              className="green compact square"
              disabled={!canSubmit}
              type="submit">
              <FontAwesomeIcon fixedWidth icon={submitting ? 'arrows-rotate' : 'arrow-right'} rotate={submitting} />
            </button>
          )
        }
        <button
          aria-label={formOpen ? 'cancel new commander creation' : 'add commander'}
          className={clsx('compact square', { green: !formOpen })}
          title={formOpen ? 'Cancel' : 'Add new commander'}
          type="button"
          onClick={handleToggleForm}>
          <FontAwesomeIcon fixedWidth icon={formOpen ? 'xmark' : 'plus'} />
        </button>
      </div>
    </Form>
  )
}





export default AddRatForm
