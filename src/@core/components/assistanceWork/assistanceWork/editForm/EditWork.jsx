import React from 'react'
import MultipleForm from './MultipleForm'
import toast from 'react-hot-toast'
import { putAssistanceWork } from '../../../../../services/assistance/putAssistanceWork'
import { useMutation, useQuery } from 'react-query'
import {assistanceWork, assistanceWorkById} from '../../../../../services/assistance/getWorkAssistance'
import { useParams } from 'react-router-dom'
import PageHeader from '../../../newsList/common/formatDate/BreadcrumbsDefault'

const EditWork = () => {
  const { workId } = useParams();
  
  const { data: workData, isLoading, isError } = useQuery({
    queryKey: ['assistanceWork', workId],
    queryFn: () => assistanceWorkById(workId),
  });

  const { data: allWorks } = useQuery({
    queryKey: ['allAssistanceWorks'],
    queryFn: assistanceWork,
  });

  const mutation = useMutation({
    mutationFn: putAssistanceWork,
    onSuccess: () => toast.success('!کار با موفقیت به‌روزرسانی شد'),
    onError: (error) => toast.error(`خطا در به‌روزرسانی کار: ${error.message}`),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading work data</div>;

  const mappedData = {
    worktitle: workData?.worktitle || '',
    workDescribe: workData?.workDescribe || '',
    assistanceId: workData?.id || workData?.userId || '',
    workDate: workData?.workDate?.split('T')[0] || '',
    id: workData?.workId || '',
    assistanceName: workData?.assistanceName || ''
  };

  const uniqueAssistants = Array.from(new Map(
    allWorks?.map(work => [work.id, {
      id: work.id || work.userId,
      assistanceName: work.assistanceName
    }])
  ).values());

  return (
    <>
      <PageHeader/>
      <MultipleForm 
        onSubmit={(formData) => mutation.mutate(formData)}
        isSubmitting={mutation.isPending}
        initialData={mappedData}
        works={allWorks}
        assistants={uniqueAssistants}
      />
    </>
  );
};

export default EditWork