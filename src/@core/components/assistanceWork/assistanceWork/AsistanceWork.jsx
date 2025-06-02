import React from 'react'
import AsistanceTable from './AsistanceTable'
import { useQuery } from 'react-query';
import { Card, CardBody, Spinner } from 'reactstrap';
import { assistanceWork } from '../../../../services/assistance/getWorkAssistance';
import PageHeader from '../../newsList/common/formatDate/BreadcrumbsDefault';

const AsistanceWork = () => {
  const { data: allWorks, isLoading, error } = useQuery({
    queryKey: ['allAssistanceWorks'],
    queryFn: assistanceWork,
  });

  if (isLoading) return (
    <Card>
      <CardBody className="text-center">
        <Spinner color="primary" />
      </CardBody>
    </Card>
  );

  if (error) return (
    <Card>
      <CardBody className="text-center text-danger">
        خطا در دریافت داده‌ها
      </CardBody>
    </Card>
  );

  return (
    <div>
      <PageHeader/>
      <AsistanceTable data={allWorks}  />
    </div>
  );
};
export default AsistanceWork