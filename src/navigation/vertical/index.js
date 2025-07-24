import { Mail, Home, Airplay, Circle, List, User } from "react-feather";


export default [


  {
    id: 'dashboard',
    title: 'داشبورد',
    icon: <Home size={20} />,
    navLink: '/dashboard/ecommerce'
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

    id: "secondPage",
    title: "کاربران",
    icon: <Mail size={20} />,
    navLink: "/second-page",

    id: "news",
    title: "اخبار و مقالات",
    icon: <Airplay size={20} />,
    navLink: "/News",
    children: [
      {
        id: "newsList",
        title: "لیست اخبار",
        icon: <List size={20} />,
        navLink: "/NewsList",
      },
      {
        id: "AddNews",
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

  {
    id: 'departments',
    title: 'دپارتمنت ها',
    icon: <Circle size={12} />,
    navLink: '/Department'
  },

  {
    id: 'building',
    title: 'بیلدینگ ها',
    icon: <Circle size={12} />,
    navLink: '/building'
  },

  {
    id: 'chat',
    title: 'چت',
    icon: <Circle size={12} />,
    navLink: '/chat'
  },

  {
    id: 'Comment',
    title: 'نظرات',
    icon: <Circle size={12} />,
    navLink: '/Comment'
  },

  {
    id: 'SecondPage',
    title: 'کاربران',
    icon: <Circle size={12} />,
    navLink: '/SecondPage'
  },
];
