// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";

// ** Utils
import { isObjEmpty } from "@utils";
import Courses from "../../pages/Courses/CoursesList";
import YourCoursesList from "../../pages/Courses/YourCoursesList";
import UserCourseReserve from "../../pages/Courses/UserCourseReserve";
import CreateNewCourses from "../../pages/Courses/CreateNewCourses";
import CourseDeatil from "../../pages/Courses/Detail/CourseDetail";
import BlogList from "../../pages/Blogs/BlogList";
import CreateNewBlogs from "../../pages/Blogs/CreateNewBlogs";
import BlogCategoryList from "../../pages/Blogs/BlogCategoryList";
import Schedual from "../../pages/Schedual/Schedual";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Bahr React Admin Template";

// ** Default Route
const DefaultRoute = "/login";

const Dashboard = lazy(() => import("../../pages/Dashboard"));
const SecondPage = lazy(() => import("../../pages/SecondPage"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const ForgotPassword = lazy(() => import("../../pages/ForgotPassword"));
const Error = lazy(() => import("../../pages/Error"));
const EditUser = lazy(() => import("../../views/user/AllUsers/EditUser"));
const UserDetails = lazy(() => import('../../views/user/AllUsers/UserDetails'))
const Comment = lazy(() => import('../../views/Comment/Comment'))
const DashboardAnalytics = lazy(() => import('../../views/dashboard/analytics'))
const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))

const Sample = lazy(() => import("../../pages/Sample"));

const AddNews = lazy(()=> import("../../views/AddNews/AddNews"))
const Department = lazy(()=> import("../../views/Dpartment/Department"))
const Building = lazy(()=>import("../../views/building/Building"))
const Chat = lazy(()=>import("../../views/ChatWithTeachers/chat"))

const NewsList = lazy(() => import('../../@core/components/newsList/newsLists/NewsList'));
const NewsDetails = lazy(() => import('../../@core/components/newsList/newsLists/details/NewsDetails'));
const EditNews = lazy(() => import('../../@core/components/newsList/newsLists/edit-form/EditNews'));
const AddNews1 = lazy(() => import('../../@core/components/newsList/addNews/AddNews'));
const CategoryList = lazy(() => import('../../@core/components/newsList/category/CategoryList'));
const AddCategory = lazy(() => import('../../@core/components/newsList/category/addCategory/AddCategory'));
const EditCategory = lazy(() => import('../../@core/components/newsList/category/editCategory/EditCategory'));
const Assistance = lazy(() => import('../../@core/components/assistanceWork/assistanceList/Assistance'));
const AsistanceWork = lazy(() => import('../../@core/components/assistanceWork/assistanceWork/AsistanceWork'));
const EditWork = lazy(() => import('../../@core/components/assistanceWork/assistanceWork/editForm/EditWork'));
const Edit = lazy(() => import('../../@core/components/assistanceWork/assistanceList/editForm/Edit'));
 

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "/Dashboard",
    element: <Dashboard />,
  },
    {
    path: "/chat",
    element: <Chat />,
  },
    {
    path: "/building",
    element: <Building />,
  },
    {
    path: "/Department",
    element: <Department />,
  },
  {
  path: "/users/details/:id",
  element: <UserDetails />
},
  {
    path:"/users/edit/:id",
    element:<EditUser />,
  },
    {
    path:"/AddNews",
    element:<AddNews />,
  },
    {
    path:"/Comment",
    element:<Comment />,
  },
  {
    path: '/dashboard/analytics',
    element: <DashboardAnalytics />
  },
  {
    path: '/dashboard/ecommerce',
    element: <DashboardEcommerce />
  },
  {
    path: "/Courses/CoursesList",
    element: <Courses />,
  },
  
  {
    path: "/Courses/YourCoursesList",
    element: <YourCoursesList />,
  },
  {
    path: "/Courses/YourReserveCoursesList",
    element: <UserCourseReserve />,
  },
  {
    path: "/course-details/:courseId?",
    element: <CourseDeatil/>,
  },
  {
    path: "/Courses/CreateNewCourse",
    element: <CreateNewCourses />,
  },
    {
    path: "/Courses/Schedual",
    element: <Schedual />,
  },
    {
    path: "/Blogs/BlogList",
    element: <BlogList />,
  },
  {
    path: "/Blogs/CreateNewBlog",
    element: <CreateNewBlogs/>,
  },
  {
    path: "/Blogs/CategoryList",
    element: <BlogCategoryList />,
  },

  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "*",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/NewsList",
    element: <NewsList />,
  },
  {
    path: "/NewsDetails/:detailId",
    element: <NewsDetails/>,
  },
  {
    path: "/EditNews/:editId",
    element: <EditNews/>,
  },
  {
    path: "/AddNews1",
    element: <AddNews1 />,
  },
  {
    path: "/CategoryList",
    element: <CategoryList />,
  },
  {
    path: "/AddCategory",
    element: <AddCategory />,
  },
  {
    path: "/EditCategory/:categoryId",
    element: <EditCategory />,
  },
  {
    path: "/AssistanceList",
    element: <Assistance />,
  },
  {
    path: "/AsistanceWork",
    element: <AsistanceWork />,
  },
  {
    path: "/EditWork/:workId",
    element: <EditWork/>,
  },
  {
    path: "/Edit/:id",
    element: <Edit/>,
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
              LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
