import React from 'react'
import PageHeader from '../../common/formatDate/BreadcrumbsDefault'
import AddCategoryForm from './AddCategoryForm'

const AddCategory = () => {
  return (
    <div>
        <PageHeader title='ایجاد دسته بندی جدید' />
        <AddCategoryForm/>
    </div>
  )
}

export default AddCategory
