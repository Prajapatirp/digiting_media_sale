import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  Container,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  handleResponse,
  searchPlaceHolder,
  validationMessages,
} from "../../Components/constants/common";
import BreadCrumb from "Components/Base/BreadCrumb";
import { servicesKey, servicesLabel } from "Components/constants/services";
import TableContainer from "Components/Base/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DeleteModal from "Components/Base/DeleteModal";
import BaseInput from "Components/Base/BaseInput";
import BaseButton from "Components/Base/BaseButton";
import {
  ButtonEnums,
  CREATED,
  OK,
  SUCCESS,
  ServiceEnums,
} from "Components/emus/emus";
import { documentTitle, errorHandle } from "helpers/service";
import {
  createService,
  deleteService,
  listOfService,
  updateService,
} from "api/serviceApi";
import { toast } from "react-toastify";
import Loader from "Components/Base/Loader";

type Service = {
  id: number;
  service_name: string | undefined;
};

const MasterServices = () => {
  document.title = documentTitle(servicesLabel.services);
  const [loader, setLoader] = useState<boolean>(false);
  const [serviceDeleteModel, setServicesDeleteModel] = useState<boolean>(false);
  const [serviceModal, setServiceModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isServiceData, setServiceData] = useState<Service>();
  const [deleteID, setDeleteID] = useState<number>();
  const [updatedService, setUpdateService] = useState<Service | undefined>();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);

  function listService() {
    setLoader(true);
    listOfService()
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          toast.success(res?.message);
          setServiceData(res.data);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => setLoader(false));
  }

  const handleEditMode = (cell: any) => {
    setIsEdit(true);
    setServiceModal(!serviceModal);
    setUpdateService(cell);
  };

  const columns = useMemo(
    () => [
      {
        header: servicesLabel.serialName,
        accessorKey: servicesLabel.serialName,
        enableColumnFilter: false,
        cell: (cell: { row: { index: number } }) => cell.row.index + 1,
      },
      {
        header: servicesLabel.servicesName,
        accessorKey: servicesKey.servicesName,
        enableColumnFilter: false,
      },
      {
        header: servicesLabel.action,
        cell: (cell: { row: { original: { id: number } } }) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`editMode-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-info edit-list"
              onClick={() => handleEditMode(cell?.row?.original)}
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
          </div>
        ),
      },
    ],
    []
  );

  const onClickDelete = (id: number) => {
    setServicesDeleteModel(true);
    setDeleteID(id);
  };

  function deleteRecord() {
    setDeleteLoader(true);
    deleteService(deleteID)
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setServicesDeleteModel(false);
          toast.success(res?.message);
          listService();
        } else {
          toast.success(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => setDeleteLoader(false));
  }

  useEffect(() => {
    listService();
  }, []);

  let validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      serviceName: updatedService?.service_name || "",
    },
    validationSchema: Yup.object({
      serviceName: Yup.string().required(
        validationMessages.required(servicesLabel.servicesName)
      ),
    }),
    onSubmit: (value) => {
      setLoader(true);
      if (!isEdit) {
        setLoader(true);
        createService(value)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              listService();
              toast.success(res?.message);
              setServiceModal(false);
              validation.resetForm();
            } else {
              toast.error(res?.message);
            }
          })
          .catch((error) => {
            errorHandle(error);
          })
          .finally(() => setLoader(false));
      } else {
        setLoader(true);
        updateService(value, updatedService!.id)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              listService();
              toast.success(res?.message);
              setServiceModal(false);
              validation.resetForm();
              handleEditMode(null);
            } else {
              toast.error(res?.message);
            }
          })
          .catch((error) => {
            errorHandle(error);
          })
          .finally(() => setLoader(false));
      }
    },
  });

  const toggle = useCallback(() => {
    validation.resetForm();
    if (serviceModal) {
      setServiceModal(false);
      setIsEdit(false);
      setUpdateService(undefined);
    } else {
      setServiceModal(true);
    }
  }, [serviceModal, validation]);

  return (
    <div className="page-content">
      <Container fluid>
        <div className="shepherd-button-right d-flex justify-content-between align-items-center">
          <BreadCrumb title="Master Items" pageTitle="Forms" />
          <Button
            color="primary"
            onClick={() => {
              setServiceModal(true);
            }}
          >
            {ButtonEnums.Create}
          </Button>
        </div>
        <Modal
          id="topmodal"
          toggle={toggle}
          isOpen={serviceModal}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader
            className="modal-title"
            id="myModalLabel"
            toggle={toggle}
          >
            {isEdit ? ServiceEnums.UpdateService : ServiceEnums.MasterService}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <div className="mb-3">
                <BaseInput
                  id="service-name"
                  label={servicesLabel.servicesName}
                  name="serviceName"
                  type="text"
                  placeholder={`Enter ${servicesLabel.servicesName}`}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.serviceName}
                  touched={validation.touched.serviceName}
                  error={validation.errors.serviceName}
                  passwordToggle={false}
                />
              </div>
              <div className="mt-4">
                <BaseButton
                  color="success"
                  disabled={loader}
                  className="btn btn-success w-100"
                  type="submit"
                  loader={loader}
                >
                  {!isEdit ? ButtonEnums.Submit : ButtonEnums.Edit}
                </BaseButton>
              </div>
            </Form>
          </ModalBody>
        </Modal>
        {loader ? (
          <Loader />
        ) : (
          <Card className="m-4">
            <CardBody>
              <div className="card-body pt-0">
                <div>
                  {isServiceData ? (
                    <TableContainer
                      columns={columns}
                      data={isServiceData || []}
                      isGlobalFilter={true}
                      customPageSize={5}
                      isCustomerFilter={false}
                      theadClass="table-light text-muted"
                      SearchPlaceholder={`${searchPlaceHolder}`}
                    />
                  ) : (
                    <div className="py-4 text-center">
                        <i className="ri-search-line d-block fs-1 text-success"></i>
                        {handleResponse?.dataNotFound}
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <DeleteModal
          show={serviceDeleteModel}
          onDeleteClick={deleteRecord}
          onCloseClick={() => setServicesDeleteModel(false)}
          loader={deleteLoader}
        />
      </Container>
    </div>
  );
};

export default MasterServices;
