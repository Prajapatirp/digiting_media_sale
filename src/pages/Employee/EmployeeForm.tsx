import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Form, Row } from "reactstrap";
import { getIn, useFormik } from "formik";
import * as Yup from "yup";
import { RequiredField } from "Components/constants/requireMsg";
import { InputPlaceHolder } from "Components/constants/validation";
import {
  emailRegex,
  numberRegex,
  passwordRegex,
  roleEnums,
  validationMessages,
  zipcodeRegex,
} from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect, MultiSelect } from "Components/Base/BaseSelect";
import BaseButton from "Components/Base/BaseButton";
import { employeeLabel, roleType } from "Components/constants/employee";
import { userLabel } from "Components/constants/users";
import { ButtonEnums, CREATED, SUCCESS, getItem } from "Components/emus/emus";
import { customStyles, dynamicFind, errorHandle } from "helpers/service";
import { register, updateProfile } from "api/usersApi";
import { toast } from "react-toastify";
import {
  listOfCity,
  listOfDesignation,
  listOfService,
  listOfState,
} from "api/listApi";
import { listOfProject } from "api/projectApi";

type SelectedOption = { label: string; value: string };
type Payload = {
  name: string;
  email: string;
  role: string;
  address: string;
  designation?: string;
  contactNo: string;
  state: string;
  city: string;
  zipCode: string;
  serviceId?: number[];
  password?: string;
  confirmPassword?: string;
  projectName?: string;
};
let serviceData: Array<any> = [];
let project: Array<any> = [];

