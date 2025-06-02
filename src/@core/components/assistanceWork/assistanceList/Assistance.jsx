import React from 'react'
import DataTableWithButtons from './TableExpandable'
import { useQuery } from 'react-query'
import { getCourseAssistance } from '../../../../services/assistance/getCourseAssistance'
import { getAllCourseByPagination } from '../../../../services/assistance/getAllCourseByPagination';
import PageHeader from '../../newsList/common/formatDate/BreadcrumbsDefault';

const Assistance = () => {
  const { data: assistanceData, isLoading: assistanceLoading, error: assistanceError } = 
    useQuery('assistanceWork', getCourseAssistance);

  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = 
    useQuery('courses', getAllCourseByPagination, {
      select: (data) => data?.courseFilterDtos?.map(course => ({
        id: course?.courseId,
        title: course?.title,
      }))
    });

  if (assistanceLoading || coursesLoading) return <div>Loading...</div>;
  if (assistanceError) return <div>Error: {assistanceError.message}</div>;
  if (coursesError) return <div>Error: {coursesError.message}</div>;

  return (
    <div>
      <PageHeader/>
      <DataTableWithButtons 
        data={assistanceData} 
        courses={coursesData}
        coursesLoading={coursesLoading}
      />
    </div>
  );
};

export default Assistance