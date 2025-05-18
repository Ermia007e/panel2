import React, { useState } from "react";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import ImageModal from "../../@core/components/Courses/CreateCourses/ImageModal";
import FileUploaderMultiple from "../../@core/components/Courses/CreateCourses/FileUploaderMultiple";
import PersonalInfo from "../../@core/components/Courses/CreateCourses/CourseInfo";
import CourseFeature from "../../@core/components/Courses/CreateCourses/CourseFeature";
import CourseDetail from "../../@core/components/Courses/CreateCourses/CourseDetail";
import CourseTech from "../../@core/components/Courses/CreateCourses/CourseTech";
import { ArrowLeft, ArrowRight } from "react-feather";

const CreateNewCourses = () => {
  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    setActive(tab);
  };
  return (
    <div>
      <React.Fragment>
        <Nav pills>
          <NavItem>
            <NavLink
              active={active === "1"}
              onClick={() => {
                toggle("1");
              }}
            >
              اضافه کردن عکس دوره
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "2"}
              onClick={() => {
                toggle("2");
              }}
            >
              اطلاعات دوره
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "3"}
              onClick={() => {
                toggle("3");
              }}
            >
              ویژگی های دوره
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "4"}
              onClick={() => {
                toggle("4");
              }}
            >
              توضیحات دوره
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "5"}
              onClick={() => {
                toggle("5");
              }}
            >
              تکنولوژی های دوره
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={active}>
          <TabPane tabId="1">
            <FileUploaderMultiple />
          </TabPane>
          <TabPane tabId="2">
            <PersonalInfo />
          </TabPane>
          <TabPane tabId="3">
            <CourseFeature />
          </TabPane>
          <TabPane tabId="4">
            <CourseDetail />
          </TabPane>
                    <TabPane tabId="5">
            <CourseTech />
          </TabPane>
          <div className='d-flex justify-content-between'>
          <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button color='primary' className='btn-next' onClick={() => stepper.next()}>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
        </TabContent>
      </React.Fragment>
    </div>
  );
};

export default CreateNewCourses;
