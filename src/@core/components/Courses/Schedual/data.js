// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import axios from 'axios'
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import dateModifier from '../../../../utility/dateModifier'
import { useMutation, useQueryClient } from 'react-query'
import { deleteCourse, expireCourses, isActiveCourses, isLockToRiase, isSchedualFroming } from '../../../../services/api/Courses'
import toast from 'react-hot-toast'
import { useState } from 'react'
import EditeSchedual from './EditeSchedual'

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
    minWidth: '120px',
    sortable: row => row.full_name,
    cell: row => (
      <div className='d-flex align-items-center'>
        {row.avatar === '' ? (
          <Avatar color={`light-${states[row.status]}`} content={row.full_name} initials />
        ) : (
          <Avatar img={row.tumbImageAddress} />
        )}
        <div className='user-info text-truncate ms-1'>
          <span className='d-block fw-bold text-truncate'>{row.tumbImageAddress}</span>
          <small>{row.tumbImageAddress}</small>
        </div>
      </div>
    )
  },

  {
    name: 'تاریخ شروع',
    sortable: true,
    minWidth: '100px',
    selector: row => { return dateModifier(row.startDate) }
  },

  {
    name: 'تاریخ پایان',
    sortable: true,
    minWidth: '150px',
    selector: row => { return dateModifier(row.endDate) }
  },
  {
    name: 'زمان شروع',
    sortable: true,
    minWidth: '150px',
    selector: row => row.startTime
  },

  {
    name: 'زمان پایان',
    sortable: true,
    minWidth: '150px',
    selector: row => row.endTime
  },
  {
    name: 'هفته',
    sortable: true,
    minWidth: '100px',
    selector: row => row.weekNumber
  },

  {
    name: 'حضور غیاب',
    minWidth: '155px',
    sortable: row => row.forming,
    cell: row => {

      return (
        <Badge color={row.forming ? 'success' : 'danger'} pill>
          {row.forming ? 'فعال' : "غیرفعال"}
        </Badge>
      )
    }
  },

  {
    name: 'وضعیت دوره',
    minWidth: '155px',
    sortable: row => row.lockToRaise,
    cell: row => {

      return (
        <Badge color={row.lockToRaise ? 'success' : 'danger'} pill>
          {row.lockToRaise ? 'فعال' : "قفل شده"}
        </Badge>
      )
    }
  },



  {
    name: 'عملیات',
    allowOverflow: true,
    cell: (row) => {
      const queryClient = useQueryClient()



      const formingSchedual = () => {
        const schedualFroming = { id: row.id, active: !row.forming };
        schedualFrom.mutate(schedualFroming);
      };


      const schedualFrom = useMutation({
        mutationFn: isSchedualFroming,
        onSuccess: () => {
          toast.success("عملیات موفقیت امیز بود");
          queryClient.invalidateQueries(['adminScheduals'])
        },
        onError: () => {
          toast.error("خطا");
        },
      });


      const formingLockToRaisei = () => {
        const schedualLockToRiaseing = { id: row.id, active: !row.lockToRaise };
        schedualLockToRiase.mutate(schedualLockToRiaseing);
      };


      const schedualLockToRiase = useMutation({
        mutationFn: isLockToRiase,
        onSuccess: () => {
          toast.success("عملیات موفقیت امیز بود");
          queryClient.invalidateQueries(['adminScheduals'])
        },
        onError: () => {
          toast.error("خطا");
        },
      });

      const [modal, setModal] = useState(false)

      const handleModal = () => setModal(!modal)

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
                  formingSchedual(row.id)
                }}
                tag='a' href='/' className='w-100' >
                <Archive size={15}

                />
                <span className='align-middle ms-50'
                >
                  {row.forming ? 'غیرفعال کردن حضور غیاب ' : 'فعال کردن حضور غیاب'}

                </span>

              </DropdownItem>

              <DropdownItem
                onClick={(e) => {
                  e.preventDefault()
                  formingLockToRaisei(row.id)
                }}
                tag='a' href='/' className='w-100' >
                <Archive size={15}

                />
                <span className='align-middle ms-50'
                >
                  {row.lockToRaise ? 'قفل کردن' : 'فعال کردن'}

                </span>

              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit className='cursor-pointer' size={15} onClick={handleModal} />
          <EditeSchedual  open={modal} handleModal={handleModal} />

        </div>
      )
    }
  }
]


export default ExpandableTable
