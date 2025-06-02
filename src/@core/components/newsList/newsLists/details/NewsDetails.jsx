import React from 'react'
import BlogDetails from './index'
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { getBlogDetails } from '../../../../../services/api/newList/getNewsDetails';
import PageHeader from '../../common/formatDate/BreadcrumbsDefault';

const NewsDetails = () => {
  const { detailId } = useParams();
  const id = detailId
  
  const { data: newsDetails, isLoading, error } = useQuery(
    ['newsDetails', id],
    () => getBlogDetails(id)
  );

  if (isLoading) return <Spinner color='primary' />;
  if (error) return <div>Error loading news details</div>;
  return (
    <div>
        <PageHeader title='جزئیات اخبار' />
      {newsDetails && <BlogDetails newsDetails={newsDetails} detailId={detailId} />}
    </div>
  );
};

export default NewsDetails;