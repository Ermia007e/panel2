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
      navLink: '/Courses/CoursesList'
    },
    {
      id: 'YourCoursesList',
      title: 'لیست دوره های شما',
      icon: <Circle size={12} />,
      navLink: '/Courses/YourCoursesList'
    },
    {
      id: 'YourReserveCoursesList',
      title: 'لیست رزرو ',
      icon: <Circle size={12} />,
      navLink: '/Courses/YourReserveCoursesList'
    },
    {
      id: 'CreateNewCourse',
      title: 'ساخت دوره جدید ',
      icon: <Circle size={12} />,
      navLink: '/Courses/CreateNewCourse'
    },
        {
      id: 'Schedual',
      title: 'لیست زمانبندی ',
      icon: <Circle size={12} />,
      navLink: '/Courses/Schedual'
    },
  ],
},

  {
    id: "Blogs",
    title: "اخبار و مقالات",
    icon: <Airplay size={20} />,
    navLink: "/Blogs",
      children: [
    {
      id: 'BlogList',
      title: 'لیست بلاگ ها',
      icon: <Circle size={12} />,
      navLink: '/Blogs/BlogList'
    },
    {
      id: 'CreateNewBlog',
      title: 'ایجاد بلاگ جدید',
      icon: <Circle size={12} />,
      navLink: '/Blogs/CreateNewBlog'
    },
    {
      id: 'CategoryList',
      title: 'لیست دسته بندی ',
      icon: <Circle size={12} />,
      navLink: '/Blogs/CategoryList'
    },
  ]

  },
    
  {
    id: "Comments",
    title: "نظرات",
    icon: <Mail size={20} />,
    navLink: "/Comments",
          children: [
    {
      id: 'BlogsComment',
      title: 'نظرات بلاگ ها',
      icon: <Circle size={12} />,
      navLink: '/Comments/BlogsComment'
    },
    {
      id: 'CoursesCommnet',
      title: 'نظرات دوره ها',
      icon: <Circle size={12} />,
      navLink: '/Comments/CoursesCommnet'
    },

  ]
  },
];
