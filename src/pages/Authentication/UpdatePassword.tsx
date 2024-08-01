import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Form } from "reactstrap";
import logoLight from "../../../src/assets/image/shiv.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import ParticlesAuth from "pages/AuthenticationInner/ParticlesAuth";
import { forgotPassword } from "api/usersApi";
import { toast } from "react-toastify";
import {
  passwordRegex,
  projectTitle,
  validationMessages,
} from "Components/constants/common";
import { ACCEPTED, SUCCESS } from "Components/emus/emus";
import { userLabel } from "Components/constants/users";
import { errorHandle } from "helpers/service";
import BaseButton from "Components/Base/BaseButton";
import BaseInput from "Components/Base/BaseInput";
import { InputPlaceHolder } from "Components/constants/validation";

const UpdatePassword = () => {
  document.title = userLabel.createPassword + " | " + projectTitle;
  const history = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required(validationMessages.required(userLabel.password))
        .min(8, validationMessages.passwordLength(userLabel.password, 8))
        .matches(
          passwordRegex,
          validationMessages.passwordComplexity(userLabel.password)
        ),
      confirmPassword: Yup.string()
        .required(validationMessages.required(userLabel.confirmPassword))
        .oneOf(
          [Yup.ref("newPassword")],
          "Password and confirm password should be same."
        ),
    }),
    onSubmit: (values) => {
      const payload = {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        email,
      };
      forgotPassword(payload)
        .then((res) => {
          if (res?.statusCode === ACCEPTED && res?.status === SUCCESS) {
            history("/login");
            toast.success(res?.message);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((error) => {
          errorHandle(error);
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
                  <Link to="/#" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="40" />
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
                    <h5 className="text-primary">Create new password</h5>
                  </div>

                  <div className="p-2">
                    <Form
                      onSubmit={validation.handleSubmit}
                      action="/auth-signin-basic"
                    >
                      <div className="mb-3">
                        <BaseInput
                          label={userLabel.password}
                          name="newPassword"
                          type="password"
                          placeholder={InputPlaceHolder(userLabel.password)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.newPassword}
                          touched={validation.touched.newPassword}
                          error={validation.errors.newPassword}
                          passwordToggle={true}
                          onclick={() => setPasswordShow(!passwordShow)}
                        />
                      </div>

                      <div className="mb-3">
                        <BaseInput
                          label={userLabel.confirmPassword}
                          name="confirmPassword"
                          type={confirmPassword ? "text" : "password"}
                          placeholder={InputPlaceHolder(
                            userLabel.confirmPassword
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.confirmPassword}
                          touched={validation.touched.confirmPassword}
                          error={validation.errors.confirmPassword}
                          passwordToggle={true}
                          onclick={() => {
                            setConfirmPassword(!confirmPassword);
                          }}
                        />
                      </div>
                      <div className="mt-4">
                        <BaseButton
                          color="success"
                          disabled={loader}
                          className="w-100"
                          type="submit"
                          loader={loader}
                        >
                          Update Password
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
                    to="/auth-signin-basic"
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

export default UpdatePassword;
