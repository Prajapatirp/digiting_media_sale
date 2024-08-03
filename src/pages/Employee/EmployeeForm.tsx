import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Form, Row } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RequiredField } from "Components/constants/requireMsg";
import { InputPlaceHolder } from "Components/constants/validation";
import {
  emailRegex,
  numberRegex,
  passwordRegex,
  roleEnums,
  validationMessages,
} from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect } from "Components/Base/BaseSelect";
import BaseButton from "Components/Base/BaseButton";
import { employeeLabel, roleType } from "Components/constants/employee";
import { userLabel } from "Components/constants/users";
import { ButtonEnums, CREATED, SUCCESS } from "Components/emus/emus";
import { dynamicFind } from "helpers/service";
import { register, updateProfile } from "api/usersApi";
import { toast } from "react-toastify";

type SelectedOption = { label: string; value: string };
type Payload = {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  role: string;
  phone_no: string;
  password?: string;
  confirmPassword?: string;
};

const EmployeeForm = ({ getInitialValues, updatedUser }: any) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<boolean>(false);
  const [isRole, setIsRole] = useState<string>(roleEnums.Dealer);
  let getInitialValue = getInitialValues;

  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: getInitialValue || {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      contact_no: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(RequiredField(employeeLabel.firstName)),
      lastName: Yup.string().required(RequiredField(employeeLabel.lastName)),
      middleName: Yup.string().required(
        RequiredField(employeeLabel.middleName)
      ),
      email: Yup.string()
        .email(validationMessages.format(userLabel.email))
        .matches(emailRegex, validationMessages.format(userLabel.email)),
      contact_no: Yup.string()
        .required(validationMessages.required(userLabel.contact))
        .matches(
          numberRegex,
          validationMessages.contactLength(userLabel.contact, 10)
        ),
      password:
        getInitialValues === null
          ? isRole === roleEnums.Dealer
            ? Yup.string()
                .required(validationMessages.required(userLabel.password))
                .min(
                  8,
                  validationMessages.passwordLength(userLabel.password, 8)
                )
                .matches(
                  passwordRegex,
                  validationMessages.passwordComplexity(userLabel.password)
                )
            : Yup.string().optional()
          : Yup.string(),
      confirmPassword:
        getInitialValues === null
          ? isRole === roleEnums.Dealer
            ? Yup.string()
                .required(
                  validationMessages.required(userLabel.confirmPassword)
                )
                .oneOf(
                  [Yup.ref("password")],
                  "Password and confirm password should be same."
                )
            : Yup.string().optional()
          : Yup.string(),
      role: Yup.string().required(RequiredField(employeeLabel.Role)),
    }),
    onSubmit: (values, { resetForm }) => {
      let payload: Payload;
      payload = {
        first_name: values.firstName,
        last_name: values.lastName,
        middle_name: values.middleName,
        email: values.email,
        role: values.role,
        password: values.password,
        phone_no: String(values.contact_no),
      };

      if (getInitialValue?.id) {
        updateProfile(getInitialValue?.id, payload)
          .then((res) => {
            setLoader(true);
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
              resetForm();
              resetData();
              updatedUser();
            } else {
              toast.error(res?.message);
            }
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message) ||
              toast.error(error?.message);
          })
          .finally(() => {
            setLoader(false);
          });
      } else {
        register(payload)
          .then((res) => {
            setLoader(true);
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
              resetForm();
              resetData();
              updatedUser();
            } else {
              toast.error(res?.message);
            }
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message) ||
              toast.error(error?.message);
          })
          .finally(() => {
            setLoader(false);
          });
      }
    },
  });

  const resetData = () => {
    validation.setFieldValue("role", null);
    validation.initialValues.firstName = "";
    validation.initialValues.lastName = "";
    validation.initialValues.middleName = "";
    validation.initialValues.contact_no = "";
    validation.initialValues.email = "";
  };

  useEffect(() => {
    setIsRole(getInitialValue?.role || roleEnums?.Dealer);
  }, [getInitialValues]);

  return (
    <Row>
      <Col lg={12}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}>
          <Card>
            <CardHeader>
              <h5 className="card-title mb-0">
                {getInitialValue?.id
                  ? employeeLabel.EditEmployee
                  : employeeLabel.AddEmployee}
              </h5>
            </CardHeader>
            {loader && <Loader />}
            <CardBody className="mb-0 pb-0">
              <div className="mb-3">
                <Row className="mb-2">
                  <Col lg={4} md={4} sm={6} className="mb-2">
                    <BaseInput
                      name="firstName"
                      type="text"
                      placeholder={InputPlaceHolder(employeeLabel.firstName)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.firstName}
                      touched={validation.touched.firstName}
                      error={validation.errors.firstName}
                      passwordToggle={false}
                    />
                  </Col>
                  <Col lg={4} md={4} sm={6} className="mb-2">
                    <BaseInput
                      name="middleName"
                      type="text"
                      placeholder={InputPlaceHolder(employeeLabel.middleName)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.middleName}
                      touched={validation.touched.middleName}
                      error={validation.errors.middleName}
                      passwordToggle={false}
                    />
                  </Col>
                  <Col lg={4} md={4} sm={6} className="mb-2">
                    <BaseInput
                      name="lastName"
                      type="text"
                      placeholder={InputPlaceHolder(employeeLabel.lastName)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.lastName}
                      touched={validation.touched.lastName}
                      error={validation.errors.lastName}
                      passwordToggle={false}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg={4} md={4} sm={6} className="mb-2">
                    <BaseInput
                      name="contact_no"
                      type="number"
                      placeholder={InputPlaceHolder(employeeLabel.ContactNo)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.contact_no}
                      touched={validation.touched.contact_no}
                      error={validation.errors.contact_no}
                      passwordToggle={false}
                      onKeyPress={() => {
                        if (validation.value.contact_no.length == 10)
                          return false;
                      }}
                    />
                  </Col>
                  <Col lg={4} md={4} sm={12} className="mb-2">
                    <BaseInput
                      name="email"
                      type="text"
                      placeholder={InputPlaceHolder(employeeLabel.Email)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.email}
                      touched={validation.touched.email}
                      error={validation.errors.email}
                      passwordToggle={false}
                    />
                  </Col>
                  <Col className="mb-2" lg={4} md={4} sm={12}>
                    <BaseSelect
                      name="role"
                      className="select-border"
                      options={roleType}
                      placeholder={InputPlaceHolder(employeeLabel.Role)}
                      handleChange={(selectedOption: SelectedOption) => {
                        validation.setFieldValue(
                          "role",
                          selectedOption?.value || ""
                        );
                        setIsRole(selectedOption?.value);
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(roleType, validation.values.role) || ""
                      }
                      touched={validation.touched.role}
                      error={validation.errors.role}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg={4} className="mb-2">
                    <BaseInput
                      name="password"
                      type="password"
                      placeholder={InputPlaceHolder(userLabel.password)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.password}
                      touched={validation.touched.password}
                      error={validation.errors.password}
                      passwordToggle={true}
                      onclick={() => setPasswordShow(!passwordShow)}
                      disabled={getInitialValues === null ? false : true}
                    />
                  </Col>
                  <Col lg={4} className="mb-2">
                    <BaseInput
                      name="confirmPassword"
                      type={confirmPassword ? "text" : "password"}
                      placeholder={InputPlaceHolder(userLabel.confirmPassword)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.confirmPassword}
                      touched={validation.touched.confirmPassword}
                      error={validation.errors.confirmPassword}
                      passwordToggle={true}
                      onclick={() => {
                        setConfirmPassword(!confirmPassword);
                      }}
                      disabled={getInitialValues === null ? false : true}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex align-items-end justify-content-end">
                    <BaseButton
                      disabled={loader}
                      type="submit"
                      className="btn btn-success w-sm">
                      {ButtonEnums.Submit}
                    </BaseButton>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Form>
      </Col>
    </Row>
  );
};

export default EmployeeForm;
