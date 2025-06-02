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
import { isActiveBlogs } from '../../../../services/api/Blogs'

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
    name: 'دسته بندی ',
    minWidth: '150px',
    cell: row => {
      return row.categoryName
    },

  },
  {
    name: 'عدد دسته بندی',
    sortable: true,
    minWidth: '150px',
    selector: row => row.id
  },
  {
    name: 'اخرین اپدیت',
    sortable: true,
    minWidth: '150px',
    selector: row => { return dateModifier(row.insertDate) }
  },


  {
    name: 'عملیات',
    allowOverflow: true,
    cell: (row) => {



      return (
        <div className='d-flex'>
          <Edit size={15} />
        </div>
      )
    }
  }
]


export default ExpandableTable
