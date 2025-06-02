import React from 'react'
import EditAssistanceForm from './EditAssitanseForm'
import { useQuery } from 'react-query'
import { getCourseAssistance } from '../../../../../services/assistance/getCourseAssistance'
import { getAllCourseByPagination } from '../../../../../services/assistance/getAllCourseByPagination';
import PageHeader from '../../../newsList/common/formatDate/BreadcrumbsDefault';

const Edit = () => {
  const { data: assistanceData, isLoading: isAssistanceLoading, isError: isAssistanceError } = useQuery({
    queryKey: ['assistances'],
    queryFn: getCourseAssistance
  });

  const { data: coursesData, isLoading: isCoursesLoading, isError: isCoursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourseByPagination
  });

  if (isAssistanceLoading || isCoursesLoading) return <div>در حال بارگذاری...</div>;
  if (isAssistanceError || isCoursesError) return <div>خطا در دریافت اطلاعات</div>;

  return (
    <div>
      <PageHeader/>
      <EditAssistanceForm 
        assistanceData={assistanceData} 
        coursesData={coursesData || []} 
      />
    </div>
  );
};

export default Edit
