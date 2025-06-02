import React, { Fragment } from "react";
import BreadCrumbs from "../../@core/components/breadcrumbs";
import AppUserList from "../../@core/components/Courses/User Courses Reserve/AppUserList";
import DataTableWithButtons from "../../@core/components/Courses/User Courses Reserve/TableWithButtons";

const UserCourseReserve = () => {
  return (
    <div>
      <Fragment>
        <BreadCrumbs
          title="لیست کاربران رزرو شده"
          data={[{ title: "دوره ها" }, { title: "لیست کاربران رزرو شده" }]}
        />
        {/* <AppUserList /> */}
        <DataTableWithButtons/>
      </Fragment>
    </div>
  );
};

export default UserCourseReserve;
