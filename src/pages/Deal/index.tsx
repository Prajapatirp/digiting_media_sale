import { useState, useEffect, useMemo } from "react";
import { Card, Col, Row, Container } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RequiredField } from "Components/constants/requireMsg";
import {
  emailRegex,
  numberRegex,
  passwordRegex,
  roleEnums,
  searchPlaceHolder,
  validationMessages,
} from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseButton from "Components/Base/BaseButton";
import { employeeLabel } from "Components/constants/employee";
import { userLabel } from "Components/constants/users";
import { CREATED, SUCCESS } from "Components/emus/emus";
import { register, updateProfile } from "api/usersApi";
import { toast } from "react-toastify";
import TableContainer from "Components/Base/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { DealList, dealKey, dealLabel } from "Components/constants/deal";
import BreadCrumb from "Components/Base/BreadCrumb";
import { Link } from "react-router-dom";

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

const DealFrom = ({ getInitialValues, updatedUser }: any) => {
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

  const columns = useMemo(
    () => [
      {
        header: dealLabel.Customer_name,
        accessorKey: dealKey.Customer_name,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Company_name,
        accessorKey: dealKey.Company_name,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Package,
        accessorKey: dealKey.Package,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Listing,
        accessorKey: dealKey.Listing,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Contract_start_date,
        accessorKey: dealKey.Contract_start_date,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Contract_end_date,
        accessorKey: dealKey.Contract_end_date,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Email,
        accessorKey: dealKey.Email,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.Action,
        cell: (cell: { row: { original: { id: number } } }) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`editMode-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-secondary edit-list"
              // onClick={() => setGetInitialValues(cell?.row?.original)}
            >
              <i className="ri-pencil-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="info"
                content="Edit"
                anchorId={`editMode-${cell?.row?.original?.id}`}
              />
            </BaseButton>
            <BaseButton
              id={`delete-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-danger remove-list"
              // onClick={() => {
              //   onClickDelete(cell?.row?.original?.id);
              // }}
            >
              <i className="ri-delete-bin-5-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="error"
                content="Delete"
                anchorId={`delete-${cell?.row?.original?.id}`}
              />
            </BaseButton>
            <BaseButton
              id={`usage-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-success usage-list"
              // onClick={() => {
              //   toggleEmployeeModal(cell?.row?.original?.id);
              // }}
            >
              <i className="ri-eye-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="success"
                content="View"
                anchorId={`usage-${cell?.row?.original?.id}`}
              />
            </BaseButton>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="page-content">
      <Container>
        <Row className="mb-3">
          <div className="shepherd-button-right d-flex justify-content-between align-items-center">
            <BreadCrumb title={dealLabel.Title} pageTitle="Forms" />
            <Link to="/deal-form">
              <BaseButton color="success" className="btn-label">
                <i className="ri-add-line label-icon align-middle fs-16 me-2"></i>
                Add Deal
              </BaseButton>
            </Link>
          </div>
        </Row>
        <Row>
          <Col lg={12}>
            <Card id="customerList">
              <div className="card-body pt-0">
                {loader && <Loader />}
                <div>
                  {DealList.length ? (
                    <TableContainer
                      isHeaderTitle={`${dealLabel.Title} List`}
                      columns={columns}
                      data={DealList || []}
                      isGlobalFilter={true}
                      customPageSize={5}
                      theadClass="table-light text-muted"
                      SearchPlaceholder={searchPlaceHolder}
                    />
                  ) : (
                    <div className="py-4 text-center"></div>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DealFrom;
