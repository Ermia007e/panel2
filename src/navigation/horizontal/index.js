import { Mail, Home } from "react-feather";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "secondPage",
    title: "کاربران",
    icon: <Mail size={20} />,
    navLink: "/second-page",
  },
];
