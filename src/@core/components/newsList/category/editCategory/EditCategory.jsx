import React from 'react'
import PageHeader from '../../common/formatDate/BreadcrumbsDefault'
import EditCategoryForm from './EditCategoryForm'

const EditCategory = () => {
  return (
    <div>
        <PageHeader title='ویرایش دسته بندی' />
        <EditCategoryForm/>
    </div>
  )
}

export default EditCategory
