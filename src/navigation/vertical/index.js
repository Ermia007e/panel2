import { Mail, Home, Airplay, Circle } from "react-feather";

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
    id: "Blogs",
    title: "اخبار و مقالات",
    icon: <Airplay size={20} />,
    navLink: "/Blogs",

  },
];
