import React, { Fragment } from 'react'
import BreadCrumbs from '../../@core/components/breadcrumbs'
import DataTableWithButtons from '../../@core/components/Courses/Schedual/TableWithButtons'
// import DataTableWithButtons from '../../@core/components/Courses/Schedual/DataTableWithButtons'

const Schedual = () => {
  return (
      <Fragment>
        <BreadCrumbs
          title="لیست زمان‌بندی  "
          data={[{ title: "دوره ها" }, { title: "لیست زمان‌بندی  استاد" }]}
        />
        {/* <AppUserList /> */}
        <DataTableWithButtons />
      </Fragment>
  )
}

export default Schedual
