import Avatar from '@components/avatar'
import { Badge } from 'reactstrap'
import { useNavigate } from 'react-router-dom'

const getStatusBadge = active => {
  if (active === "True" || active === true) {
    return { title: 'Active', color: 'light-success' }
  }
  return { title: 'Inactive', color: 'light-secondary' }
}

const DEFAULT_NAME = "ناشناس"
const DEFAULT_LASTNAME = "ناشناس"

const ExpandableTable = ({ data }) => (
  <div className='expandable-content p-2'>
    <p>
      <span className='fw-bold'>Phone Number:</span> {data.phoneNumber}
    </p>
    <p>
      <span className='fw-bold'>Profile Completion:</span> {data.profileCompletionPercentage}%
    </p>
    <p>
      <span className='fw-bold'>Gender:</span> {data.gender === false ? 'زن' : 'مرد'}
    </p>
    <p>
      <span className='fw-bold'>Roles:</span> {
        (data.userRoles || "")
          .split(",")
          .map(r => r.trim())
          .slice(0, 2)
          .join(", ")
      }
      {
        ((data.userRoles || "").split(",").length > 2) && " ..."
      }
    </p>
    <p>
      <span className='fw-bold'>Insert Date:</span> {data.insertDate}
    </p>
    {data.pictureAddress && data.pictureAddress !== 'Not-set' && (
      <p>
        <span className='fw-bold'>Profile Picture:</span>
        <img src={data.pictureAddress} alt="profile" style={{height: 40, borderRadius: 8, marginRight: 8}} />
      </p>
    )}
    {data.profile && (
      <p>
        <span className='fw-bold'>Profile:</span> {data.profile}
      </p>
    )}
  </div>
)

export const columns = [
  {
    name: 'Name',
    minWidth: '200px',
    sortable: true,
    selector: row => row.fname || DEFAULT_NAME,
    cell: row => {
      const navigate = useNavigate()
      const roles = (row.userRoles || "").split(",").map(r => r.trim())
      const shownRoles = roles.slice(0, 2).join(", ")
      const hasMore = roles.length > 2
      const fname = row.fname || DEFAULT_NAME
      const lname = row.lname || DEFAULT_LASTNAME
      return (
        <div className='d-flex align-items-center'>
          {row.pictureAddress && row.pictureAddress !== 'Not-set' ? (
            <img
              src={row.pictureAddress}
              alt="profile"
              style={{ height: 40, width: 40, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <Avatar color='light-primary' content={fname} initials />
          )}
          <div className='user-info text-truncate ms-1'>
            <span
              className='d-block fw-bold text-truncate'
              style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline' }}
              onClick={() => navigate(`/users/details/${row.id}`)}
            >
              {fname} {lname}
            </span>
            <small>
              {shownRoles}
              {hasMore && " ..."}
            </small>
          </div>
          <div
            style={{
              background: '#1890ff',
              color: '#fff',
              borderRadius: 6,
              padding: '4px 12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textAlign: 'center',
              userSelect: 'none',
              marginRight: 8
            }}
            onClick={() => window.handleAccessUser && window.handleAccessUser(row)}
          >
            دسترسی
          </div>
          <div
            style={{
              background: '#ff4d4f',
              color: '#fff',
              borderRadius: 6,
              padding: '4px 12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textAlign: 'center',
              userSelect: 'none',
              marginRight: 12
            }}
            onClick={() => window.handleDeleteUser && window.handleDeleteUser(row)}
          >
            حذف
          </div>
        </div>
      )
    }
  },
  {
    name: 'Email',
    sortable: true,
    minWidth: '250px',
    selector: row => row.gmail
  },
  {
    name: 'Status',
    minWidth: '120px',
    sortable: true,
    selector: row => row.active,
    cell: row => {
      const status = getStatusBadge(row.active)
      return (
        <Badge color={status.color}>
          {status.title}
        </Badge>
      )
    }
  }
]

export default ExpandableTable