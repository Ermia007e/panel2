// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { MoreVertical, Edit, FileText, Archive, Trash, Link } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import { useMutation, useQueryClient } from 'react-query'
import { changeReserve, deleteCourse, expireCourses, isActiveCourses } from '../../../../services/api/Courses'
import toast from 'react-hot-toast'
import dateModifier from '../../../../utility/dateModifier'
import { NavLink } from 'react-router-dom'

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
    name: 'نام دوره',
    sortable: true,
    minWidth: '150px',
    selector: row => row.courseName
  },
  {
    name: 'نام دانشجو',
    sortable: true,
    minWidth: '150px',
    selector: row => row.studentName
  },
  {
    name: 'تاریخ',
    sortable: true,
    minWidth: '150px',
    selector: row => { return dateModifier(row.reserverDate) }
  },

  {
    name: 'عملیات',
    allowOverflow: true,
    cell: (row) => {
      const queryClient = useQueryClient()


      const changeReservetoCourse = () => {
        const expireCouress = { id: row.courseId, courseGroupId: !row.isExpire };
        expireCourse.mutate(expireCouress);
      };


      const expireCourse = useMutation({
        mutationFn: changeReserve,
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
              <DropdownItem tag='a' href='/' className='w-100' onClick={e => {
                console.log(row.courseId);
                e.preventDefault()
              }}>
                <NavLink to={`/course-details/${row.courseId}`}>
                    جزئیات
                    {row.title}
                </NavLink>

              </DropdownItem>

              <DropdownItem
                onClick={(e) => {
                  e.preventDefault()
                  changeReservetoCourse(row.courseId)
                }}
                tag='a' href='/' className='w-100' >
                <Archive size={15}

                />
                <span className='align-middle ms-50'
                >
                  {row.accept}
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
