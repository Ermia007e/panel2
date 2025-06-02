import React, { Fragment } from "react";
import BreadCrumbs from "../../@core/components/breadcrumbs";
import DataTableWithButtons from "../../@core/components/Courses/CourseList/TableWithButtons";


const CoursesList = () => {
  return (
    <div>
      <Fragment>
        <BreadCrumbs
          title="لیست دوره ها"
          data={[{ title: "دوره ها" }, { title: "لیست دوره ها" }]}
        />
        {/* <AppUserList /> */}
        <DataTableWithButtons  />
      </Fragment>
    </div>
  );
};

export default CoursesList;
