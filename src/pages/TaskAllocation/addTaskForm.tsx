import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RequiredField } from "Components/constants/requireMsg";
import { managerList, taskLabels } from "Components/constants/taskAllocation";
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
import { BaseSelect } from "Components/Base/BaseSelect";
import {
  InputPlaceHolder,
  SelectPlaceHolder,
} from "Components/constants/validation";
import BaseInput from "Components/Base/BaseInput";
import Flatpickr from "react-flatpickr";
import { stockLabels } from "Components/constants/stock";
import BaseButton from "Components/Base/BaseButton";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { errorHandle } from "helpers/service";
import { listOfServiceType, listOfUser } from "api/listApi";
import { CREATED, OK, SUCCESS, getItem } from "Components/emus/emus";
import { toast } from "react-toastify";
import {
  positiveNumberRegex,
  roleEnums,
  validationMessages,
} from "Components/constants/common";
import { listOfProject } from "api/projectApi";
import { addTaskApi, editTaskApi, listOfUnit, taskListApi } from "api/taskApi";
import { Session } from "inspector";
type UserList = {
  id?: number;
  name?: string;
  role?: string;
  designation?: string | undefined;
  unit?: string;
};
type ProjectList = {
  id?: number;
  project_name?: string;
};

type Service = {
  id: number;
  service_name: string;
};

interface ServiceType {
  id: number;
  service_id: number;
  service: Service;
}

