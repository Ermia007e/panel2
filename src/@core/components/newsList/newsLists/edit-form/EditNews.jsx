import React from 'react'
import PageHeader from '../../common/formatDate/BreadcrumbsDefault'
import EditNewsForm from './EditNewsForm'

const EditNews = () => {
  return (
    <div>
        <PageHeader title='ویرایش اطلاعات خبر' />
        <EditNewsForm/>
    </div>
  )
}

export default EditNews
