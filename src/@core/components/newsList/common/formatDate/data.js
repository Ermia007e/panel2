// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import axios from 'axios'
import { useState } from 'react'
import { MoreVertical, Edit, FileText, Archive, Trash, Star, User, UserPlus } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
import ActionButtons from '../../newsLists/table/ActionButtons'
import { formatDate } from '../formatDate/formatDate'
import { Navigate, useNavigate } from 'react-router-dom'

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

// ** Get initial Data
axios.get('/api/datatables/initial-data').then(response => {
  data = response.data
})

// ** Table Zero Config Column
export const basicColumns = [
  {
    name: 'ID',
    sortable: true,
    maxWidth: '100px',
    selector: row => row.id
  },
  {
    name: 'Name',
    sortable: true,
    minWidth: '225px',
    selector: row => row.full_name
  },
  {
    name: 'Email',
    sortable: true,
    minWidth: '310px',
    selector: row => row.email
  },
  {
    name: 'Position',
    sortable: true,
    minWidth: '250px',
    selector: row => row.post
  },
  {
    name: 'Age',
    sortable: true,
    minWidth: '100px',
    selector: row => row.age
  },
  {
    name: 'Salary',
    sortable: true,
    minWidth: '175px',
    selector: row => row.salary
  }
]
// ** Table ReOrder Column
// assitanceWork
export const assistanceColumns = [
  {
    name: 'عنوان کار',
    selector: row => row.worktitle,
    minWidth: '100px'
  },
  {
    name: 'توضیحات',
    selector: row => row.workDescribe,
    minWidth: '100px'
  },
  {
    name: 'تاریخ کار',
    selector: row => new Date(row.workDate).toLocaleDateString('fa-IR'),
    width: '150px'
  },
  {
    name: 'نام دوره',
    selector: row => row.courseName,
    minWidth: '100px'
  },
  {
    name: 'نام استادیار',
    selector: row => row.assistanceName,
    minWidth: '100px'
  },
  {
    name: 'تاریخ ثبت',
    selector: row => row.inserDate ? new Date(row.inserDate).toLocaleDateString('fa-IR') : '-',
    width: '100px'
  },
  {
    name: 'انجام عملیات',
    minWidth: '100px',
    cell: row => {
      const navigate = useNavigate();
      return (
        <div 
          onClick={() => navigate(`/EditWork/${row?.workId}`)} 
          style={{
            color: '#0066cc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 20px'
          }}
        >
          <Edit />
        </div>
      );
    },
  }
];


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
// Assistance

export const columns = (handleAddAssistantClick) => [
  {
    name: 'لیست استادیارها',
    minWidth: '950px',
    sortable: row => row.assistanceName,
    selector: row => row.assistanceName,
    cell: row => (
      <div className='d-flex align-items-center py-1'>
        <div className='avatar me-2'>
          <div className='avatar-initial bg-light-primary rounded-circle d-flex align-items-center justify-content-center' style={{width: '40px', height: '40px'}}>
            <User size={18} className='text-primary' />
          </div>
        </div>
        <div className='d-flex flex-column'>
          <span className='fw-bold text-truncate'>{row.assistanceName}</span>
          <small className='text-muted text-truncate'>استادیار گروه آموزشی</small>
        </div>
      </div>
    )
  },
  {
    name: 'انجام عملیات',
    minWidth: '200px',
    cell: row => {
      const navigate = useNavigate();
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div 
            onClick={() => navigate(`/Edit/${row?.id}`)} 
            style={{
              color: '#0066cc',
              cursor: 'pointer',
              margin: '0 10px'
            }}
            title="ویرایش استادیار"
          >
            <Edit />
          </div>
          <div 
            onClick={() => handleAddAssistantClick(row)}
            style={{
              color: '#28a745',
              cursor: 'pointer',
              margin: '0 10px'
            }}
            title="اضافه کردن به دوره جدید"
          >
            <UserPlus />
          </div>
        </div>
      );
    },
  }
];


// ** Table Intl Column
export const multiLingColumns = [
  {
    name: 'Name',
    sortable: true,
    minWidth: '200px',
    selector: row => row.full_name
  },
  {
    name: 'Position',
    sortable: true,
    minWidth: '250px',
    selector: row => row.post
  },
  {
    name: 'Email',
    sortable: true,
    minWidth: '250px',
    selector: row => row.email
  },
  {
    name: 'Date',
    sortable: true,
    minWidth: '150px',
    selector: row => row.start_date
  },

  {
    name: 'Salary',
    sortable: true,
    minWidth: '150px',
    selector: row => row.salary
  },
  {
    name: 'Status',
    sortable: true,
    minWidth: '150px',
    selector: row => row.status,
    cell: row => {
      return (
        <Badge color={status[row.status].color} pill>
          {status[row.status].title}
        </Badge>
      )
    }
  },
  {
    name: 'Actions',
    allowOverflow: true,
    cell: () => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pe-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>
                <FileText size={15} />
                <span className='align-middle ms-50'>Details</span>
              </DropdownItem>
              <DropdownItem>
                <Archive size={15} />
                <span className='align-middle ms-50'>Archive</span>
              </DropdownItem>
              <DropdownItem>
                <Trash size={15} />
                <span className='align-middle ms-50'>Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit size={15} />
        </div>
      )
    }
  }
]

