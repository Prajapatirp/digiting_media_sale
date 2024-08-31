import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Row,
  Container,
} from "reactstrap";
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
import { Link } from "react-router-dom";
import { dealKey, dealLabel } from "Components/constants/deal";

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

const FormListOfDeal = ({ getInitialValues, updatedUser }: any) => {
  const [loader, setLoader] = useState<boolean>(false);
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
    <div className="page-content">
      <Container>
        {" "}
        <Row>
          <Col lg={12}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    {getInitialValue?.id
                      ? employeeLabel.EditEmployee
                      : employeeLabel.AddEmployee}
                  </h5>
                  <Link
                    to="/deal"
                    type="submit"
                    className="btn btn-success ms-auto right w-sm">
                    Back
                  </Link>
                </CardHeader>
                {loader && <Loader />}
                <CardBody className="mb-0 pb-0">
                  <div className="mb-3">
                    <Row className="mb-2">
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Company_name}
                          name="company_name"
                          type="text"
                          placeholder={InputPlaceHolder(dealLabel.Company_name)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.company_name}
                          touched={validation.touched.company_name}
                          error={validation.errors.company_name}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Customer_name}
                          name={dealLabel.Customer_name}
                          type="text"
                          placeholder={InputPlaceHolder(
                            dealLabel.Customer_name
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.customer_name}
                          touched={validation.touched.customer_name}
                          error={validation.errors.customer_name}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                      <BaseInput
                      label={dealLabel.Owner_mobile}
                      name="owner_mobile"
                      type="number"
                      placeholder={InputPlaceHolder(dealLabel.Owner_mobile)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.owner_mobile}
                      touched={validation.touched.owner_mobile}
                      error={validation.errors.owner_mobile}
                      passwordToggle={false}
                      onKeyPress={() => {
                        if (validation.value.owner_mobile.length == 10)
                          return false;
                      }}
                    />
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Inquire_number}
                          name="inquiry_number"
                          type="number"
                          placeholder={InputPlaceHolder(
                            dealLabel.Inquire_number
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.inquiry_number}
                          touched={validation.touched.inquiry_number}
                          error={validation.errors.inquiry_number}
                          passwordToggle={false}
                          onKeyPress={() => {
                            if (validation.value.inquiry_number.length == 10)
                              return false;
                          }}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={12} className="mb-2">
                        <BaseInput
                          label={dealLabel.Email}
                          name="email"
                          type="text"
                          placeholder={InputPlaceHolder(dealLabel.Email)}
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
                          label="Role"
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
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.PinCode}
                          name={dealKey.PinCode}
                          type="number"
                          placeholder={InputPlaceHolder(dealLabel.PinCode)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.pin_code}
                          touched={validation.touched.pin_code}
                          error={validation.errors.pin_code}
                          passwordToggle={false}
                          onKeyPress={() => {
                            if (validation.value.pin_code.length == 6)
                              return false;
                          }}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Contract_start_date}
                          name="contract_date"
                          type="text"
                          placeholder={InputPlaceHolder(
                            dealLabel.Contract_start_date
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.contract_date}
                          touched={validation.touched.contract_date}
                          error={validation.errors.contract_date}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Contract_end_date}
                          name={dealLabel.Contract_end_date}
                          type="text"
                          placeholder={InputPlaceHolder(
                            dealLabel.Contract_end_date
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.contract_end_date}
                          touched={validation.touched.contract_end_date}
                          error={validation.errors.contract_end_date}
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Package}
                          name="package_id"
                          type="text"
                          placeholder={InputPlaceHolder(dealLabel.Package)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.package_id}
                          touched={validation.touched.package_id}
                          error={validation.errors.package_id}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Month}
                          name="month"
                          type="text"
                          placeholder={InputPlaceHolder(dealLabel.Month)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.month}
                          touched={validation.touched.month}
                          error={validation.errors.month}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Payment}
                          name="payment"
                          type="text"
                          placeholder={InputPlaceHolder(dealLabel.Payment)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.payment}
                          touched={validation.touched.payment}
                          error={validation.errors.payment}
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Customer_address}
                          name="address"
                          type="text"
                          placeholder={InputPlaceHolder(
                            dealLabel.Customer_address
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.address}
                          touched={validation.touched.address}
                          error={validation.errors.address}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Package_details}
                          name="package_details"
                          type="text"
                          placeholder={InputPlaceHolder(
                            dealLabel.Package_details
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.package_details}
                          touched={validation.touched.package_details}
                          error={validation.errors.package_details}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Payment_selection}
                          name="payment_duration"
                          type="text"
                          placeholder={InputPlaceHolder(
                            dealLabel.Payment_selection
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.payment_duration}
                          touched={validation.touched.payment_duration}
                          error={validation.errors.payment_duration}
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col lg={3} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Listing}
                          name="is_listing"
                          type="text"
                          placeholder={InputPlaceHolder(dealLabel.Listing)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.is_listing}
                          touched={validation.touched.is_listing}
                          error={validation.errors.is_listing}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={3} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Description}
                          name="description"
                          type="text"
                          placeholder={InputPlaceHolder(dealLabel.Description)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.firstName}
                          touched={validation.touched.firstName}
                          error={validation.errors.firstName}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={3} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Contract_images}
                          name="contract_images"
                          type="text"
                          placeholder={InputPlaceHolder(
                            dealLabel.Contract_images
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.contract_images}
                          touched={validation.touched.contract_images}
                          error={validation.errors.contract_images}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col lg={3} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Check_images}
                          name="check_image"
                          type="text"
                          placeholder={InputPlaceHolder(dealLabel.Check_images)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.check_image}
                          touched={validation.touched.check_image}
                          error={validation.errors.check_image}
                          passwordToggle={false}
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
      </Container>
    </div>
  );
};

export default FormListOfDeal;
