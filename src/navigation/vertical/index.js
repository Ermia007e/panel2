import { Mail, Home, Airplay, Circle } from "react-feather";
import news from "./news";

<<<<<<< HEAD
// export default [
//   {
//     id: "home",
//     title: "Home",
//     icon: <Home size={20} />,
//     navLink: "/home",
//   },
//   {
//     id: "secondPage",
//     title: "Second Page",
//     icon: <Mail size={20} />,
//     navLink: "/second-page",
//   },
//   {
//     id: "smaplePage",
//     title: "Sample Page",
//     icon: <Airplay size={20} />,
//     // navLink: "/sample",
//     children: [
//       {
//         id: "invoiceList",
//         title: "List",
//         icon: <Circle size={12} />,
//         navLink: "/apps/invoice/list",
//       },
//     ],
//   },
//   // [...news]
// ];
export default [...news];
=======
export default [
  {
    id: "dashboard",
    title: "dashboard",
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
    id: "secondPage",
    title: "Second Page",
    icon: <Mail size={20} />,
    navLink: "/second-page",
  },
  {
    id: "smaplePage",
    title: "Sample Page",
    icon: <Airplay size={20} />,
  },
];
>>>>>>> ceb7c7a700f36f80be71c2b9643591c0d348821c
