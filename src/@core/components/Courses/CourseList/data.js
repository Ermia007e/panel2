// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import axios from 'axios'
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import dateModifier from '../../../../utility/dateModifier'
import { useMutation, useQueryClient } from 'react-query'
import { deleteCourse, expireCourses, isActiveCourses } from '../../../../services/api/Courses'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

// ** Vars
const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

const status = {
  1: { title: 'Current', color: 'light-primary' },
  2: { title: 'Professional', color: 'light-success' },
  3: { title: 'Rejected', color: 'light-danger' },
  4: { title: 'Resigned', color: 'light-warning' },
  5: { title: 'Applied', color: 'light-info' }
}

export let data

// ** Expandable table component
const ExpandableTable = ({ data }) => {
  return (
    <div className='expandable-content p-2'>
      <p>
        <span className='fw-bold'>City:</span> {data.city}
      </p>
      <p>
        <span className='fw-bold'>Experience:</span> {data.experience}
      </p>
      <p className='m-0'>
        <span className='fw-bold'>Post:</span> {data.post}
      </p>
    </div>
  )
}

// ** Table Common Column
export const columns = [
  {
    name: 'عنوان ',
    minWidth: '150px',
    sortable: row => row.title,
    cell: row => (
      <Link to={`/course-details/${row.courseId}`} className='d-flex align-items-center'>
        {row.title}
      </Link>
    )
  },
  {
    name: 'مدرس',
    sortable: true,
    minWidth: '150px',
    selector: row => row.fullName
  },
  {
    name: 'تاریخ',
    sortable: true,
    minWidth: '150px',
    selector: row => { return dateModifier(row.lastUpdate) }
  },

  {
    name: 'قیمت',
    sortable: true,
    minWidth: '150px',
    selector: row => row.cost
  },
  {
    name: 'سطح دوره',
    sortable: true,
    minWidth: '100px',
    selector: row => row.levelName
  },
  {
    name: 'نوع دوره',
    sortable: true,
    minWidth: '100px',
    selector: row => row.typeName
  },

  {
    name: 'تعداد رزرو',
    sortable: true,
    minWidth: '100px',
    selector: row => row.reserveCount
  },
  {
    name: 'وضعیت دوره',
    minWidth: '150px',
    sortable: row => row.statusName,
    cell: row => {

      return (

        <Badge color='primary' pill>
          {row.statusName}
        </Badge>
      )
    }
  },
  {
    name: 'دوره های فعال و غیرفعال',
    minWidth: '155px',
    sortable: row => row.statusName,
    cell: row => {

      return (
        <Badge color={row.isActive ? 'success' : 'danger'} pill>
          {row.isActive ? 'فعال' : "غیرفعال"}
        </Badge>
      )
    }
  },

  {
    name: 'عملیات',
    allowOverflow: true,
    cell: (row) => {
      const queryClient = useQueryClient()


      const deleteCourseList = () => {
        const deletedCourses = { id: row.courseId, active: !row.isdelete };
        mutation.mutate(deletedCourses);
      };


      const mutation = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
          toast.success("عملیات موفقیت امیز بود");
          queryClient.invalidateQueries(['coursesList'])
        },
        onError: () => {
          toast.error("خطا");
        },
      });

      const expireCourseList = () => {
        const expireCouress = { id: row.courseId, active: !row.isExpire };
        expireCourse.mutate(expireCouress);
      };


      const expireCourse = useMutation({
        mutationFn: expireCourses,
        onSuccess: () => {
          toast.success("عملیات موفقیت امیز بود");
          queryClient.invalidateQueries(['coursesList'])
        },
        onError: () => {
          toast.error("خطا");
        },
      });


      const activeCourseList = () => {
        const activeCouress = { id: row.courseId, active: !row.isActive };
        activeCourse.mutate(activeCouress);
      };


      const activeCourse = useMutation({
        mutationFn: isActiveCourses,
        onSuccess: () => {
          toast.success("عملیات موفقیت امیز بود");
          queryClient.invalidateQueries(['coursesList'])
        },
        onError: () => {
          toast.error("خطا");
        },
      });

      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pe-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                <FileText size={15} />
                <span className='align-middle ms-50'>
                  جزئیات
                </span>
              </DropdownItem>
              <DropdownItem
                onClick={(e) => {
                  e.preventDefault()
                  deleteCourseList(row.courseId)
                }}
                tag='a' href='/' className='w-100' >
                <Trash size={15}

                />
                <span className='align-middle ms-50'
                >
                  {row.isdelete ? 'پاک کردن ' : 'بازگرداندن'}

                </span>
              </DropdownItem>

              <DropdownItem
                onClick={(e) => {
                  e.preventDefault()
                  expireCourseList(row.courseId)
                }}
                tag='a' href='/' className='w-100' >
                <Archive size={15}

                />
                <span className='align-middle ms-50'
                >
                  {row.isExpire ? 'منقضی کردن ' : 'غیر منقضی کردن'}

                </span>

              </DropdownItem>

              <DropdownItem
                onClick={(e) => {
                  e.preventDefault()
                  activeCourseList(row.courseId)
                }}
                tag='a' href='/' className='w-100' >
                <Archive size={15}

                />
                <span className='align-middle ms-50'
                >
                  {row.isActive ? 'غیر فعال کردن' : 'فعال کردن'}

                </span>

              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit size={15} />
        </div>
      )
    }
  }
]


export default ExpandableTable
