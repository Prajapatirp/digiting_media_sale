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
  validationMessages,
} from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect } from "Components/Base/BaseSelect";
import BaseButton from "Components/Base/BaseButton";
import {
  ACCEPTED,
  ButtonEnums,
  CREATED,
  OK,
  SUCCESS,
} from "Components/emus/emus";
import { dynamicFind, errorHandle } from "helpers/service";
import { fileUpload } from "api/usersApi";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { dealKey, dealLabel } from "Components/constants/deal";
import Flatpickr from "react-flatpickr";
import { listOfService } from "api/listApi";
import { createDeal, listOfDeal, updateDeal } from "api/deal";

type SelectedOption = { label: string; value: string; month?: string };

const FormListOfDeal = ({ updatedUser }: any) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState<any>([]);
  const [packageMonth, setPackageMonth] = useState<any>(null);
  const [contractImage, setContractImage] = useState<any>();
  const [viewDeals, setViewDeals] = useState<any>();
  const { dealId } = useParams();

  const handleProfileImageUpload = (e: any) => {
    const formData = new FormData();

    formData.append("files", e.target.files[0]);
    fileUpload(formData)
      .then((res) => {
        setContractImage(res?.data[0]);
      })
      .catch((error) => {
        return error;
      });
  };

  function viewDeal(dealId: any) {
    listOfDeal({
      condition: {
        id: dealId,
      },
    })
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setViewDeals(res?.data[0]);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }

  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: {
      company_name: viewDeals?.company_name || "",
      customer_name: viewDeals?.customer_name || "",
      owner_mobile: viewDeals?.owner_mobile || "",
      inquiry_number: viewDeals?.inquiry_number || "",
      email: viewDeals?.email || "",
      pin_code: viewDeals?.pin_code || "",
      month: viewDeals?.month || "",
      payment: viewDeals?.payment || "",
      address: viewDeals?.address || "",
      package_id: viewDeals?.package_id || "",
      package_details: viewDeals?.package_details || "",
      payment_duration: viewDeals?.payment_duration || "",
      is_listing: viewDeals?.is_listing || "",
      description: viewDeals?.description || "",
      contract_date: viewDeals?.contract_date || "",
      contract_end_date: viewDeals?.contract_end_date || "",
      contract_images: viewDeals?.contract_images || "",
    },
    validationSchema: Yup.object({
      company_name: Yup.string().required(
        RequiredField(dealLabel.Company_name)
      ),
      customer_name: Yup.string().required(
        RequiredField(dealLabel.Customer_name)
      ),
      email: Yup.string()
        .required(validationMessages.required(dealLabel.Email))
        .email(validationMessages.format(dealLabel.Email))
        .matches(emailRegex, validationMessages.format(dealLabel.Email)),
      owner_mobile: Yup.string()
        .required(validationMessages.required(dealLabel.Owner_mobile))
        .matches(
          numberRegex,
          validationMessages.contactLength(dealLabel.Owner_mobile, 10)
        ),
      inquiry_number: Yup.string()
        .required(validationMessages.required(dealLabel.Inquire_number))
        .matches(
          numberRegex,
          validationMessages.contactLength(dealLabel.Inquire_number, 10)
        ),
      pin_code: Yup.string().required(RequiredField(dealLabel.PinCode)),
      payment: Yup.string().required(RequiredField(dealLabel.Payment)),
      address: Yup.string().required(RequiredField(dealLabel.Customer_address)),
      package_id: Yup.number().required(RequiredField(dealLabel.Package)),
      package_details: Yup.string().required(
        RequiredField(dealLabel.Package_details)
      ),
      is_listing: Yup.string().required(RequiredField(dealLabel.Listing)),
      description: Yup.string().required(RequiredField(dealLabel.Description)),
      contract_date: Yup.string().required(
        RequiredField(dealLabel.Contract_start_date)
      ),
      contract_end_date: Yup.string().required(
        RequiredField(dealLabel.Contract_end_date)
      ),
    }),
    onSubmit: (values) => {
      if (!dealId) {
        let payload: any = {
          ...values,
          payment_duration: packageMonth,
          month: packageMonth,
          check_image: contractImage,
          contract_images: contractImage,
          is_listing: true,
          status: "Open",
          inquiry_number: String(values.inquiry_number),
          owner_mobile: String(values.owner_mobile),
          pin_code: String(values.pin_code),
          payment: +values.payment,
        };

        createDeal(payload)
          .then((res) => {
            setLoader(true);
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
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
        let payload: any = {
          ...values,
          is_listing: true,
          inquiry_number: String(values.inquiry_number),
          owner_mobile: String(values.owner_mobile),
          pin_code: String(values.pin_code),
        };

        updateDeal(payload, dealId)
          .then((res) => {
            setLoader(true);
            if (res?.statusCode === ACCEPTED && res?.status === SUCCESS) {
              toast.success(res?.message);
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

  function listOfPackage(id?: number) {
    let obj: any;
    if (id !== undefined) {
      obj = {
        condition: {
          id,
        },
      };
    } else {
      obj = {};
    }

    listOfService(obj)
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          if (id === undefined || id === null) {
            console.log("enetr");

            setServiceData(res.data);
          } else {
            console.log("enetrassdsdssd");
            setPackageMonth(res.data);
          }
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => setLoader(false));
  }

  useEffect(() => {
    listOfPackage();
  }, []);

  useEffect(() => {
    viewDeal(dealId);
  }, [dealId]);

  const selectedServiceObj = Array.isArray(serviceData)
    ? serviceData?.map((index) => {
        return {
          value: index.id,
          label: index.package_name,
          month: index.package_duration,
        };
      })
    : null;

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
                  <h5 className="card-title mb-0">{dealLabel.Title}</h5>
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
                          name="customer_name"
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
                    </Row>
                    <Row className="mb-2">
                      <Col lg={4} md={6} sm={6} className="mb-2">
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
                      <Col lg={4} md={6} sm={6} className="mb-2">
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

                      {/* <Col className="mb-2" lg={4} md={4} sm={12}>
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
                      </Col> */}
                    </Row>
                    <CardHeader className="mb-4 d-flex justify-content-between align-items-center"></CardHeader>
                    <Row className="mb-2">
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseSelect
                          label={dealLabel.Package}
                          name="package_id"
                          className="select-border"
                          options={selectedServiceObj}
                          placeholder={InputPlaceHolder(dealLabel.Package)}
                          handleChange={(selectedOption: SelectedOption) => {
                            console.log("selectedOption", selectedOption);
                            let month = selectedOption?.month;
                            setPackageMonth(month);
                            validation.setFieldValue(
                              "package_id",
                              selectedOption?.value || ""
                            );
                          }}
                          handleBlur={validation.handleBlur}
                          value={
                            dynamicFind(
                              selectedServiceObj,
                              validation.values.package_id
                            ) || ""
                          }
                          touched={validation.touched.package_id}
                          error={validation.errors.package_id}
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
                          value={packageMonth || viewDeals?.month}
                          touched={validation.touched.month}
                          error={validation.errors.month}
                          passwordToggle={false}
                          disabled={true}
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
                        <label
                          htmlFor="task-duedate-input"
                          className="form-label">
                          {dealLabel.Contract_start_date}
                        </label>
                        <Flatpickr
                          name="contract_date"
                          id="date-field"
                          className={`form-select ${
                            validation.errors.contract_date && "is-invalid"
                          }`}
                          placeholder={InputPlaceHolder(
                            dealLabel.Contract_start_date
                          )}
                          value={validation.values.contract_date}
                          options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "Y-m-d",
                            onChange: function (
                              selectedDates,
                              dateStr,
                              instance
                            ) {
                              validation
                                .setFieldValue("contract_date", dateStr)
                                .then((res: any) => res)
                                .catch((err: any) => err);
                            },
                          }}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <label
                          htmlFor="task-duedate-input"
                          className="form-label">
                          {dealLabel.Contract_end_date}
                        </label>
                        <Flatpickr
                          name="contract_end_date"
                          id="date-field"
                          className={`form-select ${
                            validation.errors.contract_end_date && "is-invalid"
                          }`}
                          placeholder={InputPlaceHolder(
                            dealLabel.Contract_start_date
                          )}
                          value={validation.values.contract_end_date}
                          options={{
                            altInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "Y-m-d",
                            onChange: function (
                              selectedDates,
                              dateStr,
                              instance
                            ) {
                              validation
                                .setFieldValue("contract_end_date", dateStr)
                                .then((res: any) => res)
                                .catch((err: any) => err);
                            },
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col lg={4} md={4} sm={6} className="mb-2">
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
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Contract_images}
                          type="file"
                          id="task-title2"
                          className="form-control"
                          placeholder="Enter task title"
                          handleChange={(e: any) => handleProfileImageUpload(e)}
                        />
                      </Col>
                      <Col lg={4} md={4} sm={6} className="mb-2">
                        <BaseInput
                          label={dealLabel.Check_images}
                          type="file"
                          id="task-title3"
                          className="form-control"
                          placeholder="Enter task title"
                          handleChange={(e: any) => handleProfileImageUpload(e)}
                        />
                      </Col>
                    </Row>
                    <CardHeader className="mb-4 d-flex justify-content-between align-items-center"></CardHeader>
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
                          label={dealLabel.Description}
                          name="description"
                          type="textarea"
                          placeholder={InputPlaceHolder(dealLabel.Description)}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.description}
                          touched={validation.touched.description}
                          error={validation.errors.description}
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
                          {dealId ? ButtonEnums.Updates : ButtonEnums.Submit}
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
