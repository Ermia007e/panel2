import React, { useState } from "react";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import FileUploaderMultiple from "../../@core/components/Courses/CreateCourses/FileUploaderMultiple";
import PersonalInfo from "../../@core/components/Courses/CreateCourses/CourseInfo";
import CourseFeature from "../../@core/components/Courses/CreateCourses/CourseFeature";
import CourseDetail from "../../@core/components/Courses/CreateCourses/CourseDetail";
import CourseTech from "../../@core/components/Courses/CreateCourses/CourseTech";
import { ArrowLeft, ArrowRight } from "react-feather";
import { useMutation, useQueryClient } from "react-query";
import {
  CreateCourse,
  CreateCourseStep3,
} from "../../services/api/Create-Course/CreateCourse";
import useCourseStore from "../../zustand/useCourseStore ";
import { formDataModifire } from "../../utility/formDataModifire";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import generateUniqueString from '../../utility/generateUniqueString'


const CreateNewCourses = () => {
  const {
    title,
    describe,
    miniDescribe,
    unitPerCost,
    capacity,
    sessionNumber,
    cost,
    uniqeUrlString,
    image,
    startTime,
    endTime,
    googleSchema,
    googleTitle,
    coursePrerequisiteId,
    currentCoursePaymentNumber,
    shortLink,
    tumbImageAddress,
    imageAddress,
    courseTypeId,
    courseLvlId,
    classId,
    teacherId,
    tremId,
    techId,
    setTechId,
  } = useCourseStore();
  const client = useQueryClient();

  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    setActive(tab);
  };

  const nextTab = () => {
    let nextActive = parseInt(active) + 1;
    if (nextActive <= 5) {
      setActive(String(nextActive));
    }
  };

  const previousTab = () => {
    let prevActive = parseInt(active) - 1;
    if (prevActive >= 1) {
      setActive(String(prevActive));
    }
  };

  const mutation = useMutation({
    mutationFn: CreateCourse,
    onSuccess: () => {
      toast.success("دوره شما ثبت شد");
      client.invalidateQueries({ queryKey: ["yourCourses"] });
      nextTab();
    },
    onError: () => {
      toast.error("خطا");
    },
  });

const uniqueStr = generateUniqueString();


  const createStep2 = () => {
    const obj = {
      title,
      describe,
      miniDescribe,
      unitPerCost,
      capacity,
      sessionNumber,
      cost,
      uniqeUrlString: uniqueStr,
      image,
      startTime,
      endTime,
      googleSchema: uniqueStr,
      googleTitle: uniqueStr,
      CoursePrerequisiteId: uuidv4(),
      currentCoursePaymentNumber: Math.floor(Math.random() * 1000000),
      shortLink,
      tumbImageAddress,
      imageAddress,
      //feature
      courseTypeId,
      courseLvlId,
      classId,
      teacherId,
      tremId,
      
    };
    const formData = formDataModifire(obj);
    mutation.mutate(formData);
  };

  const createCourseStep3 = useMutation({
    mutationFn: (data) => {
      const res = CreateCourseStep3(data);
      return res;
    },
    onSuccess: () => {
      toast.success("دوره شما ثبت شد");
      client.invalidateQueries({ queryKey: ["yourCourses"] });
      nextTab();
    },
    onError: () => {
      toast.error("خطا");
    },
  });

  const createStep3 = () => {
    createCourseStep3.mutate({ techId: techId , courseId:uuidv4() });
    setTechId(techId);
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
              اطلاعات دوره
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "2"}
              onClick={() => {
                toggle("2");
              }}
            >
              {" "}
              ویژگی های دوره
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "3"}
              onClick={() => {
                toggle("3");
              }}
            >
              {" "}
              توضیحات دوره
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "4"}
              onClick={() => {
                toggle("4");
              }}
            >
              {" "}
              تکنولوژی های دوره
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "5"}
              onClick={() => {
                toggle("5");
              }}
            >
              {" "}
              اضافه کردن عکس دوره
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={active}>
          <TabPane tabId="1">
            <PersonalInfo />

            <div className="d-flex justify-content-between">
              <Button
                color="primary"
                className="btn-prev"
                onClick={previousTab}
                disabled={active === "1"}
              >
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>

                <span className="align-middle d-sm-inline-block d-none">
                  قبلی
                </span>
              </Button>
              <Button
                color="primary"
                className="btn-next"
                onClick={() => {
                  nextTab();
                }}
                disabled={active === "5"}
              >
                <span className="align-middle d-sm-inline-block d-none">
                  بعدی
                </span>
                <ArrowLeft
                  size={14}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
              </Button>
            </div>
          </TabPane>
          <TabPane tabId="2">
            <CourseFeature />
            <div className="d-flex justify-content-between">
              <Button
                color="primary"
                className="btn-prev"
                onClick={previousTab}
                disabled={active === "1"}
              >
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>

                <span className="align-middle d-sm-inline-block d-none">
                  قبلی
                </span>
              </Button>
              <Button
                color="primary"
                className="btn-next"
                onClick={() => {
                  nextTab();
                }}
                disabled={active === "5"}
              >
                <span className="align-middle d-sm-inline-block d-none">
                  بعدی
                </span>
                <ArrowLeft
                  size={14}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
              </Button>
            </div>
          </TabPane>
          <TabPane tabId="3">
            <CourseDetail />
            <div className="d-flex justify-content-between">
              <Button
                color="primary"
                className="btn-prev"
                onClick={previousTab}
                disabled={active === "1"}
              >
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>

                <span className="align-middle d-sm-inline-block d-none">
                  قبلی
                </span>
              </Button>
              <Button
                color="primary"
                className="btn-next"
                onClick={nextTab}
                disabled={active === "5"}
              >
                <span className="align-middle d-sm-inline-block d-none">
                  بعدی
                </span>
                <ArrowLeft
                  size={14}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
              </Button>
            </div>
          </TabPane>
          <TabPane tabId="4">
            <CourseTech />
            <div className="d-flex justify-content-between">
              <Button
                color="primary"
                className="btn-prev"
                onClick={previousTab}
                disabled={active === "1"}
              >
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>

                <span className="align-middle d-sm-inline-block d-none">
                  قبلی
                </span>
              </Button>
              <Button
                color="primary"
                className="btn-next"
                onClick={() => {
                  createStep3();
                }}
                disabled={active === "5"}
              >
                <span className="align-middle d-sm-inline-block d-none">
                  بعدی
                </span>
                <ArrowLeft
                  size={14}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
              </Button>
            </div>
          </TabPane>
          <TabPane tabId="5">
            <FileUploaderMultiple />

            <div className="d-flex justify-content-between">
              <Button
                color="primary"
                className="btn-prev"
                onClick={previousTab}
                disabled={active === "1"}
              >
                <ArrowRight
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></ArrowRight>

                <span className="align-middle d-sm-inline-block d-none">
                  قبلی
                </span>
              </Button>
              <Button color="success" className="btn-next" onClick={()=>{
                createStep2();
              }}>
                <span className="align-middle d-sm-inline-block d-none">
                  ساختن دوره
                </span>
              </Button>
            </div>
          </TabPane>
        </TabContent>
      </React.Fragment>
    </div>
  );
};

export default CreateNewCourses;
