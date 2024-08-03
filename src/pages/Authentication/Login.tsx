import { useState } from "react";
import { Card, CardBody, Col, Container, Row, Form } from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Base/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import logoLight from "../../../src/assets/dm_img/dmLogo.png";
import { login } from "api/usersApi";
import { numberRegex, projectTitle, validationMessages } from "../../Components/constants/common";
import { labels, userLabel } from "../../Components/constants/users";
import { toast } from "react-toastify";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { OK, SUCCESS } from "Components/emus/emus";
import { errorHandle } from "helpers/service";
import BaseButton from "Components/Base/BaseButton";
import BaseInput from "Components/Base/BaseInput";
import { InputPlaceHolder } from "Components/constants/validation";
import { setItem } from "../../Components/emus/emus";

interface CustomJwtPayload extends JwtPayload {
  role: string;
  id: string;
}

const Login = () => {
  document.title = userLabel.login + " | " + projectTitle;
  const history = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      contactNo: "",
      password: "",
    },
    validationSchema: Yup.object({
      contactNo: Yup.string().required(
        validationMessages.required(userLabel.contact)
      ).matches(numberRegex, validationMessages?.contactLength(userLabel?.contact,10)),
      password: Yup.string().required(
        validationMessages.required(userLabel.password)
      ),
    }),
    onSubmit: (value) => {
      const payload = {
        contactNo: String(value.contactNo),
        password: value.password,
      };

      setLoader(true);
      login(payload)
        .then((res) => {
          if (res?.statusCode === OK && res?.status === SUCCESS) {
            setItem("authUser", res?.data?.token);
            const decode = jwtDecode<CustomJwtPayload>(res?.data?.token);
            const role = decode.role;
            const id = decode.id;
            setItem("role", role);
            setItem("id", id);
            history("/dashboard");
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
                    <img src={logoLight} alt="" height="50" width="50" />
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
                    <h5 className="text-primary">{labels.welcome}</h5>
                    <p className="text-muted">{labels.signIn}</p>
                  </div>
                  <div className="p-2 mt-4">
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                      action="#"
                    >
                      <div className="mb-3">
                        <BaseInput
                          label={userLabel.contact}
                          name="contactNo"
                          type="number"
                          placeholder={InputPlaceHolder(userLabel.contact)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.contactNo}
                          touched={validation.touched.contactNo}
                          error={validation.errors.contactNo}
                          passwordToggle={false}
                        />
                      </div>

                      <div className="mb-3">
                        <BaseInput
                          label={userLabel.password}
                          name="password"
                          type="password"
                          placeholder={InputPlaceHolder(userLabel.password)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.password}
                          touched={validation.touched.password}
                          error={validation.errors.password}
                          passwordToggle={true}
                        />
                      </div>
                      <div className="float-end mb-2">
                          <Link to="/forgot-password" className="text-muted">
                            Forgot password?
                          </Link>
                        </div>
                      <div className="mt-4">
                        <BaseButton
                          color="success"
                          disabled={loader}
                          className="w-100"
                          type="submit"
                          loader={loader}
                        >
                          Sign In
                        </BaseButton>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default withRouter(Login);
