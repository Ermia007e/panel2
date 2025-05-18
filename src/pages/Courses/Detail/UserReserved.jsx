// ** Reactstrap Imports
import { Badge, Card, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, Progress, UncontrolledDropdown } from 'reactstrap'

// ** Third Party Components
import { Archive, ChevronDown, Edit, FileText, MoreVertical, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Label Images
import xdLabel from '@src/assets/images/icons/brands/xd-label.png'
import vueLabel from '@src/assets/images/icons/brands/vue-label.png'
import htmlLabel from '@src/assets/images/icons/brands/html-label.png'
import reactLabel from '@src/assets/images/icons/brands/react-label.png'
import sketchLabel from '@src/assets/images/icons/brands/sketch-label.png'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { deleteCourse, getUserReserve } from '../../../services/api/Courses'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import dateModifier from '../../../utility/dateModifier'

export const columns = [


  {
    sortable: true,
    minWidth: '300px',
    name: 'نام دوره',
    selector: row => row.courseName,
    cell: row => {
      return (
        <div className='d-flex flex-column'>
          <span className='text-truncate fw-bolder'>{row.courseName}</span>
        </div>
      )
    }
  },
  {
    sortable: true,
    minWidth: '300px',
    name: 'نام کاربر',
    selector: row => row.courseName,
    cell: row => {
      return (
        <div className='d-flex flex-column'>
          <span className='text-truncate fw-bolder'>{row.studentName}</span>
        </div>
      )
    }
  },

  {
    sortable: true,
    minWidth: '300px',
    name: 'تاریخ رزرو',
    selector: row => row.reserverDate,
    cell: row => {
      return (
        <div className='d-flex flex-column'>
          <span className='text-truncate fw-bolder'>{dateModifier(row.reserverDate)}</span>
        </div>
      )
    }
  },
  {
    name: 'وضعیت پرداخت',
    minWidth: '150px',
    selector: row => row.accept,
    cell: row => {
      return (
        <Badge color={row.accept ? 'success' : 'danger'} pill>
          {row.peymentDone ? 'تایید نشده' : "تایید شده"}
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
        mutation.mutate(row.id);
      };


      const deleteMutation = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
          toast.success("عملیات موفقیت امیز بود");
          queryClient.invalidateQueries(['getUserCourseReserve'])
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
            <DropdownMenu right>
              <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
                <FileText size={15} />
                <span className='align-middle ms-50'>
                  جزئیات
                </span>
              </DropdownItem>
              <DropdownItem
                onClick={(e) => {
                  e.preventDefault()
                  deleteCourseList()
                }}
                tag='a' href='/' className='w-100' >
                <Trash size={15}

                />
                <span className='align-middle ms-50'
                >
                  پاک کردن
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

const UserReserved = () => {
  const { courseId } = useParams()
  //query
  const { data: getUserCourseReserve } = useQuery({
    queryKey: ["getUserCourseReserve"],
    queryFn: () => {
      const res = getUserReserve(courseId)
      return res
    },

  });

  console.log(getUserCourseReserve, "getUserCourseReserve")

  return (
    <Card>
      <CardHeader tag='h4'>لیست کاربران : </CardHeader>
      <div className='react-dataTable user-view-account-projects'>
        <DataTable
          noHeader
          responsive
          columns={columns}
          data={getUserCourseReserve}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
        />
      </div>
    </Card>
  )
}

export default UserReserved
