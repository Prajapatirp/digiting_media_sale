import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import logoLight from "../../../src/assets/image/shiv.png";
import ParticlesAuth from "pages/AuthenticationInner/ParticlesAuth";
import { verifyOtp } from "api/usersApi";
import { OK, SUCCESS } from "Components/emus/emus";
import { toast } from "react-toastify";
import { errorHandle } from "helpers/service";
import BaseButton from "Components/Base/BaseButton";
import { userLabel } from "Components/constants/users";
import { projectTitle } from "Components/constants/common";

const EmailVerify = () => {
  document.title = userLabel.emailVerification + " | " + projectTitle;
  const location = useLocation();
  const { email } = location.state;
  const history = useNavigate();

  const [loader, setLoader] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isDisabledInput, setIsDisabledInput] = useState<boolean>(true);

  const handleInputChange = (index: any, value: any) => {
    if (value.length <= 1) {
      const newCode =
        verificationCode.substring(0, index) +
        value +
        verificationCode.substring(index + 1);
      setVerificationCode(newCode);
      if (index !== 6) {
        document.getElementById(`digit${index + 2}-input`)?.focus();
      }
      if (newCode.length > 5) {
        setIsDisabledInput(false);
      } else {
        setIsDisabledInput(true);
      }
    }
  };

  const verifyCode = (code: any) => {
    const payload = {
      email,
      otp: Number(code),
    };
    verifyOtp(payload)
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          history("/update-password", { state: { email } });
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => setLoader(false));
  };

  return (
    <ParticlesAuth>
      <div className="auth-page-wrapper">
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/dashboard" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="30" />
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="mb-4">
                      <div className="avatar-lg mx-auto">
                        <div className="avatar-title bg-light text-primary display-5 rounded-circle">
                          <i className="ri-mail-line"></i>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 mt-4">
                      <div className="text-muted text-center mb-4 mx-lg-3">
                        <h4 className="">Verify Your Email</h4>
                        <p>
                          Please enter the 6 digit code sent to{" "}
                          <span className="fw-semibold">{email}</span>
                        </p>
                      </div>
                      <Row>
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                          <Col key={index} className="col-2">
                            <div className="mb-2 shepherd-email-verify-padding">
                              <input
                                style={{padding: "inherit"}}
                                type="number"
                                className="form-control form-control-lg bg-light border-light text-center"
                                maxLength={1}
                                id={`digit${index}-input`}
                                value={verificationCode[index - 1] || ""}
                                onChange={(e) =>
                                  handleInputChange(index - 1, e.target.value)
                                }
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                      <div className="mt-3">
                        <BaseButton
                          color="success"
                          disabled={loader || isDisabledInput}
                          className="w-100"
                          type="submit"
                          loader={loader}
                          onClick={() => {
                            verifyCode(verificationCode);
                          }}
                        >
                          Confirm
                        </BaseButton>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </ParticlesAuth>
  );
};

export default EmailVerify;
