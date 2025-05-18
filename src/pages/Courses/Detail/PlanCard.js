// ** React Imports
import { Fragment, useState } from 'react'

// ** Reactstrap Imports
import { Row, Col, Label, Card, CardBody, Badge, Progress, Button, Modal, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import Select from 'react-select'
import withReactContent from 'sweetalert2-react-content'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'

const planOptions = [
  { value: 'standard', label: 'Standard - $99/month' },
  { value: 'exclusive', label: 'Exclusive - $249/month' },
  { value: 'enterprise', label: 'Enterprise - $499/month' }
]

const MySwal = withReactContent(Swal)

const PlanCard = () => {
  // ** State
  const [show, setShow] = useState(false)

  const handleConfirmCancel = () => {
    return MySwal.fire({
      title: '',
      text: 'Are you sure you would like to cancel your subscription?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        MySwal.fire({
          icon: 'success',
          title: 'Unsubscribed!',
          text: 'Your subscription cancelled successfully.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Unsubscription Cancelled!!',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  return (
    <Fragment>

    </Fragment>
  )
}

export default PlanCard
