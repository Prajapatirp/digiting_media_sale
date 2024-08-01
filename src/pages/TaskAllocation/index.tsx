import BreadCrumb from "Components/Base/BreadCrumb";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Container,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import TableContainer from "Components/Base/TableContainer";
import "flatpickr/dist/themes/material_blue.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DeleteModal from "Components/Base/DeleteModal";
import { stockLabels } from "Components/constants/stock";
import { RequiredField } from "Components/constants/requireMsg";
import {
  handleResponse,
  projectTitle,
  searchPlaceHolder,
} from "Components/constants/common";
import { taskLabels } from "Components/constants/taskAllocation";
import Loader from "Components/Base/Loader";
import {
  stockDetailLabels,
  viewTaskLabel,
} from "Components/constants/stockDetails";
import BaseButton from "Components/Base/BaseButton";
import { Link, useNavigate } from "react-router-dom";
import { deleteTaskApi, taskListApi } from "api/taskApi";
import { CREATED, SUCCESS } from "Components/emus/emus";
import moment from "moment";
import { toast } from "react-toastify";

const TaskAllocation = () => {
  document.title = taskLabels.title;
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<any>();
  const [taskList, setTaskList] = useState<any>();
  const [editData, setEditData] = useState<any>();
  const [viewTask, setViewTask] = useState<Array<any>>();
  const [modalLoader, setModalLoader] = useState<boolean>(false);

  function listoftask() {
    setLoader(true);
    const payload = {};
    taskListApi(payload)
      .then((resp) => {
        setTaskList(resp?.data);
        setLoader(false);
      })
      .catch((err) => {
        setTaskList(null)
        return err;
      })
      .finally(() => setLoader(false));
  }

  useEffect(() => {
    listoftask();
  }, []);

  const toggleDeleteModal = (data: object) => {
    setDeleteLoader(false);
    setDeleteModal(!deleteModal);
    setDeleteId(data);
  };

  const toggleTaskModal = (data: object) => {
    setTaskModal(!taskModal);
    setModalLoader(true);
    const payload = {
      condition: {
        id: data,
      },
    };
    taskListApi(payload)
      .then((resp) => {
        setViewTask(resp?.data[0]);
        setModalLoader(false);
      })
      .catch((error) => {
        return error;
      });
  };

  const handleEditTask = (data: any) => {
    setEditData(data);
    navigate(`/edit-task/${data?.id}`);
  };

  const handleDeleteTask = () => {
    setDeleteLoader(true);
    deleteTaskApi(deleteId)
      .then((resp) => {
        if (resp?.statusCode === CREATED && resp?.status === SUCCESS) {
          listoftask();
          setDeleteLoader(false);
          setDeleteModal(false);
          toast.success(resp?.message);
        }
      })
      .catch((error) => {
        return error;
      });
  };

  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: {
      project_name: "",
      service_name: "",
      senior: "",
      employee: "",
      start_end_date: "",
      start_time: "",
      end_time: "",
      main_activity: "",
      sub_activity: "",
    },
    validationSchema: Yup.object({
      project_name: Yup.string().required(
        RequiredField(taskLabels.projectName)
      ),
      service_name: Yup.string().required(
        RequiredField(taskLabels.serviceName)
      ),
      senior: Yup.string().required(RequiredField(taskLabels.senior)),
      employee: Yup.string().required(RequiredField(taskLabels.employee)),
      start_end_date: Yup.string().required(
        RequiredField(taskLabels.startDateEndDate)
      ),
      start_time: Yup.string().required(RequiredField(taskLabels.startTime)),
      end_time: Yup.string().required(RequiredField(taskLabels.endTime)),
      main_activity: Yup.string().required(
        RequiredField(taskLabels.mainActivity)
      ),
      sub_activity: Yup.string().required(
        RequiredField(taskLabels.subActivity)
      ),
    }),
    onSubmit: (values) => {
      const newProduct = {
        project_name: values.project_name,
        service_name: values.service_name,
        senior: values.senior,
        employee: values.employee,
        start_end_date: values.start_end_date,
        start_time: values.start_time,
        end_time: values.end_time,
        main_activity: values.main_activity,
        sub_activity: values.sub_activity,
      };
      validation.resetForm();
    },
  });

  const columns = useMemo(
    () => [
      {
        header: taskLabels.projectName,
        accessorKey: taskLabels.projectAccessor,
        enableColumnFilter: false,
      },
      {
        header: taskLabels.serviceName,
        accessorKey: taskLabels.serviceAccessor,
        enableColumnFilter: false,
      },
      {
        header: taskLabels.senior,
        accessorKey: taskLabels.seniorAccessor,
        enableColumnFilter: false,
      },
      {
        header: taskLabels.employee,
        accessorKey: taskLabels.employeeAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockLabels.actionHeader,
        cell: (cell: { row: { original: { id: any } } }) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`editMode-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-info edit-list"
              onClick={() => handleEditTask(cell?.row?.original)}
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
              onClick={() => toggleDeleteModal(cell?.row?.original?.id)}
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
              id={`view-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-info view-list"
              onClick={() => toggleTaskModal(cell?.row?.original?.id)}
            >
              <i className="ri-eye-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="info"
                content="View"
                anchorId={`view-${cell?.row?.original?.id}`}
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
      <Container fluid>
        <DeleteModal
          show={deleteModal}
          onCloseClick={() => setDeleteModal(false)}
          onDeleteClick={() => handleDeleteTask()}
          loader={deleteLoader}
        />

        <Modal
          isOpen={taskModal}
          toggle={toggleTaskModal}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader toggle={toggleTaskModal} className="p-3 bg-light p-3">
            {stockDetailLabels?.viewTaskAllocation}
          </ModalHeader>
          {modalLoader && <Loader />}
          <ModalBody>
            {viewTask &&
              [viewTask]?.map((item: any, index: number) => (
                <>
                  <Row key={index} className="mb-2">
                    <Col lg={4}>
                      <Label className="label-Font">
                        {viewTaskLabel?.projectName}
                      </Label>
                    </Col>
                    <Col lg={8}>{item?.project?.project_name}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={4}>
                      <Label className="label-Font">
                        {viewTaskLabel?.serviceName}
                      </Label>
                    </Col>
                    <Col lg={8}>{item?.service?.service_name}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={4}>
                      <Label className="label-Font">
                        {viewTaskLabel?.seniorName}
                      </Label>
                    </Col>
                    <Col lg={8}>{item?.manager?.name}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={4}>
                      <Label className="label-Font">
                        {viewTaskLabel?.employeeName}
                      </Label>
                    </Col>
                    <Col lg={8}>{item?.employee?.name}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={4}>
                      <Label className="label-Font">
                        {viewTaskLabel?.startAndTime}
                      </Label>
                    </Col>
                    <Col lg={8}>
                      {item?.start_time} to {item?.end_time}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={4}>
                      <Label className="label-Font">
                        {viewTaskLabel?.startEndTime}
                      </Label>
                    </Col>
                    <Col lg={8}>{moment(item?.start_date).format("ll")}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={4}>
                      <Label className="label-Font">
                        {viewTaskLabel?.mainActivity}
                      </Label>
                    </Col>
                    <Col lg={8}>{item?.main_activity}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={4}>
                      <Label className="label-Font">
                        {viewTaskLabel?.subActivity}
                      </Label>
                    </Col>
                    <Col lg={8}>{item?.sub_activity}</Col>
                  </Row>
                </>
              ))}
          </ModalBody>
        </Modal>

        <Row>
          <Col lg={12} className="d-flex justify-content-between mb-2">
            <BreadCrumb title={taskLabels.title} pageTitle={projectTitle} />
            <Link to="/add-task">
              <BaseButton color="success" className="btn-label">
                <i className="ri-add-line label-icon align-middle fs-16 me-2"></i>
                {taskLabels.add}
              </BaseButton>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Card id="customerList">
              {loader ? (
                <Loader />
              ) : (
                <div className="card-body pt-0">
                  <div>
                    {taskList?.length > 0 && !loader ? (
                      <TableContainer
                        isHeaderTitle={taskLabels.taskAllocationList}
                        columns={columns}
                        data={taskList || []}
                        isGlobalFilter={true}
                        customPageSize={5}
                        theadClass="table-light text-muted"
                        SearchPlaceholder={searchPlaceHolder}
                      />
                    ) : (
                      <div className="py-5 text-center">
                        <i className="ri-search-line d-block fs-1 text-success"></i>
                        {handleResponse?.dataNotFound}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TaskAllocation;
