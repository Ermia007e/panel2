// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

// ** Third Party Components
import Swal from 'sweetalert2'
import Select from 'react-select'
import { Check, Briefcase, X, Users, ArrowUp } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import withReactContent from 'sweetalert2-react-content'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import dateModifier from '../../../utility/dateModifier'

const roleColors = {
  editor: 'light-info',
  admin: 'light-danger',
  author: 'light-warning',
  maintainer: 'light-success',
  subscriber: 'light-primary'
}

const statusColors = {
  active: 'light-success',
  pending: 'light-warning',
  inactive: 'light-secondary'
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' }
]

const countryOptions = [
  { value: 'uk', label: 'UK' },
  { value: 'usa', label: 'USA' },
  { value: 'france', label: 'France' },
  { value: 'russia', label: 'Russia' },
  { value: 'canada', label: 'Canada' }
]

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'dutch', label: 'Dutch' }
]

const MySwal = withReactContent(Swal)

const UserInfoCard = ({ courseDetail }) => {
  // ** State
  const [show, setShow] = useState(false)

  // ** Hook
  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: courseDetail.teacherName,
      lastName: courseDetail.teacherName.split(' ')[1],
      firstName: courseDetail.teacherName.split(' ')[0]
    }
  })

  // ** render user img
  // const renderUserImg = () => {
  //   if (courseDetail !== null && courseDetail.avatar.length) {
  //     return (
  //       <img
  //         height='110'
  //         width='110'
  //         alt='user-avatar'
  //         src={courseDetail.avatar}
  //         className='img-fluid rounded mt-3 mb-2'
  //       />
  //     )
  //   } else {
  //     return (
  //       <Avatar
  //         initials
  //         color={courseDetail.avatarColor || 'light-primary'}
  //         className='rounded mt-3 mb-2'
  //         content={courseDetail.fullName}
  //         contentStyles={{
  //           borderRadius: 0,
  //           fontSize: 'calc(48px)',
  //           width: '100%',
  //           height: '100%'
  //         }}
  //         style={{
  //           height: '110px',
  //           width: '110px'
  //         }}
  //       />
  //     )
  //   }
  // }

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      setShow(false)
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleReset = () => {
    reset({
      username: courseDetail.teacherName,
      lastName: courseDetail.teacherName.split(' ')[1],
      firstName: courseDetail.teacherName.split(' ')[0]
    })
  }

  const handleSuspendedClick = () => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert user!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Suspend user!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        MySwal.fire({
          icon: 'success',
          title: 'Suspended!',
          text: 'User has been suspended.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Cancelled Suspension :)',
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
      <Card>
        <CardBody>
          <div className='user-avatar-section'>
            <div className='d-flex align-items-center flex-column'>
              {courseDetail.imageAddress?imageAddress : "عکسی برای این دوره آپلود نشده"}
              <div className='d-flex flex-column align-items-center text-center'>
                <div className='user-info'>
                  <h4>{courseDetail !== null ? courseDetail.fullName : 'Eleanor Aguilar'}</h4>
                  {courseDetail !== null ? (
                    <Badge color={roleColors[courseDetail.role]} className='text-capitalize'>
                      {courseDetail.role}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-around my-2 pt-75'>
            <div className='d-flex align-items-start me-2'>
              <Badge color='warning' className='rounded p-75'>
                <Users className='font-medium-2' />
              </Badge>
              <div className='ms-75'>
                <h4 className='mb-0'>{courseDetail.courseGroupTotal}</h4>
                <small>تعداد گروه ها</small>
              </div>
            </div>
            <div className='d-flex align-items-start'>
              <Badge color='success' className='rounded p-75'>
                <ArrowUp className='font-medium-2' />
              </Badge>
              <div className='ms-75'>
                <h4 className='mb-0'>{courseDetail.courseCommentTotal}</h4>
                <small>تعداد کامنت ها </small>
              </div>
            </div>
          </div>
          <h4 className='fw-bolder border-bottom pb-50 mb-1'>جزئیات</h4>
          <div className='info-container'>
            {courseDetail !== null ? (
              <ul className='list-unstyled'>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>نام استاد:</span>
                  <span> {courseDetail.teacherName}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>نام دوره:</span>
                  <span> {courseDetail.title}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>وضعیت دوره:</span>
                  <Badge className='text-capitalize' color={statusColors[courseDetail.courseStatusName]}>
                    {courseDetail.courseStatusName}
                  </Badge>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>سطح دوره:</span>
                  <span className='text-capitalize'> {courseDetail.courseLevelName}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>نوع دوره:</span>
                  <span> {courseDetail.courseTypeName}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>تکنولوژی دوره:</span>
                  <span> {courseDetail.courseTeches}</span>
                </li> 
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>قیمت:</span>
                  <span>{courseDetail.cost}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>شروع دوره:</span>
                  <span>{dateModifier (courseDetail.startTime)}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>پایان دوره :</span>
                  <span>{dateModifier (courseDetail.endTime)}</span>
                </li>
              </ul>
            ) : null}
          </div>
          <div className='d-flex justify-content-center pt-2'>
            <Button color='primary' onClick={() => setShow(true)}>
              ویرایش اطلاعات
            </Button>
            <Button className='ms-1' color='danger' outline onClick={handleSuspendedClick}>
              پایان دوره
            </Button>
          </div>
        </CardBody>
      </Card>
      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 pt-50 pb-5'>
          <div className='text-center mb-2'>
            <h1 className='mb-1'>Edit User Information</h1>
            <p>Updating user details will receive a privacy audit.</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='gy-1 pt-75'>
              <Col md={6} xs={12}>
                <Label className='form-label' for='firstName'>
                  نام :
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='firstName'
                  name='firstName'
                  render={({ field }) => (
                    <Input {...field} id='firstName' placeholder='John' invalid={errors.firstName && true} />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='lastName'>
                  نام خانوادگی : 
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='lastName'
                  name='lastName'
                  render={({ field }) => (
                    <Input {...field} id='lastName' placeholder='Doe' invalid={errors.lastName && true} />
                  )}
                />
              </Col>
              <Col xs={12}>
                <Label className='form-label' for='username'>
                  نام کاربر :
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='username'
                  name='username'
                  render={({ field }) => (
                    <Input {...field} id='username' placeholder='john.doe.007' invalid={errors.username && true} />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='billing-email'>
                  ایمیل :  
                </Label>
                <Input
                  type='email'
                  id='billing-email'
                  defaultValue={courseDetail.email}
                  placeholder='example@domain.com'
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='status'>
                  وضعیت دوره :
                </Label>
                <Select
                  id='status'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={statusOptions}
                  theme={selectThemeColors}
                  defaultValue={statusOptions[statusOptions.findIndex(i => i.value === courseDetail.status)]}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='tax-id'>
                  سطح دوره : 
                </Label>
                <Input
                  id='tax-id'
                  placeholder='Tax-1234'
                  // defaultValue={courseDetail.contact.substr(courseDetail.contact.length - 4)}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='contact'>
                  نوع دوره
                </Label>
                <Input id='contact' defaultValue={courseDetail.contact} placeholder='+1 609 933 4422' />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='language'>
                  تکنولوژی دوره :
                </Label>
                <Select
                  id='language'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={languageOptions}
                  theme={selectThemeColors}
                  defaultValue={languageOptions[0]}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='country'>
                  قیمت :
                </Label>
                <Select
                  id='country'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={countryOptions}
                  theme={selectThemeColors}
                  defaultValue={countryOptions[0]}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className='form-label' for='language'>
                  شروع و پایان دوره :
                </Label>
                <Select
                  id='language'
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={languageOptions}
                  theme={selectThemeColors}
                  defaultValue={languageOptions[0]}
                />
              </Col>
              <Col xs={12}>
                <div className='d-flex align-items-center mt-1'>
                  <div className='form-switch'>
                    <Input type='switch' defaultChecked id='billing-switch' name='billing-switch' />
                    <Label className='form-check-label' htmlFor='billing-switch'>
                      <span className='switch-icon-left'>
                        <Check size={14} />
                      </span>
                      <span className='switch-icon-right'>
                        <X size={14} />
                      </span>
                    </Label>
                  </div>
                  <Label className='form-check-label fw-bolder' for='billing-switch'>
                    Use as a billing address?
                  </Label>
                </div>
              </Col>
              <Col xs={12} className='text-center mt-2 pt-50'>
                <Button type='submit' className='me-1' color='primary'>
                  Submit
                </Button>
                <Button
                  type='reset'
                  color='secondary'
                  outline
                  onClick={() => {
                    handleReset()
                    setShow(false)
                  }}
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default UserInfoCard
