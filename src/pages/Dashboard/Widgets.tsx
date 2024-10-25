import { Card, CardBody, Col, Row } from "reactstrap";
import CountUp from "react-countup";

const Widgets = (countDetails: any) => {
  let countData = countDetails?.countDetails;

  return (
    <Row>
      <Col xl={4} lg={4} md={6}>
        <Card className="card-height-100">
          <CardBody>
            <div className="d-flex align-items-center">
              <div className="avatar-sm flex-shrink-0">
                <span className="avatar-title bg-info-subtle rounded fs-3">
                  <i className="bx bx-wallet text-info"></i>
                </span>
              </div>
              <div className="flex-grow-1 ps-3">
                <h5 className="text-muted text-uppercase fs-13 mb-0">
                  Total Deal
                </h5>
              </div>
            </div>
            <div className="mt-4 pt-1">
              <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                $
                <span className="counter-value">
                  <CountUp start={0} end={countData?.totalDeal || 0} />
                </span>
              </h4>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xl={4} lg={4} md={6}>
        <Card className="card-height-100">
          <CardBody>
            <div className="d-flex align-items-center">
              <div className="avatar-sm flex-shrink-0">
                <span className="avatar-title bg-info-subtle rounded fs-3">
                  <i className="bx bx-wallet text-info"></i>
                </span>
              </div>
              <div className="flex-grow-1 ps-3">
                <h5 className="text-muted text-uppercase fs-13 mb-0">
                  Open Deal
                </h5>
              </div>
            </div>
            <div className="mt-4 pt-1">
              <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                $
                <span className="counter-value">
                  <CountUp start={0} end={countData?.openDeal || 0} />
                </span>
              </h4>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xl={4} lg={4} md={6}>
        <Card className="card-height-100">
          <CardBody>
            <div className="d-flex align-items-center">
              <div className="avatar-sm flex-shrink-0">
                <span className="avatar-title bg-info-subtle rounded fs-3">
                  <i className="bx bx-wallet text-info"></i>
                </span>
              </div>
              <div className="flex-grow-1 ps-3">
                <h5 className="text-muted text-uppercase fs-13 mb-0">
                  Close Deal
                </h5>
              </div>
            </div>
            <div className="mt-4 pt-1">
              <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                $
                <span className="counter-value">
                  <CountUp start={0} end={countData?.closeDeal || 0} />
                </span>
              </h4>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Widgets;
