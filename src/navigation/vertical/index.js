import { Mail, Home, Airplay, Circle, List, User } from "react-feather";


export default [
  {
    id: "dashboard",
    title: "داشبورد",
    icon: <Home size={20} />,
    navLink: "/dashboard",
    children: [
      {
        id: 'analyticsDash',
        title: 'Analytics',
        icon: <Circle size={12} />,
        navLink: '/dashboard/analytics'
      },
      {
        id: 'eCommerceDash',
        title: 'eCommerce',
        icon: <Circle size={12} />,
        navLink: '/dashboard/ecommerce'
      }
    ],
  },
{
  id: "Courses",
  title: "دوره ها",
  icon: <Home size={20} />,
  navLink: "/Courses",
  children: [
    {
      id: 'CoursesList',
      title: 'لیست دوره ها',
      icon: <Circle size={12} />,
      navLink: '/dashboard/CoursesList'
    },
    {
      id: 'YourCoursesList',
      title: 'لیست دوره های شما',
      icon: <Circle size={12} />,
      navLink: '/dashboard/YourCoursesList'
    },
    {
      id: 'YourReserveCoursesList',
      title: 'لیست رزرو ',
      icon: <Circle size={12} />,
      navLink: '/dashboard/YourReserveCoursesList'
    },
    {
      id: 'CreateNewCourse',
      title: 'ساخت دوره جدید ',
      icon: <Circle size={12} />,
      navLink: '/dashboard/CreateNewCourse'
    },
  ],
},
  {
    id: "Comments",
    title: "نظرات",
    icon: <Mail size={20} />,
    navLink: "/Comments",
  },
  {
    id: "news",
    title: "اخبار و مقالات",
    icon: <Airplay size={20} />,
    navLink: "/News",
    children: [
      {
        id: "newsList",
        title: "لیست اخبار",
        icon: <List size={20}/>,
        navLink: "/NewsList",
      },
      {
        id: "addNews",
        title: "ایجاد اخبار جدید",
        icon: <List size={20} />,
        navLink: "/AddNews",
      },
      {
        id: "categoryList",
        title: "لیست دسته بندی",
        icon: <List size={20} />,
        navLink: "/CategoryList"
      },
    ],
  },
  {
    id: "assistans",
    title: "استادیاران",
    icon: <User size={20} />,
    navLink: "/Assistance",
    children: [
      {
        id: "assistansList",
        title: "فهرست استادیاران",
        icon: <User size={20} />,
        navLink: "/AssistanceList",
       
      },
      {
        id: "assistansWork",
        title: " وظایف استادیاران",
        icon: <User size={20} />,
        navLink: "/AsistanceWork",
       
      },
    ]
  },
];
