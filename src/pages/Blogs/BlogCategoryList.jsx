import React, { Fragment } from "react";
import BreadCrumbs from "../../@core/components/breadcrumbs";
import DataTableWithButtons from "../../@core/components/Blogs/CategoryList/TableWithButtons";


const BlogCategoryList = () => {
  return (
    <div>
      <Fragment>
        <BreadCrumbs
          title="لیست دسته بندی بلاگ ها"
          data={[{ title: "بلاگ ها" }, { title: "لیست دسته بندی" }]}
        />
        {/* <AppUserList /> */}
        <DataTableWithButtons  />
      </Fragment>
    </div>
  );
};

export default BlogCategoryList;
