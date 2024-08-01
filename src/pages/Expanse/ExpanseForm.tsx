import React, { useEffect, useState } from "react";
import { Form, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseButton from "Components/Base/BaseButton";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect } from "Components/Base/BaseSelect";
import {
  SelectPlaceHolder,
  InputPlaceHolder,
  textRegex,
} from "Components/constants/validation";
import {
  expanseLabels,
  expanseTable,
  paymentMode,
} from "Components/constants/expanse";
import Flatpickr from "react-flatpickr";
import Loader from "Components/Base/Loader";
import { RequiredField } from "Components/constants/requireMsg";
import { listOfUser } from "api/usersApi";
import { roleEnums } from "Components/constants/common";
import { CREATED, OK, SUCCESS, getItem } from "Components/emus/emus";
import { toast } from "react-toastify";
import { dynamicFind, errorHandle } from "helpers/service";
import { listOfProject } from "api/projectApi";
import { creteExpense, editExpense } from "api/expanseApi";
import moment from "moment";
import { managerList } from "Components/constants/taskAllocation";
interface ExpanseFormProps {
  initialValues: any;
  sendDataToParent: any;
}

type UserList = {
  id?: number;
  name?: string;
  role?: string;
  designation?: string | undefined;
};
type ProjectList = {
  id?: number;
  project_name?: string;
};

type SelectedOption = { label?: string; value?: string; id?: number };

