import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RequiredField } from "Components/constants/requireMsg";
import { InputPlaceHolder } from "Components/constants/validation";
import { userLabel, userTab } from "Components/constants/users";
import BaseInput from "Components/Base/BaseInput";
import { listOfCity, listOfState } from "api/listApi";
import { dynamicFind, errorHandle } from "helpers/service";
import { BaseSelect } from "Components/Base/BaseSelect";
import BaseButton from "Components/Base/BaseButton";
import {
  ACCEPTED,
  ButtonEnums,
  CREATED,
  OK,
  SUCCESS,
  enms,
} from "Components/emus/emus";
import {
  changePassword,
  fileUpload,
  updateProfile,
  viewProfile,
} from "api/usersApi";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import Loader from "Components/Base/Loader";
import { passwordRegex, validationMessages } from "Components/constants/common";
import { configImage } from "config";
import { Link } from "react-router-dom";
import { useProfile } from "./ProfileContext";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [loader, setLoader] = useState<boolean>(true);
  const [cityData, setCityData] = useState([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [stateData, setStateData] = useState<{ value: string; id: number }[]>(
    []
  );
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userName, setUserName] = useState();

  const tabChange = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const token = sessionStorage.getItem(enms.AuthUser);
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userIdFromToken = decodedToken.id;
      setUserId(userIdFromToken);
      handleViewProfile(userIdFromToken);
    }
  }, []);

  const handleViewProfile = (userId: number) => {
    viewProfile(userId)
      .then((data) => {
        const name = data.data.name;
        const profile_image = data.data.profile_image;
        validation.setValues({
          ...validation.values,
          name: name,
          contactNo: data.data.contact_no,
          email: data.data.email,
          zipCode: String(data.data.zip_code),
          city: data.data.city,
          state: data.data.state,
          address: data.data.address,
          profile_image: profile_image,
        });
        setUserName(name);
        setProfileImage(profile_image);

        setLoader(false);
      })
      .catch((error) => {
        return error;
      })
      .finally(() => {});
  };

  useEffect(() => {
    listAPi();
  }, []);

  useEffect(() => {
    // setLoader(true)
    if (userId !== null) {
      handleViewProfile(userId);
    }
    setLoader(false);
  }, [userId]);

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

  const ChangePasswordInitialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const validationChnagePassword: any = useFormik({
    enableReinitialize: true,
    initialValues: ChangePasswordInitialValues,
    validationSchema: Yup.object({
      currentPassword: Yup.string().required(
        validationMessages.required(userLabel.currentPassword)
      ),
      newPassword: Yup.string()
        .matches(
          passwordRegex,
          validationMessages.passwordComplexity(userLabel.newPassword)
        )
        .min(8, validationMessages.passwordLength(userLabel.password, 8))
        .required(validationMessages.required(userLabel.newPassword)),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword"), undefined],
          validationMessages.passwordsMatch("Confirm Password")
        )
        .required(validationMessages.required(userLabel.confirmPassword)),
    }),

    onSubmit: async (values, { resetForm }) => {
      const passwordPayload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };
      if (userId !== null) {
        setLoader(true);
        changePassword(userId, passwordPayload)
          .then((res) => {
            if (res?.statusCode === ACCEPTED && res?.status === SUCCESS) {
              toast.success(res?.message);
              validationChnagePassword.resetForm();
            } else {
              toast.error(res.message);
            }
          })
          .catch((error) => {
            toast.error(error.message);
          })
          .finally(() => {
            setLoader(false);
            validationChnagePassword.resetForm();
          });
      } else {
        setLoader(false);
      }
    },
  });

  const InitialValues = {
    name: "",
    contactNo: "",
    email: "",
    zipCode: "",
    city: "",
    state: "",
    address: "",
  };
  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: InitialValues,
    validationSchema: Yup.object({
      name: Yup.string().required(RequiredField(userLabel.name)),
      contactNo: Yup.string().required(RequiredField(userLabel.contactNo)),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
          userLabel.EmailValidationMessage
        )
        .required(RequiredField(userLabel.email)),
      state: Yup.string().required(RequiredField(userLabel.State)),
      city: Yup.string().required(RequiredField(userLabel.City)),
      address: Yup.string().required(RequiredField(userLabel.Address)),
      zipCode: Yup.string()
        .matches(/^\d{6}$/, userLabel.ZipCodeValidationMessage)
        .required(RequiredField(userLabel.ZipCode)),
    }),

    onSubmit: async (values, { resetForm }) => {
      const payload = {
        name: values.name,
        contactNo: values.contactNo,
        email: values.email,
        state: values.state,
        city: values.city,
        address: values.address,
        zipCode: values.zipCode.toString(),
        profile_image: profileImage ? profileImage.toString() : null,
      };
      if (userId !== null) {
        setLoader(true);
        updateProfile(userId, payload)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
              setValue(profileImage);
            } else {
              toast.error(res.message);
            }
          })
          .catch((error) => {
            toast.error(error.message);
          })
          .finally(() => {
            setLoader(false);
          });
      } else {
        setLoader(false);
      }
    },
  });
  useEffect(() => {
    const state = dynamicFind(stateData, validation.values.state);
    fetchData(state?.id);
  }, [validation.values.state]);

  const handleProfileImageUpload = (e: any) => {
    const formData = new FormData();
    formData.append("files", e.target.files[0]);
    fileUpload(formData)
      .then((res) => {
        setProfileImage(res?.data[0]);
      })
      .catch((error) => {
        return error;
      });
  };
  const { value, setValue } = useProfile();
  
  return (
    <React.Fragment>
      <div className="page-content">
        {loader && <Loader />}
        <Container fluid className="mt-5">
          <Row>
            <Col xxl={3}>
              <Card className="mt-n5">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                      {profileImage !== null ? (
                        <img
                          src={`${configImage?.api?.API_URL}/${profileImage}`}
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                          alt="user-profile"
                        />
                      ) : (
                        <img
                          src="/images/avtar-1.jpg"
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                          alt="user-profile"
                        />
                      )}
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <Input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input"
                          accept=".jpg, .jpeg, .png"
                          onChange={handleProfileImageUpload}
                        />
                        <Label
                          htmlFor="profile-img-file-input"
                          className="profile-photo-edit avatar-xs"
                        >
                          <span className="avatar-title rounded-circle bg-light text-body">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <h5 className="fs-16 mb-1">{userName}</h5>
                    {/* <p className="text-muted mb-0">{userRole}</p> */}
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5">
                <CardHeader>
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          tabChange("1");
                        }}
                      >
                        <i className="fas fa-home"></i>
                        {userTab.personalDetails}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          tabChange("2");
                        }}
                        type="button"
                      >
                        <i className="far fa-user"></i>
                        {userTab.ChangePassword}
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Form
                        onSubmit={(e) => {
                          validation.handleSubmit();
                          e.preventDefault();
                          return false;
                        }}
                      >
                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="firstnameInput"
                                className="form-label"
                              >
                                {userLabel.name}
                              </Label>
                              <BaseInput
                                name="name"
                                type="text"
                                placeholder={InputPlaceHolder(userLabel.name)}
                                handleChange={validation.handleChange}
                                handleBlur={validation.handleBlur}
                                value={validation.values.name}
                                touched={validation.touched.name}
                                error={validation.errors.name}
                                passwordToggle={false}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="lastnameInput"
                                className="form-label"
                              >
                                {userLabel.PhoneNumber}
                              </Label>
                              <BaseInput
                                name="contactNo"
                                type="number"
                                placeholder={InputPlaceHolder(
                                  userLabel.contactNo
                                )}
                                handleChange={validation.handleChange}
                                handleBlur={validation.handleBlur}
                                value={validation.values.contactNo}
                                touched={validation.touched.contactNo}
                                error={validation.errors.contactNo}
                                passwordToggle={false}
                                disabled={true}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="phonenumberInput"
                                className="form-label"
                              >
                                {userLabel.EmailAddress}
                              </Label>
                              <BaseInput
                                name="email"
                                type="text"
                                placeholder={InputPlaceHolder(userLabel.email)}
                                handleChange={validation.handleChange}
                                handleBlur={validation.handleBlur}
                                value={validation.values.email}
                                touched={validation.touched.email}
                                error={validation.errors.email}
                                passwordToggle={false}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="zipcodeInput"
                                className="form-label"
                              >
                                {userLabel.ZipCode}
                              </Label>
                              <BaseInput
                                name="zipCode"
                                type="number"
                                placeholder={InputPlaceHolder(
                                  userLabel.ZipCode
                                )}
                                handleChange={validation.handleChange}
                                handleBlur={validation.handleBlur}
                                value={validation.values.zipCode}
                                touched={validation.touched.zipCode}
                                error={validation.errors.zipCode}
                                passwordToggle={false}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label htmlFor="cityInput" className="form-label">
                                {userLabel.State}
                              </Label>
                              <BaseSelect
                                name="state"
                                className="select-border"
                                options={stateData}
                                placeholder={InputPlaceHolder(userLabel.State)}
                                handleChange={(selectedOption: any) => {
                                  validation.setFieldValue(
                                    "state",
                                    selectedOption?.value || ""
                                  );
                                  fetchData(selectedOption?.id);
                                }}
                                handleBlur={validation.handleBlur}
                                value={
                                  dynamicFind(
                                    stateData,
                                    validation.values.state
                                  ) || ""
                                }
                                touched={validation.touched.state}
                                error={validation.errors.state}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label htmlFor="cityInput" className="form-label">
                                {userLabel.City}
                              </Label>
                              <BaseSelect
                                name="city"
                                className="select-border"
                                placeholder={InputPlaceHolder(userLabel.City)}
                                options={cityData}
                                handleChange={(selectedOption: any) => {
                                  validation.setFieldValue(
                                    "city",
                                    selectedOption?.value || ""
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={
                                  dynamicFind(
                                    cityData,
                                    validation.values.city
                                  ) || ""
                                }
                                touched={validation.touched.city}
                                error={validation.errors.city}
                              />
                            </div>
                          </Col>
                          <Col lg={12} className="mb-2">
                            <Label htmlFor="cityInput" className="form-label">
                              {userLabel.Address}
                            </Label>
                            <BaseInput
                              name="address"
                              type="textarea"
                              placeholder={InputPlaceHolder(userLabel.Address)}
                              handleChange={validation.handleChange}
                              handleBlur={validation.handleBlur}
                              value={validation.values.address}
                              touched={validation.touched.address}
                              error={validation.errors.address}
                              passwordToggle={false}
                            ></BaseInput>
                          </Col>
                          <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end mt-1">
                              <BaseButton
                                disabled={loader}
                                type="submit"
                                className="btn btn-success w-sm"
                              >
                                {ButtonEnums.Updates}
                              </BaseButton>
                              <Link to={"/dashboard"}>
                                {" "}
                                <BaseButton
                                  disabled={loader}
                                  type="submit"
                                  className="btn btn-primary w-sm"
                                >
                                  {ButtonEnums.Cancel}
                                </BaseButton>
                              </Link>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>
                    <TabPane tabId="2">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validationChnagePassword.handleSubmit();
                          return false;
                        }}
                      >
                        <Row className="g-2">
                          <Col lg={4}>
                            <div>
                              <BaseInput
                                label={userLabel.currentPassword}
                                name="currentPassword"
                                type="password"
                                placeholder={InputPlaceHolder(
                                  userLabel.currentPassword
                                )}
                                handleChange={
                                  validationChnagePassword.handleChange
                                }
                                handleBlur={validationChnagePassword.handleBlur}
                                value={
                                  validationChnagePassword.values
                                    .currentPassword
                                }
                                touched={
                                  validationChnagePassword.touched
                                    .currentPassword
                                }
                                error={
                                  validationChnagePassword.errors
                                    .currentPassword
                                }
                                passwordToggle={true}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <BaseInput
                                label={userLabel.newPassword}
                                name="newPassword"
                                type="password"
                                placeholder={InputPlaceHolder(
                                  userLabel.newPassword
                                )}
                                handleChange={
                                  validationChnagePassword.handleChange
                                }
                                handleBlur={validationChnagePassword.handleBlur}
                                value={
                                  validationChnagePassword.values.newPassword
                                }
                                touched={
                                  validationChnagePassword.touched.newPassword
                                }
                                error={
                                  validationChnagePassword.errors.newPassword
                                }
                                passwordToggle={true}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <BaseInput
                                label={userLabel.confirmPassword}
                                name="confirmPassword"
                                type="password"
                                placeholder={InputPlaceHolder(
                                  userLabel.confirmPassword
                                )}
                                handleChange={
                                  validationChnagePassword.handleChange
                                }
                                handleBlur={validationChnagePassword.handleBlur}
                                value={
                                  validationChnagePassword.values
                                    .confirmPassword
                                }
                                touched={
                                  validationChnagePassword.touched
                                    .confirmPassword
                                }
                                error={
                                  validationChnagePassword.errors
                                    .confirmPassword
                                }
                                passwordToggle={true}
                              />
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div className="text-end">
                              <BaseButton
                                disabled={loader}
                                type="submit"
                                className="btn btn-success w-sm"
                              >
                                {ButtonEnums.ChangePassword}
                              </BaseButton>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Profile;
