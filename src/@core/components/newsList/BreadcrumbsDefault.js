import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';

const BreadcrumbsDefault = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  if (location.pathname === '/') {
    return (
      <Breadcrumb>
        <BreadcrumbItem active>داشبورد</BreadcrumbItem>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link to="/">داشبورد</Link>
      </BreadcrumbItem>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        const readableName = name
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());

        return isLast ? (
          <BreadcrumbItem key={routeTo} active>
            {readableName}
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={routeTo}>
            <Link to={routeTo}>{readableName}</Link>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadcrumbsDefault;