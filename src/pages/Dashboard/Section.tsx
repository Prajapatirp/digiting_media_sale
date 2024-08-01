import { dayEnums } from 'Components/constants/common';
import React from 'react';
import { Col, Row } from 'reactstrap';

const Section = (props: any) => {

  const currentHour = new Date().getHours();
  let greeting = '';
  if (currentHour >= 0 && currentHour < 12) {
    greeting = dayEnums.GoodMorning;
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = dayEnums.GoodAfternoon;
  } else {
    greeting =dayEnums.GoodEvening;
  }

  return (
    <Row className="mb-3 pb-1">
      <Col xs={12}>
        <div className="d-flex align-items-lg-center flex-lg-row flex-column">
          <div className="flex-grow-1">
            <h4 className="fs-16 mb-1">{greeting}, Anna!</h4>
            <p className="text-muted mb-0">
              Here's what's happening with your store today.
            </p>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Section;
