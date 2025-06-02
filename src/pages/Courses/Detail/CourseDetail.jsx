import React, { useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from "reactstrap";
import CardEmployeesTasks from "../CardEmployeesTask";
import CardMeetup from "../CardMeetup";
import { useParams } from "react-router-dom";
import DataTableWithButtons from "./TableWithButtons";
import { getCourseDetails } from "../../../services/api/Courses";
import { useQuery } from "react-query";
import UserView from ".";

const CourseDeatil = () => {
    // const { courseId } = useParams()
    // // console.log(courseId)

    // //query
    // const { data: courseDetail } = useQuery({
    //     queryKey: ["courseDetail"],
    //     queryFn: async () => {
    //         const result = await getCourseDetails(courseId)
    //         return result
    //     },
    // });
    // console.log(courseDetail, "courseDetail")

    return (
        <div>
            <React.Fragment>
                <UserView />
            </React.Fragment>
        </div>
    );
};

export default CourseDeatil;
