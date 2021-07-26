import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CMDRFieldset from '~/components/Fieldsets/CMDRFieldset'
import SelectFieldset from '~/components/Fieldsets/SelectFieldset'
import useForm from '~/hooks/useForm'
import { createRat } from '~/store/actions/rats'
import { selectCurrentUserId } from '~/store/selectors'

import styles from './AddRatForm.module.scss'



// Component Constants
const initialState = {
  name: '',
  platform: '',
}





function AddRatForm () {
  const dispatch = useDispatch()
  const userId = useSelector(selectCurrentUserId)
  const [formOpen, setFormOpen] = useState(false)
  const handleToggleForm = useCallback(() => {
    setFormOpen((state) => {
      return !state
    })
  }, [])


  const onSubmit = async ({ name, platform }) => {
    await dispatch(createRat({
      attributes: {
        name: name.trim(),
        platform,
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: userId,
          },
        },
      },
    }))
    setFormOpen(false)
  }


  const { Form, canSubmit, submitting } = useForm({ onSubmit, data: initialState })

  return (
    <Form className={['compact', styles.addRatForm, { [styles.formOpen]: formOpen }]}>
      {
        formOpen && (
          <div className="form-row">
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
              <FontAwesomeIcon fixedWidth icon={submitting ? 'sync' : 'arrow-right'} rotate={submitting} />
            </button>
          )
        }
        <button
          aria-label={formOpen ? 'cancel new commander creation' : 'add commander'}
          className={['compact square', { green: !formOpen }]}
          title={formOpen ? 'Cancel' : 'Add new commander'}
          type="button"
          onClick={handleToggleForm}>
          <FontAwesomeIcon fixedWidth icon={formOpen ? 'times' : 'plus'} />
        </button>
      </div>
    </Form>
  )
}





export default AddRatForm
