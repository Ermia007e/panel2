// ** Reactstrap Imports
import { Badge, Button, Card, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, Progress, UncontrolledDropdown } from 'reactstrap'

// ** Third Party Components
import { Archive, ChevronDown, Edit, FileText, MoreVertical, Plus, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Custom Components
import Avatar from '@components/avatar'



// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useState } from 'react'
import { DeleteComments, getUserComments } from '../../../services/api/Courses'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import dateModifier from '../../../utility/dateModifier'
import toast from 'react-hot-toast'


export const columns = [
  
  {
    sortable: true,
    minWidth: '300px',
    name: 'نام کاربر',
    selector: row => row.title,
    cell: row => {
      return (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='avatar-wrapper'>
            <Avatar className='me-1' img={row.img} alt={row.title} imgWidth='32' />
          </div>
          <div className='d-flex flex-column'>
            <span className='text-truncate fw-bolder'>{row.author}</span>
            <small className='text-muted'>{row.subtitle}</small>
          </div>
        </div>
      )
    }
  },
  {
    name: 'عنوان کامنت',
    selector: row => row.title
  },
  {
    name: 'متن کامنت',
    selector: row => row.progress,
    sortable: true,
    cell: row => {
      return (
        <div className='d-flex flex-column w-100'>
          <small className='mb-1'>{`${row.describe}`}</small>
        </div>
      )
    }
  },
  {
    name: 'وضعیت کامنت',
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
    sortable: true,
    minWidth: '300px',
    name: 'تاریخ کامنت',
    selector: row => row.reserverDate,
    cell: row => {
      return (
        <div className='d-flex flex-column'>
          <span className='text-truncate fw-bolder'>{dateModifier (row.insertDate)}</span>
        </div>
      )
    }
  },

  {
    name: 'عملیات',
    allowOverflow: true,
    cell: (row) => {
      const queryClient = useQueryClient()


      const deleteCommenta = () => {
        mutation.mutate(row.id);
      };


      const mutation = useMutation({
        mutationFn: DeleteComments,
        onSuccess: () => {
          toast.success("عملیات موفقیت امیز بود");
          queryClient.invalidateQueries(['userComment'])
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
                  deleteCommenta(row.id)
                }}
                tag='a' href='/' className='w-100' >
                <Trash size={15}

                />
                <span className='align-middle ms-50'
                >
                  پاک کردن

                </span>
              </DropdownItem>

              {/* <DropdownItem
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

              </DropdownItem> */}
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit size={15} />
        </div>
      )
    }
  }

]



const Comments = () => {
  const [modal, setModal] = useState(false)

  const handleModal = () => setModal(!modal)

  const { courseId } = useParams()
  //query\
  const { data: userComment } = useQuery({
    queryKey: ["userComment"],
    queryFn: () => {
      const res = getUserComments(courseId)
      return res
    },

  });

  console.log(userComment, "userComment")


  return (
    <Card>
      <CardHeader tag='h4'>لیست گروه های دوره </CardHeader>
      <div className='react-dataTable user-view-account-projects'>
        <DataTable
          noHeader
          responsive
          columns={columns}
          data={userComment}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
        />
      </div>


    </Card>
  )
}

export default Comments
