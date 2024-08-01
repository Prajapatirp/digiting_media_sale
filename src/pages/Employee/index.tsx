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
import { toast } from "react-toastify";
import { roleEnums, searchPlaceHolder } from "../../Components/constants/common";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DeleteModal from "Components/Base/DeleteModal";
import { projectTitle } from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseButton from "Components/Base/BaseButton";
import { employeeKey, employeeLabel } from "Components/constants/employee";
import EmployeeForm from "./EmployeeForm";
import { documentTitle, errorHandle } from "helpers/service";
import { deleteUser, listOfUser } from "api/usersApi";
import { OK, SUCCESS } from "Components/emus/emus";

const Employee = () => {
  document.title = documentTitle(employeeLabel.Title);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [listUser, setListOfUser] = useState([]);
  const [deleteId, setDeleteId] = useState<any>();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [modalLoader, setModalLoader] = useState<boolean>(false);
  const [employeeDetailsModal, setEmployeeDetailsModal] = useState(false);
  const [viewEmployeeDetails, setViewEmployeeDetails] = useState<any>();
  const [getInitialValues, setGetInitialValues] = useState<any>();

  const onClickDelete = (id: number) => {
    setDeleteModal(!deleteModal);
    setDeleteId(id);
  };

  function deleteRecord() {
    setDeleteLoader(true);
    deleteUser(deleteId)
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setDeleteModal(false);
          toast.success(res?.message);
          fetchData();
        } else {
          setDeleteModal(false);
          toast.success(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => setDeleteLoader(false));
  }

  function fetchData(id?: number) {
    let condition: any = {};
    if (id) {
      setModalLoader(true);
      condition.id = id;
    }

    listOfUser({ condition })
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          if (id) {
            setViewEmployeeDetails(res?.data[0]);
          } else {
            setListOfUser(res?.data);
          }
          toast.success(res?.message);
          setLoader(false);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        if (!id) {
          errorHandle(error);
        } else {
          return error;
        }
      })
      .finally(() => {
        setLoader(false);
        setModalLoader(false);
      });
  }

  const toggleEmployeeModal = (cell: any) => {
    setModalLoader(true);
    setEmployeeDetailsModal(!employeeDetailsModal);
    fetchData(cell);
  };

  const updatedUser = () => {
    setLoader(true);
    setGetInitialValues(null);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: employeeLabel.Name,
        accessorKey: employeeKey.Name,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.Email,
        accessorKey: employeeKey.Email,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.ContactNo,
        accessorKey: employeeKey.ContactNo,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.State,
        accessorKey: employeeKey.State,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.City,
        accessorKey: employeeKey.City,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.Role,
        accessorKey: employeeKey.Role,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.Action,
        cell: (cell: { row: { original: { id: number } } }) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`editMode-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-secondary edit-list"
              onClick={() => setGetInitialValues(cell?.row?.original)}
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
              onClick={() => {
                onClickDelete(cell?.row?.original?.id);
              }}
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
                toggleEmployeeModal(cell?.row?.original?.id);
              }}
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
      <Container fluid>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={deleteRecord}
          onCloseClick={() => setDeleteModal(false)}
          loader={deleteLoader}
        />

        <Modal
          isOpen={employeeDetailsModal}
          toggle={toggleEmployeeModal}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader
            toggle={toggleEmployeeModal}
            className="p-3 bg-light p-3"
          >
            {employeeLabel.EmployeeDetails}
          </ModalHeader>
          {modalLoader && <Loader />}
          <ModalBody>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{employeeLabel.Name}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.name}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{employeeLabel.Email}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.email}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{employeeLabel.ContactNo}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.contact_no}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{employeeLabel.Role}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.role}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{employeeLabel.Address}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.address}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{employeeLabel.State}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.state}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{employeeLabel.City}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.city}
              </Col>
            </Row>{" "}
            <Row className="mb-2">
              {viewEmployeeDetails?.role === roleEnums?.Employee ? (
                <>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {employeeLabel.Designation}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {viewEmployeeDetails?.designation}
                  </Col>
                </>
              ) : null}
            </Row>
          </ModalBody>
        </Modal>
        <BreadCrumb title={employeeLabel.Title} pageTitle={projectTitle} />
        <EmployeeForm
          getInitialValues={getInitialValues || null}
          updatedUser={updatedUser}
        ></EmployeeForm>
        <Row>
          <Col lg={12}>
            <Card id="customerList">
              <div className="card-body pt-0">
                {loader && <Loader />}
                <div>
                  {listUser.length ? (
                    <TableContainer
                      isHeaderTitle={`${employeeLabel.Title} List`}
                      columns={columns}
                      data={listUser || []}
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

export default Employee;
