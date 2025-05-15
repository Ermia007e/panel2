import { Card, CardHeader, CardBody, CardTitle, CardText } from "reactstrap";
import UserTabs from "../views/user/Tabs";
import { useState } from "react";

const SecondPage = () => {
  const [active, setActive] = useState('1')

  const toggleTab = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <UserTabs active={active} toggleTab={toggleTab} />
  );
};

export default SecondPage;
