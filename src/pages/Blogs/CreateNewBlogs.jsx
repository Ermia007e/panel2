import React, { useState } from "react";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import FileUploaderMultiple from "../../@core/components/Blogs/CreateNewBlog/FileUploaderMultiple";
import PersonalInfo from "../../@core/components/Blogs/CreateNewBlog/CourseInfo";
import CourseFeature from "../../@core/components/Blogs/CreateNewBlog/CourseFeature";

import { ArrowLeft, ArrowRight } from "react-feather";

const CreateNewBlogs = () => {
  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    setActive(tab);
  };

  const nextTab = () => {
    let nextActive = parseInt(active) + 1;
    if (nextActive <= 5) {
      // Assuming 5 is the last tab
      setActive(String(nextActive));
    }
  };

  const previousTab = () => {
    let prevActive = parseInt(active) - 1;
    if (prevActive >= 1) {
      // Assuming 1 is the first tab
      setActive(String(prevActive));
    }
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
              اضافه کردن عکس بلاگ
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "2"}
              onClick={() => {
                toggle("2");
              }}
            >
              اطلاعات بلاگ
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={active === "3"}
              onClick={() => {
                toggle("3");
              }}
            >
              کلمات کلیدی موتور جستجوگر
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={active}>
          <TabPane tabId="1">
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
              <Button
                color="primary"
                className="btn-next"
                onClick={nextTab}
                disabled={active === "3"}
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
                onClick={nextTab}
                disabled={active === "3"}
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
              <Button color="success" className="btn-next">
                <span className="align-middle d-sm-inline-block d-none">
                  ساختن
                </span>
                <ArrowLeft
                  size={14}
                  className="align-middle me-sm-25 me-0"
                ></ArrowLeft>
              </Button>
            </div>
          </TabPane>
        </TabContent>
      </React.Fragment>
    </div>
  );
};

export default CreateNewBlogs;
