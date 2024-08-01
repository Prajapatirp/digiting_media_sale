import { Col, Container, Row } from "reactstrap";
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col sm={6}>{new Date().getFullYear()} © <Link to="https://shivinfotech.co/" className="text-muted" target="_blank">Shivinfotech</Link>.</Col>
          <Col sm={6}>
            <div className="text-sm-end d-none d-sm-block">
              Design & Develop by <Link to="https://shivinfotech.co/" className="text-muted" target="_blank">Shivinfotech</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
