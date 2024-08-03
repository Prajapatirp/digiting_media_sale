import { Row, Col, Alert, Card, CardBody, Container, Form } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Base/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import logoLight from "../../../src/assets/dm_img/dmLogo.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { userLabel } from "Components/constants/users";
import { emailRegex, projectTitle, validationMessages } from "Components/constants/common";
import { sendOtp } from "api/usersApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { OK, SUCCESS } from "Components/emus/emus";
import { errorHandle } from "helpers/service";
import BaseButton from "Components/Base/BaseButton";
import BaseInput from "Components/Base/BaseInput";
import { InputPlaceHolder } from "Components/constants/validation";

const ForgetPasswordPage = () => {
  document.title = userLabel.forgotPassword + " | " + projectTitle;
  const history = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);
  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(validationMessages.format(userLabel.email))
        .matches(emailRegex, validationMessages.format(userLabel.email))
        .required(validationMessages.required(userLabel.email)),
    }),
    onSubmit: (values) => {
      setLoader(true);
      sendOtp(values)
        .then((res) => {
          if (res?.statusCode === OK && res?.status === SUCCESS) {
            history("/email-verify", { state: { email: values?.email } });
            toast.success(res?.message);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((error) => {
          errorHandle(error);
          setLoader(false);
        })
        .finally(() => setLoader(false));
    },
  });

  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
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
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Forgot Password?</h5>
                    <i className="ri-mail-send-line display-5 text-success mb-3"></i>
                  </div>
                  <Alert
                    className="border-0 alert-warning text-center mb-2 mx-2"
                    role="alert"
                  >
                    Enter your email and instructions will be sent to you!
                  </Alert>
                  <div className="p-2">
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-4">
                        <BaseInput
                          label={userLabel.email}
                          name="email"
                          type="email"
                          placeholder={InputPlaceHolder(userLabel.email)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.email}
                          touched={validation.touched.email}
                          error={validation.errors.email}
                          passwordToggle={false}
                        />
                      </div>

                      <div className="text-center mt-4">
                        <BaseButton
                          color="success"
                          disabled={loader}
                          className="w-100"
                          type="submit"
                          loader={loader}
                        >
                          Send Otp
                        </BaseButton>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-4 text-center">
                <p className="mb-0">
                  Wait, I remember my password...{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    {" "}
                    Click here{" "}
                  </Link>{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default withRouter(ForgetPasswordPage);