const ExpanseForm: React.FC<ExpanseFormProps> = ({
  sendDataToParent,
  initialValues,
}) => {
  const [mangerList, setMangerList] = useState<UserList[]>();
  const [projectList, setProjectList] = useState<ProjectList[]>();
  const [loader, setLoader] = useState<boolean>();
  let role: any = getItem("role");
  let roleId: any = getItem("id");

  async function fetchData() {
    //For manager
    setLoader(true);
    listOfUser({
      condition: {
        role: roleEnums.Manager,
      },
    })
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setMangerList(
            res?.data?.map((item: UserList) => ({
              value: item?.id,
              label: item?.name,
              id: item?.id,
            }))
          );
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => setLoader(false));

    //For Projects
    await listOfProject()
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          if (role === roleEnums?.Manager) {
            setProjectList(
              res?.data?.map((item: any) => ({
                value: item?.project?.id,
                label: item?.project?.project_name,
                id: item?.project?.id,
              }))
            );
          } else {
            setProjectList(
              res?.data?.map((item: any) => ({
                value: item?.id,
                label: item?.project_name,
                id: item?.id,
              }))
            );
          }
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        return error;
      })
      .finally(() => setLoader(false));
  }

  useEffect(() => {
    fetchData();
  }, []);

  const expenseInitialValues = {
    project: initialValues?.project?.id || "",
    project_manager: initialValues?.project_manager?.id || "",
    date: initialValues?.date ? moment(initialValues.date).toDate() : null,
    paid_to: initialValues?.paid_to || "",
    payment_mode: initialValues?.payment_mode || "",
    amount: initialValues?.amount || "",
    purpose: initialValues?.purpose || "",
  };
  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: expenseInitialValues,
    validationSchema: Yup.object({
      project: Yup.string().required(RequiredField(expanseTable.project)),
      project_manager:
        roleId > 1
          ? Yup.string().notRequired()
          : Yup.string().required(RequiredField(expanseLabels.projectManager)),
      date: Yup.string().required(RequiredField(expanseLabels.date)),
      paid_to: Yup.string()
        .matches(textRegex, expanseLabels?.validationMessages)
        .required(RequiredField(expanseLabels.paidTo)),
      payment_mode: Yup.string().required(
        RequiredField(expanseLabels.paymentMode)
      ),
      amount: Yup.string().required(RequiredField(expanseLabels.amount)),
      purpose: Yup.string().required(RequiredField(expanseLabels.purpose)),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoader(true);
      let payload = {
        project_id: values.project,
        user_id: roleId > 1 ? parseInt(roleId) :values?.project_manager,
        paid_to: values?.paid_to,
        payment_mode: values?.payment_mode,
        purpose: values?.purpose,
        amount: values?.amount,
        date: moment(values.date).format("YYYY-MM-DD"),
      };
      const resetData = () => {
        initialValues.project = "";
        initialValues.project_manager = "";
        initialValues.date = "";
        initialValues.paid_to = "";
        initialValues.payment_mode = "";
        initialValues.amount = "";
        initialValues.purpose = "";
      };
      if (initialValues && initialValues.id) {
        editExpense(initialValues.id, payload)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
              resetForm();
              sendDataToParent();
              resetData();
            } else {
              toast.error(res?.message);
            }
          })
          .catch((error) => {
            errorHandle(error);
            return error;
          })
          .finally(() => {
            setLoader(false);
            initialValues.id = null;
          });
      } else {
        creteExpense(payload)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
              resetForm();
              sendDataToParent();
              resetData();
            } else {
              toast.error(res?.message);
            }
          })
          .catch((error) => {
            return error;
          })
          .finally(() => setLoader(false));
      }
      validation.resetForm();
    },
  });

  return (
    <Form onSubmit={validation.handleSubmit}>
      {loader && <Loader />}
      <Card>
        <CardHeader>
          <h5 className="card-title mb-0">{expanseLabels?.addExpanseDetail}</h5>
        </CardHeader>
        <CardBody className="mb-0 pb-0">
          <div className="mb-3">
            <Row>
              <Col lg={3} className="mb-2">
                <BaseSelect
                  name="project"
                  className="select-border"
                  options={projectList}
                  placeholder={SelectPlaceHolder(expanseLabels.project)}
                  handleChange={(selectedOption: any) => {
                    validation.setFieldValue(
                      "project",
                      selectedOption?.value || ""
                    );
                  }}
                  handleBlur={validation.handleBlur}
                  value={
                    projectList?.find(
                      (option: SelectedOption) =>
                        option.value === validation?.values?.project
                    ) || ""
                  }
                  touched={validation.touched.project}
                  error={validation.errors.project}
                />
              </Col>
              <Col lg={3} className="mb-2">
                <BaseSelect
                  name="project_manager"
                  className="select-border"
                  options={mangerList}
                  placeholder={SelectPlaceHolder(expanseLabels.projectManager)}
                  handleChange={(selectedOption: any) => {
                    validation.setFieldValue(
                      "project_manager",
                      selectedOption?.value || ""
                    );
                  }}
                  handleBlur={validation.handleBlur}
                  value={roleId > 1 ? dynamicFind(
                    mangerList,
                    parseInt(roleId) || ""
                  ) || "" :
                    dynamicFind(
                      mangerList,
                      validation?.values?.project_manager || ""
                    ) || ""
                  }
                  touched={validation.touched.project_manager}
                  error={validation.errors.project_manager}
                  isDisabled={roleId > 1 ? true : false}
                />
              </Col>
              <Col lg={3} className="mb-2">
                <Flatpickr
                  className="form-control"
                  placeholder={SelectPlaceHolder(expanseLabels.date)}
                  value={validation.values.date}
                  onChange={(date) => validation.setFieldValue("date", date[0])}
                  options={{
                    dateFormat: "d M, Y",
                    disable: [
                      (date) => {
                        const currentDate = new Date();
                        return date.getFullYear() !== currentDate.getFullYear();
                      },
                    ],
                  }}
                />
                {validation.touched.date && validation.errors.date ? (
                  <div className="text-danger error-font">
                    {validation.errors.date}
                  </div>
                ) : null}
              </Col>
              <Col lg={3} className="mb-2">
                <BaseInput
                  name="paid_to"
                  type="text"
                  placeholder={expanseLabels.paidTo}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.paid_to || ""}
                  touched={validation.touched.paid_to}
                  error={validation.errors.paid_to}
                  passwordToggle={false}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={3} className="mb-2">
                <BaseSelect
                  name="payment_mode"
                  className="select-border"
                  options={paymentMode}
                  placeholder={SelectPlaceHolder(expanseLabels.paymentMode)}
                  handleChange={(selectedOption: any) => {
                    validation.setFieldValue(
                      "payment_mode",
                      selectedOption?.value || ""
                    );
                  }}
                  handleBlur={validation.handleBlur}
                  value={
                    dynamicFind(
                      paymentMode,
                      validation?.values?.payment_mode
                    ) || ""
                  }
                  touched={validation.touched.payment_mode}
                  error={validation.errors.payment_mode}
                />
              </Col>
              <Col lg={3} className="mb-2">
                <BaseInput
                  name="amount"
                  type="number"
                  placeholder={InputPlaceHolder(expanseLabels.totalAmount)}
                  handleChange={(e: any) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      validation.handleChange(e);
                    }
                  }}
                  handleBlur={validation.handleBlur}
                  value={validation.values.amount || ""}
                  touched={validation.touched.amount}
                  error={validation.errors.amount}
                  passwordToggle={false}
                />
              </Col>
              <Col lg={3} className="mb-2">
                <BaseInput
                  name="purpose"
                  type="text"
                  placeholder={InputPlaceHolder(expanseLabels.purpose)}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.purpose || ""}
                  touched={validation.touched.purpose}
                  error={validation.errors.purpose}
                  passwordToggle={false}
                />
              </Col>
              <Col lg={3} className="mb-2">
                <BaseButton type="submit" className="btn btn-success w-sm">
                  {expanseLabels.submit}
                </BaseButton>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </Form>
  );
};

export default ExpanseForm;