const EmployeeForm = ({ getInitialValues, updatedUser }: any) => {
  const [loader, setLoader] = useState<boolean>(true);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<boolean>(false);
  const [selectedMulti, setSelectedMulti] = useState<any>("");
  const [isRole, setIsRole] = useState<string>(roleEnums.Manager);
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [projectId, setProjectId] = useState<any>(null);
  const [designationData, setDesignationData] = useState([]);
  const [serviceTypeId, setServiceTypeId] = useState([]);
  let getInitialValue = getInitialValues;
  let roleId: any = getItem("id");

  function listAPi() {
    listOfState({})
      .then((res) => {
        setStateData(
          res?.data?.map((item: { state_name: string; id: number }) => ({
            value: item?.state_name,
            label: item?.state_name,
            id: item?.id,
          }))
        );
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }

  const fetchData = (id: number) => {
    setLoader(true);
    listOfCity({
      condition: {
        state_id: id,
      },
    })
      .then((res) => {
        setCityData(
          res?.data?.map((item: { city_name?: string }) => ({
            value: item?.city_name,
            label: item?.city_name,
          }))
        );
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: getInitialValue || {
      name: "",
      email: "",
      contact_no: "",
      password: "",
      confirmPassword: "",
      state: "",
      city: "",
      address: "",
      zip_code: "",
      role: "",
      designation: "",
      serviceType: null,
      projectName: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(RequiredField(employeeLabel.Name)),
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
          ? isRole === roleEnums.Manager
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
          ? isRole === roleEnums.Manager
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
      state: Yup.string().required(RequiredField(employeeLabel.State)),
      city: Yup.string().required(RequiredField(employeeLabel.City)),
      role: Yup.string().required(RequiredField(employeeLabel.Role)),
      designation: Yup.string().when("role", ([role], sch) => {
        return role === roleEnums?.Employee
          ? sch.required(
              validationMessages?.required(employeeLabel?.Designation)
            )
          : sch.notRequired();
      }),
      serviceType: Yup.array().when("role", ([role], sch) => {
        return role === roleEnums?.Vendor
          ? sch.required(
              validationMessages?.required(employeeLabel?.ServiceType)
            )
          : sch.notRequired();
      }),
      address: Yup.string().required(RequiredField(employeeLabel.Address)),
      zip_code: Yup.string()
        .required(validationMessages.required(employeeLabel.ZipCode))
        .matches(
          zipcodeRegex,
          validationMessages.contactLength(employeeLabel.ZipCode, 6)
        ),
      projectName: Yup.array().when("role", ([role], schema) => {
        return role === roleEnums?.Manager
          ? schema.required(
              validationMessages?.required(employeeLabel?.projectName)
            )
          : schema.notRequired();
      }),
    }),
    onSubmit: (values, { resetForm }) => {
      let payload: Payload;
      if (isRole === roleEnums.Employee) {
        payload = {
          name: values.name,
          email: values.email,
          role: values.role,
          address: values.address,
          designation: values.designation,
          contactNo: String(values.contact_no),
          state: String(values.state),
          city: String(values.city),
          zipCode: String(values.zip_code),
        };
      } else if (isRole === roleEnums.Vendor) {
        payload = {
          name: values.name,
          email: values.email,
          role: values.role,
          address: values.address,
          serviceId: serviceTypeId,
          contactNo: String(values.contact_no),
          state: String(values.state),
          city: String(values.city),
          zipCode: String(values.zip_code),
        };
      } else {
        payload = {
          ...values,
          contactNo: String(values.contact_no),
          state: String(values.state),
          city: String(values.city),
          zipCode: String(values.zip_code),
          project_id: projectId,
        };
      }

      setLoader(true);
      if (getInitialValue?.id) {
        updateProfile(getInitialValue?.id, payload)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
              resetForm();
              resetData();
              updatedUser();
              selectedMulti(null);
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
            handleMultiProject(null);
          });
      } else {
        register(payload)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
              resetForm();
              resetData();
              updatedUser();
              selectedMulti(null);
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
            handleMultiProject(null);
          });
      }
    },
  });

  const resetData = () => {
    validation.initialValues.designation = "";
    validation.setFieldValue('role', null)
    validation.initialValues.state = "";
    validation.initialValues.city = "";
    validation.initialValues.name = "";
    validation.initialValues.contact_no = "";
    validation.initialValues.email = "";
    validation.initialValues.zip_code = "";
    validation.initialValues.id = "";
    validation.initialValues.address = "";
    validation.initialValues.projectName = "";
  };

  useEffect(() => {
    listAPi();
    const state = dynamicFind(stateData, getInitialValue?.state);
    fetchData(state?.id);
    setIsRole(getInitialValue?.role || roleEnums?.Manager);
  }, [getInitialValues]);

  useEffect(() => {
    handleMulti(null);
    handleMultiProject(null);
    let data;
    if (isRole === roleEnums.Employee) {
      listOfDesignation({})
        .then((res) => {
          setDesignationData(
            res?.data?.map((item: { designation?: string }) => ({
              value: item?.designation,
              label: item?.designation,
            }))
          );
        })
        .catch((error) => {
          errorHandle(error);
        })
        .finally(() => {
          setLoader(false);
        });
    }
    if (isRole === roleEnums.Vendor) {
      setSelectedMulti(null);
      listOfService({})
        .then((res) => {
          if (res?.status === SUCCESS) {
            data = res?.data;
            serviceData = data?.map(
              (item: { id?: number; service_name?: string }) => ({
                value: item?.id,
                label: item?.service_name,
              })
            );
            if (serviceData?.length > 0) {
              let preFilledService = getInitialValue.hasOwnProperty(
                "userService"
              )
                ? getInitialValue?.userService?.map(
                    (value: any) => value.service_id
                  )
                : null;
              let selectedServices: any = [];

              serviceData?.forEach((value: any) => {
                preFilledService?.map((item: any) => {
                  if (value?.value === item) {
                    selectedServices.push(value);
                  }
                });
              });
              handleMulti(selectedServices || null);
            }
          }
        })
        .catch((error) => {
          return error;
        })
        .finally(() => {
          setLoader(false);
        });
    }
    if (isRole === roleEnums.Manager) {
      setSelectedMulti(null);
      listOfProject({})
        .then((res) => {
          if (res?.status === SUCCESS) {
            data = res?.data;
            project = data?.map(
              (item: { id?: number; project_name?: string }) => ({
                value: item?.id,
                label: item?.project_name,
              })
            );
            if (project?.length > 0) {
              let preFilledService = getInitialValue.hasOwnProperty(
                "userProject"
              )
                ? getInitialValue?.userProject?.map(
                    (value: any) => value.project_id
                  )
                : null;
              let selectedServices: any = [];

              project?.forEach((value: any) => {
                preFilledService?.map((item: any) => {
                  if (value?.value === item) {
                    selectedServices.push(value);
                  }
                });
              });
              handleMultiProject(selectedServices || null);
            }
          }
        })
        .catch((error) => {
          return error;
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, [isRole, getInitialValue?.id]);

  function handleMulti(selectedMulti: any) {
    const ids =
      selectedMulti?.length > 0
        ? selectedMulti?.map((item: any) => {
            return item.value;
          })
        : null;
    setServiceTypeId(ids);
    validation.setFieldValue("serviceType", ids);
    setSelectedMulti(selectedMulti);
  }
  function handleMultiProject(selectedMulti: any) {
    const ids =
      selectedMulti?.length > 0
        ? selectedMulti?.map((item: any) => {
            return item.value;
          })
        : null;
    setProjectId(ids);
    validation.setFieldValue("projectName", ids);
    setSelectedMulti(selectedMulti);
  }

  return (
    <Row>
      <Col lg={12}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
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
                      name="name"
                      type="text"
                      placeholder={InputPlaceHolder(employeeLabel.Name)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.name}
                      touched={validation.touched.name}
                      error={validation.errors.name}
                      passwordToggle={false}
                    />
                  </Col>
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
                </Row>

                <Row className="mb-2">
                  <Col
                    className="mb-2"
                    lg={
                      isRole === roleEnums.Vendor ||
                      isRole === roleEnums.Employee
                        ? 6
                        : 4
                    }
                  >
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
                      value={dynamicFind(roleType, validation.values.role) || ''}
                      touched={validation.touched.role}
                      error={validation.errors.role}
                    />
                  </Col>
                  {isRole === roleEnums.Manager && (
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
                  )}
                  {isRole === roleEnums.Manager && (
                    <Col lg={4} className="mb-2">
                      <BaseInput
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
                        disabled={getInitialValues === null ? false : true}
                      />
                    </Col>
                  )}
                  {isRole === roleEnums.Vendor && (
                    <Col lg={6} className="mb-2">
                      <MultiSelect
                        name="serviceType"
                        className="select-border"
                        value={selectedMulti || null}
                        isMulti={true}
                        onChange={handleMulti}
                        options={serviceData}
                        styles={customStyles}
                        touched={validation.touched.serviceType}
                        error={validation.errors.serviceType}
                        handleBlur={validation.handleBlur}
                      />
                    </Col>
                  )}
                  {isRole === roleEnums.Employee && (
                    <Col lg={6} className="mb-2">
                      <BaseSelect
                        name="designation"
                        className="select-border"
                        options={designationData}
                        placeholder={InputPlaceHolder(
                          employeeLabel.Designation
                        )}
                        handleChange={(selectedOption: SelectedOption) => {
                          validation.setFieldValue(
                            "designation",
                            selectedOption?.value || ""
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={
                          dynamicFind(
                            designationData,
                            validation.values.designation
                          ) || null
                        }
                        touched={validation.touched.designation}
                        error={validation.errors.designation}
                      />
                    </Col>
                  )}
                </Row>

                <Row className="mb-2">
                  <Col lg={4} className="mb-2">
                    <BaseSelect
                      name="state"
                      className="select-border"
                      options={stateData}
                      placeholder={
                        InputPlaceHolder(employeeLabel.State) || null
                      }
                      handleChange={(selectedOption: {
                        label: string;
                        value: string;
                        id: number;
                      }) => {
                        validation.setFieldValue(
                          "state",
                          selectedOption?.value || ""
                        );
                        fetchData(selectedOption.id);
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(stateData, validation.values.state) || null
                      }
                      touched={validation.touched.state}
                      error={validation.errors.state}
                    />
                  </Col>
                  <Col lg={4} className="mb-2">
                    <BaseSelect
                      name="city"
                      className="select-border"
                      options={cityData}
                      placeholder={InputPlaceHolder(employeeLabel.City)}
                      handleChange={(selectedOption: SelectedOption) => {
                        validation.setFieldValue(
                          "city",
                          selectedOption?.value || ""
                        );
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(cityData, validation.values.city) || null
                      }
                      touched={validation.touched.city}
                      error={validation.errors.city}
                    />
                  </Col>
                  <Col lg={4} className="mb-2">
                    <BaseInput
                      name="zip_code"
                      type="number"
                      placeholder={InputPlaceHolder(employeeLabel.ZipCode)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.zip_code}
                      touched={validation.touched.zip_code}
                      error={validation.errors.zip_code}
                      passwordToggle={false}
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col lg={4} className="mb-2">
                    <BaseInput
                      name="address"
                      type="text"
                      placeholder={InputPlaceHolder(employeeLabel.Address)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.address}
                      touched={validation.touched.address}
                      error={validation.errors.address}
                      passwordToggle={false}
                    ></BaseInput>
                  </Col>
                  <Col lg={4} className="mb-2">
                    {isRole === roleEnums?.Manager ? (
                      <MultiSelect
                        name="projectName"
                        className="select-border"
                        value={selectedMulti || null}
                        isMulti={true}
                        onChange={handleMultiProject}
                        options={project}
                        styles={customStyles}
                        touched={validation.touched.projectName}
                        error={validation.errors.projectName}
                        handleBlur={validation.handleBlur}
                      />
                    ) : null}
                  </Col>
                  <Col
                    lg={4}
                    className="d-flex align-items-end justify-content-end"
                  >
                    <BaseButton
                      disabled={loader}
                      type="submit"
                      className="btn btn-success w-sm"
                    >
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
