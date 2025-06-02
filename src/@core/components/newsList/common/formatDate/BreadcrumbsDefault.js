import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link, useLocation, useParams } from 'react-router-dom';

const PageHeader = ({ title, borderLeft = true }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const pathTitles = {
    '': 'داشبورد',
    'NewsList': 'لیست اخبار',
    'NewsDetails': 'جزئیات خبر',
    'EditNews': 'ویرایش اطلاعات اخبار',
    'AddNews': 'ایجاد خبر جدید',
    'CategoryList': 'دسته‌بندی‌ها',
    'AddCategory': 'ایجاد دسته بندی جدید',
    'EditCategory': 'ویرایش دسته بندی',
    'AssistanceList': 'لیست استادیار ها',
    'Edit': 'ویرایش',
    'AsistanceWork': 'وظایف استادیارها',
    'EditWork': 'ویرایش'
  };

  const getTitle = (path) => pathTitles[path] || path;

  return (
    <div className="d-flex pb-1 align-items-center">
      <h2 
        className="fw-medium text-secondary pe-3 me-2 mb-0" 
        style={{ 
          borderLeft: borderLeft ? "2px solid #e0e0e0" : "none", 
          display: "inline-block",
          paddingLeft: "10px"
        }}
      >
        {title}
      </h2>
      
      <Breadcrumb className="mb-0">
        <BreadcrumbItem>
          <Link to="/">داشبورد</Link>
        </BreadcrumbItem>

        {pathnames[0] === 'NewsDetails' ? (
          <>
            <BreadcrumbItem>
              <Link to="/NewsList">اخبار</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              جزئیات خبر
            </BreadcrumbItem>
          </>
        ) : pathnames[0] === 'EditNews' ? (
          <>
            <BreadcrumbItem>
              <Link to="/NewsList">اخبار</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              ویرایش خبر
            </BreadcrumbItem>
          </>
        ) : pathnames[0] === 'AddCategory' ? (
          <>
            <BreadcrumbItem>
              <Link to="/CategoryList">دسته‌بندی‌ها</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              ایجاد دسته بندی جدید
            </BreadcrumbItem>
          </>
        ) : pathnames[0] === 'EditCategory' ? (
          <>
            <BreadcrumbItem>
              <Link to="/CategoryList">دسته‌بندی‌ها</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              ویرایش دسته بندی
            </BreadcrumbItem>
          </>
        ) : pathnames[0] === 'Edit' && pathnames.length > 1 ? (
          <>
            <BreadcrumbItem>
              <Link to="/AssistanceList">لیست استادیار ها</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              ویرایش
            </BreadcrumbItem>
          </>
        ) : pathnames[0] === 'AsistanceWork' ? (
          <>
          
            <BreadcrumbItem active>
            وظایف استادیارها
            </BreadcrumbItem>
          </>
        ) : pathnames[0] === 'EditWork' && pathnames.length > 1 ? (
          <>
            <BreadcrumbItem>
              <Link to="/AsistanceWork">وظایف استادیارها
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              ویرایش
            </BreadcrumbItem>
          </>
        ) : (
          pathnames.map((path, index) => {
            if (!isNaN(path)) return null;
            
            return (
              <BreadcrumbItem key={index} active={index === pathnames.length - 1}>
                {index === pathnames.length - 1 ? (
                  getTitle(path)
                ) : (
                  <Link to={`/${pathnames.slice(0, index + 1).join('/')}`}>
                    {getTitle(path)}
                  </Link>
                )}
              </BreadcrumbItem>
            );
          })
        )}
      </Breadcrumb>
    </div>
  );
};

export default PageHeader;