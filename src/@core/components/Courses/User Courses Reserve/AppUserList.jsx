import React from "react";
import { Card, Col, Row } from "reactstrap";
import { Book, BookOpen, Table, Target, Trash, User, UserCheck, UserPlus, UserX } from "react-feather";
import StatsHorizontal from "../../widgets/stats/StatsHorizontal";


const AppUserList = () => {
  return (
    <div>
      <div className="app-user-list">
        <Row>
          <Col lg="4" sm="8">
            <StatsHorizontal
              color="primary"
              statTitle="همه ی رزرو ها"
              icon={<Book size={20} />}
              renderStats={<h3 className="fw-bolder mb-75">21,459</h3>}
            />
          </Col>
          <Col lg="4" sm="8">
            <StatsHorizontal
              color="success"
              statTitle="رزروهای تایید شده"
              icon={<BookOpen size={20} />}
              renderStats={<h3 className="fw-bolder mb-75">4,567</h3>}
            />
          </Col>
          <Col lg="4" sm="8">
            <StatsHorizontal
              color="danger"
              statTitle="رزرو های تایید نشده"
              icon={<BookOpen size={20} />}
              renderStats={<h3 className="fw-bolder mb-75">19,860</h3>}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AppUserList;
