import React, { Fragment } from "react";
import BreadCrumbs from "../../@core/components/breadcrumbs";
import AppUserList from "../../@core/components/Courses/Your Courses/AppUserList";
import DataTableWithButtons from "../../@core/components/Courses/Your Courses/TableWithButtons";

const YourCoursesList = () => {
  return (
    <div>
      <Fragment>
        <BreadCrumbs
          title="لیست دوره های استاد"
          data={[{ title: "دوره ها" }, { title: "لیست دوره های استاد" }]}
        />
        {/* <AppUserList /> */}
        <DataTableWithButtons />
      </Fragment>
    </div>
  );
};

export default YourCoursesList;
