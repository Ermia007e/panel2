import {
  Eye,
  Send,
  Edit,
  Copy,
  Trash,
  Download,
  MoreVertical
} from 'react-feather';
import { Link } from 'react-router-dom';
import Avatar from '@components/avatar';
import { useQuery } from 'react-query';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'reactstrap';
import { getUserList } from '../../../services/api/userList/getUserList';

const columns = ({ pageNumber }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", pageNumber],
    queryFn: async () => {
      try {
        const result = await getUserList(pageNumber);
        console.log("API Response:", result);
        return Array.isArray(result) ? result : [];
      } catch (err) {
        console.error("Error fetching user list:", err);
        return [];
      }
    },
    initialData: []
  });

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطایی رخ داده است: {error.message}</p>;

  const users = Array.isArray(data) ? data : [];

  return (
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>نام</th>
          <th>نام خانوادگی</th>
          <th>ایمیل</th>
          <th>وضعیت</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>{row.fname ?? 'نام نامشخص'}</td>
              <td>{row.lname ?? 'نام خانوادگی نامشخص'}</td>
              <td>{row.gmail ?? 'ایمیل نامشخص'}</td>
              <td>
                <Badge color={row.active ? 'success' : 'danger'} pill>
                  {row.active ? 'فعال' : 'غیرفعال'}
                </Badge>
              </td>
              <td>
                <div className='column-action d-flex align-items-center'>
                  <Send className='cursor-pointer' size={17} />
                  <Link to={`/apps/invoice/preview/${row.id}`}>
                    <Eye size={17} className='mx-1' />
                  </Link>
                  <UncontrolledDropdown>
                    <DropdownToggle tag='span'>
                      <MoreVertical size={17} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem tag={Link} to={`/apps/invoice/edit/${row.id}`}>
                        <Edit size={14} className='me-50' />
                        <span className='align-middle'>ویرایش</span>
                      </DropdownItem>
                      <DropdownItem tag='a' href='/' onClick={e => e.preventDefault()}>
                        <Trash size={14} className='me-50' />
                        <span className='align-middle'>حذف</span>
                      </DropdownItem>
                      <DropdownItem tag='a' href='/' onClick={e => e.preventDefault()}>
                        <Copy size={14} className='me-50' />
                        <span className='align-middle'>کپی</span>
                      </DropdownItem>
                      <DropdownItem tag='a' href='/' onClick={e => e.preventDefault()}>
                        <Download size={14} className='me-50' />
                        <span className='align-middle'>دانلود</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">هیچ داده‌ای موجود نیست.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default columns;
