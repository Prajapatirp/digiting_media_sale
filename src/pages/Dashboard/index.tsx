import { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Section from "./Section";


const Dashboard = () => {

  document.title =
    "Dashboard | DigitingMedia - React Admin & Dashboard Template";

  const [rightColumn, setRightColumn] = useState<boolean>(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col>
            <div className="h-100">
              <Section rightClickBtn={toggleRightColumn} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
