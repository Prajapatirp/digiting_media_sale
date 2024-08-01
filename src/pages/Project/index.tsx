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
import {
  handleResponse,
  searchPlaceHolder,
} from "../../Components/constants/common";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DeleteModal from "Components/Base/DeleteModal";
import { projectTitle } from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseButton from "Components/Base/BaseButton";
import { projectKey, projectLabel } from "../../Components/constants/project";
import ProjectForm from "./ProjectForm";
import { documentTitle, errorHandle } from "helpers/service";
import { deleteProject, listOfProject } from "api/projectApi";
import { OK, SUCCESS } from "Components/emus/emus";

const Project = () => {
  document.title = documentTitle(projectLabel.Title);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [projectTable, setProjectTable] = useState<any>("");
  const [selectedId, setSelectedId] = useState<number>();
  const [modalLoader, setModalLoader] = useState<boolean>(false);
  const [projectDetailsModal, setProjectDetailsModal] = useState(false);
  const [viewEmployeeDetails, setViewEmployeeDetails] = useState<any>();
  const [selectedProject, setSelectedProject] = useState<any>();

  function deleteRecord() {
    setDeleteLoader(true);
    deleteProject(selectedId)
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          toast.success(res?.message);
          setDeleteModal(false);
          listProject();
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setDeleteModal(false);
        setDeleteLoader(false);
      });
  }

  const toggleDeleteModal = (id: number) => {
    setSelectedId(id);
    setDeleteModal(true);
  };

  const toggleProjectModal = (cell: any) => {
    setModalLoader(true);
    setProjectDetailsModal(!projectDetailsModal);
    listProject(cell.id);
  };

  function listProject(id?: number) {
    let condition: any = {};
    if (id) {
      setModalLoader(true);
      condition.id = id;
    }
    listOfProject()
      .then((res) => {
        setLoader(false);
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          if (id) {
            setLoader(true);
            const selectedData = res?.data.find((item: any) => item.id === id);
            setViewEmployeeDetails(selectedData);
            setLoader(false);
          } else {
            setProjectTable(res?.data);
          }
          setLoader(false);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
        setModalLoader(false);
      });
  }

  useEffect(() => {
    listProject();
  }, []);

  const handleEditClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const columns = useMemo(
    () => [
      {
        header: projectLabel.projectName,
        accessorKey: projectKey.ProjectName,
        enableColumnFilter: false,
      },
      {
        header: projectLabel.State,
        accessorKey: projectKey.State,
        enableColumnFilter: false,
      },
      {
        header: projectLabel.City,
        accessorKey: projectKey.City,
        enableColumnFilter: false,
      },
      {
        header: projectLabel.ZipCode,
        accessorKey: projectKey.ZipCode,
        enableColumnFilter: false,
      },
      {
        header: projectLabel.Action,
        cell: (cell: { row: { original: { id: number } } }) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`editMode-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-secondary edit-list"
              onClick={() => {
                setSelectedProject(cell?.row?.original);
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
                toggleProjectModal(cell?.row?.original);
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
  const updateProjectList = () => {
    setLoader(true);
    listProject();
  };

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
          isOpen={projectDetailsModal}
          toggle={toggleProjectModal}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader toggle={toggleProjectModal} className="p-3 bg-light p-3">
            {projectLabel.Project_details}
          </ModalHeader>
          {modalLoader && <Loader />}
          <ModalBody>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{projectLabel.projectName}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.project_name}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{projectLabel.Address}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.address}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{projectLabel.State}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.state}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{projectLabel.City}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.city}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4} md={4} sm={4}>
                <Label className="label-Font">{projectLabel.ZipCode}</Label>
              </Col>
              <Col lg={8} md={8} sm={8}>
                {viewEmployeeDetails?.zip_code}
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        <BreadCrumb title={projectLabel.Title} pageTitle={projectTitle} />
        <ProjectForm
          initialValues={selectedProject}
          sendDataToParent={updateProjectList}
        ></ProjectForm>
        <Row>
          <Col lg={12}>
            <Card id="customerList">
              <div className="card-body pt-0">
                {loader && <Loader />}
                <div>
                  {projectTable.length ? (
                    <TableContainer
                      isHeaderTitle={`${projectLabel.Title} List`}
                      columns={columns}
                      data={projectTable || []}
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
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Project;