const TaskAllocationSteps = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  let roleId: any = getItem("id");
  const [loader, setLoader] = useState<boolean>(true);
  const [activeArrowTab, setActiveArrowTab] = useState(4);
  const [passedArrowSteps, setPassedArrowSteps] = useState([1]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [mangerList, setMangerList] = useState<any[]>();
  const [unitList, setUnitList] = useState<any[]>();
  const [vendorList, setVendorList] = useState<UserList[]>();
  const [employeeList, setEmployeeList] = useState<UserList[]>();
  const [projectList, setProjectList] = useState<ProjectList[]>();
  const [vendorServiceTypeList, setVendorServiceTypeList] =
    useState<ServiceType[]>();
  const [designationList, setDesignationList] = useState<string | undefined>();
  const [isEnable, setIsEnable] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>();
  let role: any = getItem("role");
  let startTimeValue: number;
  let endTimeValue: number;

  let totalMenday;
  let output;
  const editUserList = {
    role: "Vendor",
    id: editData?.vendor?.id,
    name: editData?.vendor?.name,
  };

  function toggleArrowTab(tab: any) {
    if (activeArrowTab !== tab) {
      let modifiedSteps = [...passedArrowSteps, tab];

      if (tab >= 4 && tab <= 7) {
        setActiveArrowTab(tab);
        setPassedArrowSteps(modifiedSteps);
      }
    }
  }

  function fetchIfEdit() {
    if (id) {
      const payload = {
        condition: {
          id: id,
        },
      };
      taskListApi(payload)
        .then((resp) => {
          setEditData(resp?.data[0]);
          setSelectedDate(resp?.data[0].start_date);
          listData(editUserList);
          fetchData();
        })
        .catch((error) => {
          return error;
        });
    } else {
      return id;
    }
  }

  async function fetchData() {
    //For Unit
    listOfUnit({})
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setUnitList(
            res?.data?.map((item: UserList) => ({
              value: item?.id,
              label: item?.unit,
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

    //For manager
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

    //For vendor
    listOfUser({
      condition: {
        role: roleEnums.Vendor,
      },
    })
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setVendorList(
            res?.data?.map((item: UserList) => ({
              value: item?.id,
              label: item?.name,
              id: item?.id,
              role: item?.role,
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

    //For employee
    listOfUser({
      condition: {
        role: roleEnums.Employee,
      },
    })
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setEmployeeList(
            res?.data?.map((item: UserList) => ({
              value: item?.id,
              label: item?.name,
              id: item?.id,
              role: item?.role,
              designation: item?.designation,
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

  function listData(item: UserList) {
    if (item?.role === roleEnums.Vendor) {
      listOfServiceType({
        condition: {
          auth_id: item?.id,
        },
      })
        .then((res) => {
          if (res?.statusCode === OK && res?.status === SUCCESS) {
            setVendorServiceTypeList(
              res?.data?.map((item: ServiceType) => ({
                value: item?.service_id || "",
                label: item?.service.service_name || "",
                id: item?.id || "",
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
    }

    if (item?.role === roleEnums.Employee) {
      setDesignationList(item?.designation);
    }
  }

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_name: id ? editData?.project?.id : null,
      manager_name: id ? editData?.manager?.id : null,
      manager_id: id ? editData?.manager?.id : null,
      managerId: id ? editData?.manager?.id : null,
      day: id ? moment(editData?.start_date).format("dddd") : "",
      employee: id ? editData?.employee?.id : null,
      employeeId: id ? editData?.employee?.id : null,
      start_date: id ? moment(editData?.start_date).format("ll") : "",
      start_end_date: id ? moment(editData?.start_date).format("ll") : "",
      start_time: id ? editData?.start_time : "",
      end_time: id ? editData?.end_time : "",
      skilled_workers: id ? editData?.skilled_worker : null,
      unskilled_workers: id ? editData?.unskilled_worker : null,
      total_workers: id ? editData?.total_worker : null,
      vendor_name: id ? editData?.vendor?.id : null,
      service_type: id ? editData?.service?.id : null,
      employee_name: id ? editData?.employee.id : "",
      designation: id ? editData?.designation : "",
    },
    validationSchema: Yup.object({
      project_name: Yup.string().required(
        RequiredField(taskLabels.projectName)
      ),
      vendor_name: Yup.number().required(RequiredField(taskLabels.vendorName)),
      service_type: Yup.number().required(
        RequiredField(taskLabels.serviceName)
      ),
      employee_name: Yup.string().required(
        RequiredField(taskLabels.employeeName)
      ),
      designation: Yup.string().required(RequiredField(taskLabels.designation)),
      manager_name:
        roleId > 1
          ? Yup.string().notRequired()
          : Yup.string().required(RequiredField(taskLabels.managerName)),
      day: Yup.string().required(RequiredField(taskLabels.day)),
      start_date: Yup.string().required(
        RequiredField(taskLabels.startDateEndDate)
      ),
      employee: Yup.string().required(RequiredField(taskLabels.employee)),
      start_time: Yup.string().required(RequiredField(taskLabels.startTime)),
      end_time: Yup.string().required(RequiredField(taskLabels.endTime)),
      skilled_workers: Yup.string()
        .required(validationMessages.required(taskLabels.skilledWorkers))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(taskLabels?.skilledWorkers)
        ),
      unskilled_workers: Yup.string()
        .required(RequiredField(taskLabels.unskilledWorkers))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(taskLabels?.unskilledWorkers)
        ),
      total_workers: Yup.number().required(
        RequiredField(taskLabels.totalWorkers)
      ),
    }),

    onSubmit: (values) => {
      toggleArrowTab(5);
    },
  });
  const description: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      location: id ? editData?.location : "",
      main_activity: id ? editData?.main_activity : "",
      sub_activity: id ? editData?.sub_activity : "",
      quantity: id ? editData?.quantity : null,
      unit: id ? editData?.unit?.id : null,
      totalMenday: id ? editData?.total_menday : 0,
      output: id ? editData?.output : 0,
    },
    validationSchema: Yup.object({
      main_activity: Yup.string().required(
        RequiredField(taskLabels.mainActivity)
      ),
      sub_activity: Yup.string().required(
        RequiredField(taskLabels.subActivity)
      ),
      location: Yup.string().required(RequiredField(taskLabels.location)),
      quantity: Yup.string()
        .required(RequiredField(taskLabels.quantity))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(taskLabels?.quantity)
        ),
      unit: Yup.string().required(RequiredField(taskLabels.unit)),
      output: Yup.number().required(RequiredField(taskLabels.output)),
    }),

    onSubmit: (values) => {
      toggleArrowTab(6);
    },
  });
  useEffect(() => {
    fetchData();
    fetchIfEdit();
  }, []);
  const finish = useFormik({
    enableReinitialize: true,
    initialValues: {
      issue: id ? editData?.issue : "",
      solution: id ? editData?.solution : "",
      reportBy: id ? editData?.reportBy : "",
      description: id ? editData?.description : "",
    },

    onSubmit: (values) => {
      const payload = {
        projectId: validation.values.project_name,
        managerId:
          roleId > 1 ? parseInt(roleId) : validation.values.manager_name,
        vendorId: validation.values.vendor_name,
        serviceId: validation.values.service_type,
        day: validation.values.day,
        employeeId: validation.values.employee,
        employee: validation.values.employee_name,
        startDate: validation.values.start_date,
        startTime: id
          ? editData?.start_time !== validation.values.start_time
            ? validation.values.start_time
            : editData?.start_time
          : validation.values.start_time,
        endTime: id
          ? editData?.end_time !== validation.values.end_time
            ? validation.values.end_time
            : editData?.end_time
          : validation.values.end_time,
        designation: validation.values.designation,
        skilledWorker: validation.values.skilled_workers,
        unskilledWorker: validation.values.unskilled_workers,
        TotalWorker: validation.values.total_workers,
        location: description.values.location,
        mainActivity: description.values.main_activity,
        subActivity: description.values.sub_activity,
        quantity: description.values.quantity,
        unitId: description.values.unit,
        totalMenday: description.values.totalMenday,
        output: description.values.output,
        issue: values.issue,
        solution: values.solution,
        reportBy: values.reportBy,
        description: values.description,
      };
      if (id) {
        editTaskApi(parseInt(id), payload)
          .then((resp) => {
            if (resp?.statusCode === CREATED && resp?.status === SUCCESS) {
              toast.success(resp?.message);
              navigate("/task-allocation");
            }
          })
          .catch((err) => {
            return err;
          });
      } else {
        addTaskApi(payload)
          .then((resp) => {
            if (resp?.statusCode === CREATED && resp?.status === SUCCESS) {
              toast.success(resp?.message);
              navigate("/task-allocation");
            }
          })
          .catch((err) => {
            return err;
          });
      }
    },
  });

  useEffect(() => {
    let skilled = validation.values.skilled_workers;
    let unskilled = validation.values.unskilled_workers;
    validation.setFieldValue("total_workers", skilled + unskilled);

    let endTime = id
      ? editData?.end_time !== validation.values.end_time
        ? parseInt(validation.values.end_time.split(" ")[0])
        : parseInt(editData?.end_time.split(" ")[0])
      : parseInt(validation.values.end_time.split(" ")[0]);

    let startTime = id
      ? editData?.start_time !== validation.values.start_time
        ? parseInt(validation.values.start_time.split(" ")[0])
        : parseInt(editData?.start_time.split(" ")[0])
      : parseInt(validation.values.start_time.split(" ")[0]);

    totalMenday = id
      ? editData?.total_worker !== validation.values.total_workers ||
        editData?.start_time !== validation.values.start_time ||
        editData?.end_time !== validation.values.end_time
        ? validation.values.total_workers * (endTime - startTime)
        : editData?.total_menday
      : validation.values.total_workers * (endTime - startTime);
    description.setFieldValue("totalMenday", totalMenday);

    output = id
      ? editData?.quantity !== description.values.quantity ||
        editData?.total_menday !== description.values.totalMenday
        ? description.values.totalMenday / description.values.quantity
        : editData?.output
      : description.values.totalMenday / description.values.quantity;

    description.setFieldValue("output", Math.round(output * 100) / 100);
  }, [
    validation.values.skilled_workers,
    description.values.totalMenday,
    validation.values.unskilled_workers,
    validation.values.total_workers,
    validation.values.end_time,
    validation.values.start_time,
    description.values.quantity,
  ]);

  useEffect(() => {
    if (id) {
      let editTotalMenday = editData?.total_menday ?? 0;
      let editOutput = editData?.output ?? 0;
      validation.setFieldValue("totalMenday", editTotalMenday);
      validation.setFieldValue("output", editOutput);
    }
  }, [id, editData]);

  const handleDateChange = (date: Date[]) => {
    setSelectedDate(date[0]);
    const dayName = date[0].toLocaleDateString("en-US", { weekday: "long" });
    validation.setFieldValue("start_end_date", date.toString());
    validation.setFieldValue("start_date", date.toString());
    validation.setFieldValue("day", dayName);
  };

  const handleTimeChange = (date: any) => {
    let time = date[0].toLocaleString();
    const date1 = new Date(time);

    let hours = date1.getHours();
    const minutes = date1.getMinutes();

    const formattedHours: any = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    validation.setFieldValue(
      "start_time",
      `${formattedHours}:${formattedMinutes}`
    );

    startTimeValue = parseInt(formattedHours);
  };
  const handleEndTimeChange = (date: any) => {
    let time = date[0].toLocaleString();
    const date1 = new Date(time);

    let hours = date1.getHours();
    const minutes = date1.getMinutes();

    const formattedHours: any = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    validation.setFieldValue(
      "end_time",
      `${formattedHours}:${formattedMinutes}`
    );
    endTimeValue = parseInt(formattedHours);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Add Task Allocation Details</h4>
                <Link
                  to="/task-allocation"
                  type="submit"
                  className="btn btn-success ms-auto right w-sm"
                >
                  Back
                </Link>
              </CardHeader>
              <CardBody>
                <Form className="" onSubmit={finish.handleSubmit}>
                  <div className="pt-3 pb-4 mb-1">
                    <Row className="mb-2">
                      <Col lg={3}>
                        <Label
                          className="form-label"
                          htmlFor="steparrow-gen-info-password-input"
                        >
                          {taskLabels?.projectName}*
                        </Label>
                        <BaseSelect
                          name="project_name"
                          className="select-border"
                          options={projectList}
                          placeholder={SelectPlaceHolder(
                            taskLabels?.projectName
                          )}
                          handleChange={(selectedOption: any) => {
                            validation.setFieldValue(
                              "project_name",
                              selectedOption?.value || ""
                            );
                          }}
                          handleBlur={validation.handleBlur}
                          value={projectList?.find(
                            (option: any) =>
                              option?.value === validation?.values?.project_name
                          )}
                          touched={validation.touched.project_name}
                          error={validation.errors.project_name}
                        />
                      </Col>
                      <Col lg={3}>
                        <Label
                          className="form-label"
                          htmlFor="steparrow-gen-info-password-input"
                        >
                          {taskLabels?.managerName}*
                        </Label>
                        <BaseSelect
                          name="manager_name"
                          className="select-border"
                          options={mangerList}
                          placeholder={SelectPlaceHolder(
                            taskLabels?.projectManagerName
                          )}
                          handleChange={(selectedOption: any) => {
                            validation.setFieldValue(
                              "manager_name",
                              selectedOption?.value || ""
                            );
                          }}
                          handleBlur={validation.handleBlur}
                          value={
                            roleId > 1
                              ? mangerList?.find(
                                  (option: any) =>
                                    option?.value === parseInt(roleId)
                                )
                              : mangerList?.find(
                                  (option: any) =>
                                    option?.value ===
                                    validation?.values?.manager_name
                                )
                          }
                          touched={validation.touched.manager_name}
                          error={validation.errors.manager_name}
                          isDisabled={roleId > 1 ? true : false}
                        />
                      </Col>
                      <Col lg={3}>
                        <Label
                          className="form-label"
                          htmlFor="steparrow-gen-info-password-input"
                        >
                          {taskLabels?.startDateEndDate}*
                        </Label>
                        <Flatpickr
                          name="start_end_date"
                          className="form-control task-date-picker"
                          placeholder={stockLabels.date}
                          value={selectedDate}
                          onChange={handleDateChange}
                          options={{
                            dateFormat: "d M, Y",
                            disable: [
                              (date) => {
                                const currentDate = new Date();
                                return (
                                  date.getMonth() !== currentDate.getMonth() ||
                                  date.getFullYear() !==
                                    currentDate.getFullYear()
                                );
                              },
                            ],
                          }}
                        />
                        {validation.touched.start_date &&
                        validation.errors.start_date ? (
                          <div className="text-danger error-font">
                            {`${validation.errors.start_date}`}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={3}>
                        <Label
                          className="form-label"
                          htmlFor="steparrow-gen-info-password-input"
                        >
                          {taskLabels?.day}*
                        </Label>
                        <BaseInput
                          name="day"
                          type="text"
                          placeholder="Day"
                          disabled={true}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.day}
                          touched={validation.touched.day}
                          error={validation.errors.day}
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="step-arrow-nav mb-4">
                    <Nav
                      className="nav-pills custom-nav nav-justified"
                      role="tablist"
                    >
                      <NavItem>
                        <NavLink
                          to="#"
                          id="steparrow-gen-info-tab"
                          className={classnames({
                            active: activeArrowTab === 4,
                            done: activeArrowTab <= 6 && activeArrowTab > 3,
                          })}
                          onClick={() => {
                            toggleArrowTab(4);
                          }}
                        >
                          Vendor Details & Menpower
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          to="#"
                          id="steparrow-gen-info-tab"
                          className={classnames({
                            active: activeArrowTab === 5,
                            done: activeArrowTab <= 6 && activeArrowTab > 4,
                          })}
                          onClick={() => validation.handleSubmit()}
                        >
                          Description Of Work
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          to="#"
                          id="steparrow-gen-info-tab"
                          className={classnames({
                            active: activeArrowTab === 6,
                            done: activeArrowTab <= 6 && activeArrowTab > 5,
                          })}
                          onClick={description.handleSubmit}
                        >
                          Finish
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>

                  <TabContent activeTab={activeArrowTab}>
                    <TabPane id="steparrow-gen-info" tabId={4}>
                      <div>
                        <Row>
                          <Col lg={6} md={6} sm={12}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-email-input"
                              >
                                {taskLabels?.vendorName}*
                              </Label>

                              <BaseSelect
                                name="vendor_name"
                                className="select-border"
                                options={vendorList}
                                placeholder={SelectPlaceHolder(
                                  taskLabels?.vendorName
                                )}
                                handleChange={(selectedOption: any) => {
                                  validation.setFieldValue(
                                    "vendor_name",
                                    selectedOption?.value || ""
                                  );
                                  setIsEnable(true);
                                  listData(selectedOption);
                                }}
                                handleBlur={validation.handleBlur}
                                value={vendorList?.find(
                                  (option: any) =>
                                    option?.value ===
                                    validation?.values?.vendor_name
                                )}
                                touched={validation.touched.vendor_name}
                                error={validation.errors.vendor_name}
                              />
                            </div>
                          </Col>
                          <Col lg={6} md={6} sm={12}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-username-input"
                              >
                                {taskLabels?.serviceName}*{isEnable}
                              </Label>
                              <BaseSelect
                                name="service_type"
                                className="select-border"
                                options={vendorServiceTypeList}
                                placeholder="Select type of work"
                                handleChange={(selectedOption: any) => {
                                  validation.setFieldValue(
                                    "service_type",
                                    selectedOption?.value || ""
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={vendorServiceTypeList?.find(
                                  (option: any) =>
                                    option?.value ===
                                    validation?.values?.service_type
                                )}
                                touched={validation.touched.service_type}
                                error={validation.errors.service_type}
                                isDisabled={isEnable ? false : true}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4} md={4} sm={12}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="skilled_workers"
                              >
                                {taskLabels?.skilledWorkers}*
                              </Label>
                              <BaseInput
                                name="skilled_workers"
                                type="number"
                                className="form-control"
                                id="skilled_workers"
                                placeholder="Enter skilled worker"
                                value={validation.values.skilled_workers}
                                handleChange={validation.handleChange}
                                handleBlur={validation.handleBlur}
                                touched={validation.touched.skilled_workers}
                                error={validation.errors.skilled_workers}
                                re
                                min="0"
                              />
                            </div>
                          </Col>
                          <Col lg={4} md={4} sm={12}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-password-input"
                              >
                                {taskLabels?.unskilledWorkers}*
                              </Label>
                              <BaseInput
                                name="unskilled_workers"
                                type="number"
                                className="form-control"
                                id="steparrow-gen-info-password-input"
                                placeholder="Enter unskilled worker"
                                value={validation.values.unskilled_workers}
                                handleChange={validation.handleChange}
                                handleBlur={validation.handleBlur}
                                touched={validation.touched.unskilled_workers}
                                error={validation.errors.unskilled_workers}
                                min="0"
                              />
                            </div>
                          </Col>
                          <Col lg={4} md={4} sm={12}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-password-input"
                              >
                                {taskLabels?.totalWorkers}*
                              </Label>
                              <Input
                                name="total_workers"
                                type="text"
                                className="form-control"
                                id="steparrow-gen-info-password-input"
                                value={
                                  validation.values.unskilled_workers !== 0
                                    ? validation.values.unskilled_workers +
                                      validation.values.skilled_workers
                                    : validation.values.skilled_workers || 0
                                }
                                placeholder="Total workers"
                                disabled={true}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3} md={6} sm={12}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-email-input"
                              >
                                {taskLabels.employeeName}*
                              </Label>

                              <BaseSelect
                                name="employee_name"
                                className="select-border"
                                options={employeeList}
                                placeholder={SelectPlaceHolder(
                                  taskLabels.employeeName
                                )}
                                handleChange={(selectedOption: any) => {
                                  validation.setFieldValue(
                                    "employee_name",
                                    selectedOption?.label || ""
                                  );
                                  listData(selectedOption);
                                  validation.setFieldValue(
                                    "designation",
                                    selectedOption?.designation || ""
                                  );
                                  validation.setFieldValue(
                                    "employee",
                                    selectedOption?.value || ""
                                  );
                                }}
                                handleBlur={validation.handleBlur}
                                value={employeeList?.find(
                                  (option: any) =>
                                    option?.value ===
                                    validation?.values?.employee_name
                                )}
                                touched={validation.touched.employee_name}
                                error={validation.errors.employee_name}
                              />
                            </div>
                          </Col>
                          <Col lg={3} md={6} sm={12}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-username-input"
                              >
                                {taskLabels?.designation}*
                              </Label>
                              <BaseInput
                                name="designation"
                                type="text"
                                placeholder={InputPlaceHolder(
                                  taskLabels.designation
                                )}
                                handleChange={validation.handleChange}
                                handleBlur={validation.handleBlur}
                                value={validation.values.designation}
                                touched={validation.touched.designation}
                                error={validation.errors.designation}
                                passwordToggle={false}
                                disabled={true}
                                required={false}
                              />
                            </div>
                          </Col>
                          <Col lg={3} md={6} sm={12}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-email-input"
                              >
                                {taskLabels.startTime}*
                              </Label>
                              <Flatpickr
                                className="form-control"
                                placeholder={InputPlaceHolder(
                                  taskLabels.startTime
                                )}
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: "H:i",
                                  time_24hr: true,
                                }}
                                value={validation.values.start_time}
                                onChange={handleTimeChange}
                              />
                              {validation.touched.start_time &&
                              validation.errors.start_time ? (
                                <div className="text-danger error-font">
                                  {`${validation.errors.start_time}`}
                                </div>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={3} md={6} sm={12}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-email-input"
                              >
                                {taskLabels.endTime}
                              </Label>
                              <Flatpickr
                                name="end_time"
                                className="form-control"
                                placeholder={InputPlaceHolder(
                                  taskLabels.endTime
                                )}
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: "H:i",
                                  time_24hr: true,
                                }}
                                value={validation.values.end_time}
                                onChange={handleEndTimeChange}
                                onBlur={validation.handleBlur}
                              />
                              {validation.touched.end_time &&
                              validation.errors.end_time ? (
                                <div className="text-danger error-font">
                                  {`${validation.errors.end_time}`}
                                </div>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="d-flex align-items-start gap-3 mt-4">
                        <button
                          type="button"
                          className="btn btn-success btn-label right ms-auto nexttab nexttab"
                          onClick={() => validation.handleSubmit()}
                        >
                          <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                          Next
                        </button>
                      </div>
                    </TabPane>

                    <TabPane id="steparrow-description-info" tabId={5}>
                      <div>
                        <Row>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-email-input"
                              >
                                {taskLabels?.location}*
                              </Label>
                              <BaseInput
                                name="location"
                                type="text"
                                className="form-control"
                                id="steparrow-gen-info-email-input"
                                placeholder="Enter Location"
                                value={description.values.location}
                                handleChange={description.handleChange}
                                handleBlur={description.handleBlur}
                                touched={description.touched.location}
                                error={description.errors.location}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="">
                                {taskLabels?.mainActivity}*
                              </Label>
                              <BaseInput
                                type="text"
                                className="form-control"
                                name="main_activity"
                                placeholder="Enter main activity"
                                value={description.values.main_activity}
                                handleChange={description.handleChange}
                                handleBlur={description.handleBlur}
                                touched={description.touched.main_activity}
                                error={description.errors.main_activity}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="">
                                {taskLabels?.subActivity}*
                              </Label>
                              <BaseInput
                                type="text"
                                className="form-control"
                                name="sub_activity"
                                placeholder="Enter sub activity"
                                value={description.values.sub_activity}
                                handleChange={description.handleChange}
                                handleBlur={description.handleBlur}
                                touched={description.touched.sub_activity}
                                error={description.errors.sub_activity}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-email-input"
                              >
                                {taskLabels?.quantity}*
                              </Label>
                              <BaseInput
                                type="number"
                                className="form-control"
                                name="quantity"
                                placeholder="Enter quantity"
                                value={description.values.quantity}
                                handleChange={description.handleChange}
                                handleBlur={description.handleBlur}
                                touched={description.touched.quantity}
                                error={description.errors.quantity}
                                min="0"
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-email-input"
                              >
                                {taskLabels?.unit}*
                              </Label>
                              {/* <BaseInput
                                type="number"
                                className="form-control"
                                name="unit"
                                placeholder="Enter unit"
                                value={description.values.unit}
                                handleChange={description.handleChange}
                                handleBlur={description.handleBlur}
                                touched={description.touched.unit}
                                error={description.errors.unit}
                                min="0"
                              /> */}
                              <BaseSelect
                                name="unit"
                                className="select-border"
                                options={unitList}
                                placeholder={SelectPlaceHolder(
                                  taskLabels?.unit
                                )}
                                handleChange={(selectedOption: any) => {
                                  description.setFieldValue(
                                    "unit",
                                    selectedOption?.value || ""
                                  );
                                }}
                                handleBlur={description.handleBlur}
                                value={unitList?.find(
                                  (option: any) =>
                                    option?.value === description?.values?.unit
                                )}
                                touched={description.touched.unit}
                                error={description.errors.unit}
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-email-input"
                              >
                                {taskLabels?.totalMenday}*
                              </Label>
                              <Input
                                name="total_menday"
                                type="text"
                                className="form-control"
                                id="steparrow-gen-info-email-input"
                                value={description.values.totalMenday}
                                placeholder="Enter total menday"
                                disabled={true}
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Label
                                className="form-label"
                                htmlFor="steparrow-gen-info-email-input"
                              >
                                {taskLabels?.output}*
                              </Label>
                              <Input
                                name="output"
                                type="text"
                                className="form-control"
                                value={description.values.output}
                                id="steparrow-gen-info-email-input"
                                placeholder="Enter output"
                                disabled={true}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="d-flex align-items-start gap-3 mt-4">
                        <button
                          type="button"
                          className="btn btn-light btn-label previestab"
                          onClick={() => {
                            toggleArrowTab(activeArrowTab - 1);
                          }}
                        >
                          <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>{" "}
                          Back
                        </button>
                        <button
                          type="button"
                          className="btn btn-success btn-label right ms-auto nexttab nexttab"
                          onClick={description.handleSubmit}
                        >
                          <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                          Next
                        </button>
                      </div>
                    </TabPane>

                    <TabPane id="pills-experience" tabId={6}>
                      <Row className="mb-2">
                        <Col lg={4}>
                          <Label
                            className="form-label"
                            htmlFor="steparrow-gen-info-email-input"
                          >
                            {taskLabels?.issue}
                          </Label>
                          <Input
                            name="issue"
                            type="text"
                            className="form-control"
                            id="steparrow-gen-info-email-input"
                            placeholder="Enter issue on site"
                            value={finish.values.issue}
                            onChange={finish.handleChange}
                          />
                        </Col>
                        <Col lg={4}>
                          <Label
                            className="form-label"
                            htmlFor="steparrow-gen-info-email-input"
                          >
                            {taskLabels?.solution}
                          </Label>
                          <Input
                            name="solution"
                            type="text"
                            className="form-control"
                            id="steparrow-gen-info-email-input"
                            placeholder="Enter solution"
                            value={finish.values.solution}
                            onChange={finish.handleChange}
                          />
                        </Col>
                        <Col lg={4}>
                          <Label
                            className="form-label"
                            htmlFor="steparrow-gen-info-username-input"
                          >
                            {taskLabels?.report}
                          </Label>
                          <Input
                            name="reportBy"
                            type="text"
                            className="form-control"
                            id="steparrow-gen-info-email-input"
                            placeholder="Enter reporter name"
                            value={role}
                            onChange={finish.handleChange}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <Label
                            className="form-label"
                            htmlFor="gen-info-description-input"
                          >
                            {taskLabels?.description}
                          </Label>
                          <Input
                            name="description"
                            type="textarea"
                            className="form-control"
                            placeholder="Enter Description"
                            id="gen-info-description-input"
                            rows="2"
                            value={finish.values.description}
                            onChange={finish.handleChange}
                          ></Input>
                        </Col>
                      </Row>
                      <div className="d-flex align-items-start gap-3 mt-4">
                        <button
                          type="button"
                          className="btn btn-light btn-label previestab"
                          onClick={() => {
                            toggleArrowTab(activeArrowTab - 1);
                          }}
                        >
                          <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>{" "}
                          Back
                        </button>
                        <BaseButton
                          type="submit"
                          className="btn btn-success ms-auto right w-sm"
                        >
                          Submit
                        </BaseButton>
                      </div>
                    </TabPane>
                  </TabContent>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TaskAllocationSteps;
