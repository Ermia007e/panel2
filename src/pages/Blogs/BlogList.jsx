import React, { Fragment } from "react";
import BreadCrumbs from "../../@core/components/breadcrumbs";
import DataTableWithButtons from "../../@core/components/Blogs/BlogList/TableWithButtons";


const BlogList = () => {
  return (
    <div>
      <Fragment>
        <BreadCrumbs
          title="لیست بلاگ ها"
          data={[{ title: "بلاگ ها" }, { title: "لیست بلاگ ها" }]}
        />
        {/* <AppUserList /> */}
        <DataTableWithButtons  />
      </Fragment>
    </div>
  );
};

export default BlogList;