// ** Table Server Side Column
// newsList
export const serverSideColumns = (openedModalId, setOpenedModalId) => [
  {
    name: 'عنوان',
    minWidth: '250px',
    cell: row => {
      const navigate = useNavigate();
      return (
        <span 
          onClick={() => navigate(`/NewsDetails/${row.id}`)}
          style={{
            color: '#2563eb',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    }}
    >
      {row.title}
    </span>
  );
    },
    headerStyle: {
      color: '#6e6b7b',
      fontWeight: 700
    }
  },
  {
    name: 'دسته بندی',
    minWidth: '150px',
    selector: row => row?.newsCatregoryName,
    headerStyle: {
      color: '#6e6b7b',
      fontWeight: 700
    },
    style: {
      color: '#6e6b7b',
      fontWeight: 500
    }
  },
  {
    sortable: true,
    name: 'آخرین آپدیت',
    minWidth: '150px',
    selector: row => formatDate(row?.updateDate),
    sortField: 'updateDate',
    headerStyle: {
      color: '#6e6b7b',
      fontWeight: 700
    },
    style: {
      color: '#6e6b7b',
      fontWeight: 500
    }
  },
  {
    name: 'تعداد بازدید',
    minWidth: '150px',
    selector: row => row?.currentView,
    headerStyle: {
      color: '#6e6b7b',
      fontWeight: 700
    },
    style: {
      color: '#6e6b7b',
      fontWeight: 500,
    }
  },
  {
    name: 'وضعیت',
    minWidth: '150px',
    headerStyle: {
      color: '#6e6b7b',
      fontWeight: 700
    },
    cell: row => (
      <div style={{
        minWidth: '40px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: row.isActive ? '#28c76f' : '#ea5455',
        backgroundColor: row.isActive ? '#28c76f33' : '#ea545533',
        fontSize: '12px',
        borderRadius: '4px',
        padding: '4px 8px',
        fontWeight: 600
      }}>
        {row.isActive ? 'فعال' : 'غیرفعال'}
      </div>
    )
  },
  {
    name: 'انجام عملیات',
    minWidth: '200px',
    cell: row => <ActionButtons row={row} openedModalId={openedModalId} setOpenedModalId={setOpenedModalId} />,
    headerStyle: { 
      color: '#6e6b7b', 
      fontWeight: 700 
    }
  }
];

// ** Table Adv Search Column
// categoryList
export const advSearchColumns = [
  {
    name: 'تصویر',
    minWidth: '200px',
    selector: row => row.categoryName,
    
    headerStyle: {
      color: '#0066cc',
      fontWeight: '600'
    },
    style: {
      fontSize: '0.875rem',
      fontWeight: '400'
    }
  },
  {
    name: 'عدد دسته بندی',
    minWidth: '120px',
    cell: row => (
      <div style={{
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        color: '#0066cc',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        margin: '0 20px',
        border: '1px solid rgba(0, 102, 204, 0.2)'
      }}>
        {row.id}
      </div>
    ),
    headerStyle: {
      color: '#5e5873',
      fontWeight: '600'
    }
  },
  {
    name: 'نام دسته بندی',
    minWidth: '200px',
    cell: row => (
      <span style={{
        backgroundColor: '#e6f2ff',
        color: '#0066cc',
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'flex',
        gap: '4px'
      }}>
        <Star size={15}/>
        {row.categoryName}
      </span>
    ),
    headerStyle: {
      color: '#5e5873',
      fontWeight: '400'
    }
  },
  {
    name: 'اخرین اپدیت',
    minWidth: '200px',
    selector: row => formatDate(row.insertDate),
    headerStyle: {
      color: '#5e5873',
      fontWeight: '400'
    }
  },
  {
    name: 'انجام عملیات',
    minWidth: '200px',
    cell: row => {
      const navigate = useNavigate();
      return (
        <div 
          onClick={() => navigate(`/EditCategory/${row.id}`)} 
          style={{
            color: '#0066cc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 20px'
          }}
        >
          <Edit />
        </div>
      );
    },
  }
];

export default ExpandableTable