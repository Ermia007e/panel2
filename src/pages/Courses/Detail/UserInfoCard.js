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
import { getgroupList } from '../../../services/api/Blogs'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getCreateCourse, UpdateCourse } from '../../../services/api/Create-Course/CreateCourse'
import useCourseStore from '../../../zustand/useCourseStore '
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { formDataModifire } from '../../../utility/formDataModifire'
import generateUniqueString from '../../../utility/generateUniqueString'
import EditCourse from './EditCourse'
import AddNewSchedual from '../../../@core/components/Courses/Schedual/AddNewSchedual'



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
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState(false)
  const {
    PageNumber,
    SortingCol,
    SortingType,
    SearchInput
  } = useCourseStore()



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

  const { data: groupListList } = useQuery({
    queryKey: [
      "groupListList",
      PageNumber,
      SearchInput,
      SortingCol,
      SortingType,
    ],
    queryFn: () => {
      const result = getgroupList(
        PageNumber,
        SearchInput,
        SortingCol,
        SortingType,
      )
      return result;

    }
  });
  console.log(groupListList, "groupListList")

  const handleModal = () => setModal(!modal)

  console.log(courseDetail.courseGroupId, "jsfewiohfpiwerh")


  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className='user-avatar-section'>
            <div className='d-flex align-items-center flex-column'>

              <img className='img-fluid w-50 rounded' src={courseDetail?.imageAddress || "عکسی برای این دوره آپلود نشده"} alt='عکس موجود نیست' />


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
                  <span>{dateModifier(courseDetail.startTime)}</span>
                </li>
                <li className='mb-75'>
                  <span className='fw-bolder me-25'>پایان دوره :</span>
                  <span>{dateModifier(courseDetail.endTime)}</span>
                </li>
              </ul>
            ) : null}
          </div>
          <div className='d-flex justify-content-center pt-2'>
            <Button color='primary' onClick={() => setShowModal(true)}>
              ویرایش اطلاعات
            </Button>
            <Button className='ms-1' color='danger' outline onClick={handleSuspendedClick}>
              پایان دوره
            </Button>
          </div>
        </CardBody>
        <Button color='primary' onClick={() => setModal(true)}>
          افزودن زمان‌بندی  جدید
        </Button>
      </Card>
      <EditCourse courseDetail={courseDetail} show={showModal} setShow={setShowModal} />
      <AddNewSchedual open={modal} handleModal={handleModal} />

    </Fragment>
  )
}

export default UserInfoCard
