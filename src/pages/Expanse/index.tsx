import BreadCrumb from "Components/Base/BreadCrumb";
import { useMemo, useState, useEffect } from "react";
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
import TableContainer from "Components/Base/TableContainer";
import { ToastContainer, toast } from "react-toastify";
import {
  handleEditClick,
  handleResponse,
  searchPlaceHolder,
} from "../../Components/constants/common";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DeleteModal from "Components/Base/DeleteModal";
import { projectTitle } from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseButton from "Components/Base/BaseButton";
import {
  expanseLabels,
  expanseTable,
  expanseTableList,
  viewExpanse,
} from "Components/constants/expanse";
import ExpanseForm from "./ExpanseForm";
import { deleteExpense, listOfExpense, viewExpense } from "api/expanseApi";
import { errorHandle } from "helpers/service";
import { OK, SUCCESS } from "Components/emus/emus";

const Expanse = () => {
  document.title = expanseLabels.title;
  const [deleteModal, setDeleteModal] = useState(false);
  const [expanseModal, setExpanseModal] = useState(false);
  const [expenseTables, setExpenseTable] = useState<any>("");
  const [selectedId, setSelectedId] = useState<number>();
  const [loader, setLoader] = useState<boolean>(true);
  const [modalLoader, setModalLoader] = useState<boolean>(false);
  const [viewExpanseDetails, setViewExpenseDetails] = useState<any>();
  const [expenseProject, setExpenseProject] = useState<any>();

  function deleteRecord() {
    setLoader(true);
    deleteExpense(selectedId)
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          toast.success(res?.message);
          setDeleteModal(false);
          listExpense();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setDeleteModal(false);
        setLoader(false);
      });
  }

  const toggleDeleteModal = (id: number) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const toggleExpanseModal = (cell: any) => {
    setModalLoader(true);
    setExpanseModal((prevIsView) => !prevIsView);
    listExpense(cell.id);
  };

  function listExpense(id?: number) {
    let condition: any = {};
    if (id) {
      setModalLoader(true);
      condition.id = id;
    }
    listOfExpense()
      .then((res) => {
        setLoader(false);
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          if (id) {
            setLoader(true);
            const selectedData = res?.data.find((item: any) => item.id === id);
            setViewExpenseDetails(selectedData);
            setLoader(false);
          } else {
            setExpenseTable(res?.data);
          }
        } else {
          return res
        }
        setLoader(false);
      })
      .catch((error) => {
        return error;
      })
      .finally(() => {
        setLoader(false);
        setModalLoader(false);
      });
  }

  useEffect(() => {
    listExpense();
  }, []);

  const updateExpenseList = () => {
    setLoader(true);
    listExpense();
  };

  const columns = useMemo(
    () => [
      {
        header: expanseTable.project,
        accessorKey: expanseTable.projectAccessor,
        enableColumnFilter: false,
      },
      {
        header: expanseTable.projectManager,
        accessorKey: expanseTable.projectManagerAccessor,
        enableColumnFilter: false,
      },
      {
        header: expanseTable.paidTo,
        accessorKey: expanseTable.paidToAccessor,
        enableColumnFilter: false,
      },
      {
        header: expanseTable.amount,
        accessorKey: expanseTable.amountAccessor,
        enableColumnFilter: false,
        cell: (cell: { row: { original: { amount: number } } }) => (
          <div>{`Rs. ${cell?.row?.original?.amount}`}</div>
        ),
      },
      {
        header: expanseTable.date,
        accessorKey: expanseTable.dateAccessor,
        enableColumnFilter: false,
      },
      {
        header: expanseTable.action,
        cell: (cell: { row: { original: { id: number } } }) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`editMode-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-secondary edit-list"
              onClick={() => {
                setExpenseProject(cell?.row?.original);
                handleEditClick();
              }}
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
              id={`usage-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-success usage-list"
              onClick={() => {
                toggleExpanseModal(cell?.row?.original);
              }}
            >
              <i className="ri-eye-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="success"
                content="View Expanse"
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
      <Container fluid>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={deleteRecord}
          onCloseClick={() => setDeleteModal(false)}
          loader={loader}
        />

        <Modal
          isOpen={expanseModal}
          toggle={toggleExpanseModal}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader toggle={toggleExpanseModal} className="p-3 bg-light p-3">
            {expanseLabels?.viewExpanseDetail}
          </ModalHeader>
          {modalLoader && <Loader />}
          <ModalBody>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{expanseLabels.project}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewExpanseDetails?.project?.project_name}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">
                  {expanseLabels.projectManager}
                </Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewExpanseDetails?.project_manager.name}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">
                  {expanseLabels.paymentMode}
                </Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewExpanseDetails?.payment_mode}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{expanseLabels.paidTo}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewExpanseDetails?.paid_to}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{expanseLabels.purpose}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewExpanseDetails?.purpose}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{expanseLabels.date}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewExpanseDetails?.date}
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        <BreadCrumb title={expanseLabels.title} pageTitle={projectTitle} />
        <Row>
          <Col lg={12}>
            <ExpanseForm
              initialValues={expenseProject}
              sendDataToParent={updateExpenseList}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Card id="expanseList">
              {loader ? (
                <Loader />
              ) : (
                <div className="card-body pt-0">
                  <div>
                    {expenseTables?.length ? (
                      <TableContainer
                        isHeaderTitle={expanseLabels.expanseList}
                        columns={columns}
                        data={expenseTables || []}
                        isGlobalFilter={true}
                        customPageSize={5}
                        theadClass="table-light text-muted"
                        SearchPlaceholder={searchPlaceHolder}
                      />
                    ) : (
                      <div className="py-4 text-center">
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

export default Expanse;
