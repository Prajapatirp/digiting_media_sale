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
import { servicesLabel } from "Components/constants/services";
import TableContainer from "Components/Base/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import DeleteModal from "Components/Base/DeleteModal";
import BaseInput from "Components/Base/BaseInput";
import BaseButton from "Components/Base/BaseButton";
import {
  ACCEPTED,
  ButtonEnums,
  CREATED,
  OK,
  SUCCESS,
  StockTypeEnums,
} from "Components/emus/emus";
import { documentTitle, errorHandle } from "helpers/service";
import {
  createStockType,
  deleteStockType,
  listOfStockType,
  updateStockType,
} from "api/stocktype";
import { toast } from "react-toastify";
import Loader from "Components/Base/Loader";
import { stockTypeKeys, stockTypeLabels } from "Components/constants/stock";

type Service = {
  id: number;
  stock_type_name: string | undefined;
};

const StockType = () => {
  document.title = documentTitle(stockTypeLabels.stockName);
  const [loader, setLoader] = useState<boolean>(false);
  const [stockTypeDeleteModel, setStockTypeDeleteModel] =
    useState<boolean>(false);
  const [stockTypeModal, setStockTypeModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isStockTypeData, setStockTypeData] = useState<Service>();
  const [deleteID, setDeleteID] = useState<number>();
  const [updatedStockType, setUpdateStockType] = useState<
    Service | undefined
  >();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);

  function listStockType() {
    setLoader(true);
    listOfStockType()
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          toast.success(res?.message);
          setStockTypeData(res.data?.reverse());
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
    setStockTypeModal(!stockTypeModal);
    setUpdateStockType(cell);
  };

  const columns = useMemo(
    () => [
      {
        header: stockTypeLabels.serialName,
        accessorKey: stockTypeKeys.id,
        enableColumnFilter: false,
        cell: (cell: { row: { index: number } }) => cell.row.index + 1,
      },
      {
        header: stockTypeLabels.stockTypeName,
        accessorKey: stockTypeKeys.StockTypeName,
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
    setStockTypeDeleteModel(true);
    setDeleteID(id);
  };

  function deleteRecord() {
    setDeleteLoader(true);
    deleteStockType(deleteID)
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setStockTypeDeleteModel(false);
          toast.success(res?.message);
          listStockType();
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
    listStockType();
  }, []);

  let validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      stockTypeName: updatedStockType?.stock_type_name || "",
    },
    validationSchema: Yup.object({
      stockTypeName: Yup.string().required(
        validationMessages.required(stockTypeLabels.stockTypeName)
      ),
    }),
    onSubmit: (value) => {
      setLoader(true);
      if (!isEdit) {
        setLoader(true);
        createStockType(value)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              listStockType();
              toast.success(res?.message);
              setStockTypeModal(false);
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
        updateStockType(value, updatedStockType!.id)
          .then((res) => {
            if (res?.statusCode === ACCEPTED && res?.status === SUCCESS) {
              listStockType();
              toast.success(res?.message);
              setStockTypeModal(false);
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
    if (stockTypeModal) {
      setStockTypeModal(false);
      setIsEdit(false);
      setUpdateStockType(undefined);
    } else {
      setStockTypeModal(true);
    }
  }, [stockTypeModal, validation]);

  return (
    <div className="page-content">
      <Container fluid>
        <div className="shepherd-button-right d-flex justify-content-between align-items-center">
          <BreadCrumb title="Material Procurement" pageTitle="Forms" />
          <Button
            color="primary"
            onClick={() => {
              setStockTypeModal(true);
            }}
          >
            {ButtonEnums.CreateType}
          </Button>
        </div>
        <Modal
          id="topmodal"
          toggle={toggle}
          isOpen={stockTypeModal}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader
            className="modal-title"
            id="myModalLabel"
            toggle={toggle}
          >
            {isEdit ? StockTypeEnums.UpdateStock : StockTypeEnums.StockType}
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
                  label={stockTypeLabels.stockTypeName}
                  name="stockTypeName"
                  type="text"
                  placeholder={`Enter ${stockTypeLabels.stockTypeName}`}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.stockTypeName}
                  touched={validation.touched.stockTypeName}
                  error={validation.errors.stockTypeName}
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
                  {isStockTypeData ? (
                    <TableContainer
                      columns={columns}
                      data={isStockTypeData || []}
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
          show={stockTypeDeleteModel}
          onDeleteClick={deleteRecord}
          onCloseClick={() => setStockTypeDeleteModel(false)}
          loader={deleteLoader}
        />
      </Container>
    </div>
  );
};

export default StockType;
