// ** Reactstrap Imports
import { Badge, Card, CardHeader, Progress } from 'reactstrap'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
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
import { getCourseUsers } from '../../../services/api/Courses'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

export const columns = [


  {
    sortable: true,
    minWidth: '300px',
    name: 'نام کاربر',
    selector: row => row.studentName,
    cell: row => {
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='avatar-wrapper'>
            <Avatar className='me-1' img={row.img} alt={row.title} imgWidth='32' />
          </div>
          <div className='d-flex flex-column'>
            <span className='text-truncate fw-bolder'>{row.studentName}</span>
            <small className='text-muted'>{row.subtitle}</small>
          </div>
        </div>
      )
    }
  },
  {
    name: 'وضعیت پرداخت',
    minWidth: '150px',
    selector: row => row.peymentDone,
    cell: row => {
      return (
        <Badge color={row.peymentDone ? 'success' : 'danger'} pill>
          {row.peymentDone ? 'پرداخت شده' : "پرداخت نشده"}
        </Badge>
      )
    }
  },
]

const UserProjectsList = () => {
  const { courseId } = useParams()
  //query
  const { data: userList } = useQuery({
    queryKey: ["userList"],
    queryFn: () => {
      const res = getCourseUsers(courseId)
      return res
    },

  });

  console.log(userList, "userList")

  return (
    <Card>
      <CardHeader tag='h4'>لیست کاربران دوره : </CardHeader>
      <div className='react-dataTable user-view-account-projects'>
        <DataTable
          noHeader
          responsive
          columns={columns}
          data={userList}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
        />
      </div>
    </Card>
  )
}

export default UserProjectsList
