import BreadCrumb from "Components/Base/BreadCrumb";
import { useEffect, useMemo, useState, createContext } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import TableContainer from "Components/Base/TableContainer";
import { Link, useParams } from "react-router-dom";
import {
  handleResponse,
  positiveNumberRegex,
} from "../../Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseButton from "Components/Base/BaseButton";
import Flatpickr from "react-flatpickr";
import {
  stockDetailLabels,
  stockDetailsList,
} from "Components/constants/stockDetails";
import { stockLabels } from "Components/constants/stock";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { projectTitle } from "Components/constants/common";
import { editStockApi, listStockApi, viewStockApi } from "api/stockApi";
import { ACCEPTED, CREATED, OK, SUCCESS } from "Components/emus/emus";
import { toast } from "react-toastify";
import { dynamicFind, errorHandle } from "helpers/service";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RequiredField } from "Components/constants/requireMsg";
import DeleteModal from "Components/Base/DeleteModal";
import { BaseSelect } from "Components/Base/BaseSelect";
import {
  InputPlaceHolder,
  SelectPlaceHolder,
  validationMessages,
} from "Components/constants/validation";
import BaseInput from "Components/Base/BaseInput";
import moment from "moment";
import { listOfStockType } from "api/stocktype";

export const StockContext = createContext([]);

const StockDetail = () => {
  document.title = stockDetailLabels.title;
  let { id } = useParams();
  const [loader, setLoader] = useState<boolean>(true);
  const [stockDetailsList, setStockDetailsList] = useState<any>();
  const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inEdit, setInEdit] = useState<any>();
  const [usageEdit, setUsageEdit] = useState<any>();
  const [stockType, setStockType] = useState<any>();
  const [editstockModal, setEditStockModal] = useState<boolean>(false);
  const [editUsageStockModal, setEditUsageStockModal] =
    useState<boolean>(false);
  const [editStock, setEditStock] = useState<any>();
  const fetchStockData = () => {
    const payload = {};
    setLoader(true);
    viewStockApi(id)
      .then((resp) => {
        if (resp?.status === SUCCESS) {
          setStockDetailsList(resp?.data?.reverse());
          setLoader(false);
        }
      })
      .catch((err) => {
        return err;
      })
      .catch(() => setLoader(false));
  };
  const fetchStockTypes = () => {
    const payload = {};
    setLoader(true);
    listOfStockType(payload)
      .then((resp) => {
        setStockType(
          resp?.data?.map((item: any) => ({
            value: item?.id,
            label: item?.stock_type_name,
            id: item?.id,
          }))
        );
      })
      .catch((err) => {
        return err;
      })
      .finally(() => setLoader(false));
  };

  const toggleEditUsageModal = () => {
    setEditUsageStockModal(!editUsageStockModal);
  };
  const toggleEditModal = () => {
    setEditStockModal(!editstockModal);
  };

  useEffect(() => {
    fetchStockData();
    fetchStockTypes();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      stock_type_id: inEdit?.stock?.stock_type_id || 0,
      stockId: inEdit?.stock?.id || 0,
      stock_type: inEdit?.stock?.stock_type || "",
      remarks: inEdit?.remarks || "",
      status: inEdit?.status || "In",
      received_quantity: inEdit?.received_quantity || 0,
      accepted_quantity: inEdit?.accepted_quantity || 0,
      date: inEdit?.date,
    },
    validationSchema: Yup.object({
      received_quantity: Yup.string()
        .required(RequiredField(stockLabels?.receivedQuantity))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(stockLabels?.receivedQuantity)
        ),
      accepted_quantity: Yup.string()
        .required(RequiredField(stockLabels?.acceptedQuantity))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(stockLabels?.acceptedQuantity)
        ),
    }),
    onSubmit: (values) => {
      setLoader(true);
      const payload = {
        ...values,
      };
      editStockApi(inEdit?.stock?.stock_type_id, payload)
        .then((res) => {
          if (
            res?.statusCode === CREATED ||
            res?.statusCode === OK ||
            (res?.statusCode === ACCEPTED && res?.status === SUCCESS)
          ) {
            toast.success(res?.message);
            toggleEditModal();
            fetchStockData();
          } else {
            toast.error(res?.message);
          }
        })
        .catch((error) => {
          errorHandle(error);
        })
        .finally(() => {
          setLoader(false);
          toggleEditModal();
        });
    },
  });

  const usageValidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      stock_type_id: usageEdit?.stock?.id || 0,
      stockId: usageEdit?.stock?.id || 0,
      stock_type: usageEdit?.stock?.stock_type || "",
      remarks: usageEdit?.remarks || "",
      status: "Out",
      used_quantity: parseInt(usageEdit?.used_quantity),
      date: usageEdit?.date,
    },
    validationSchema: Yup.object({
      used_quantity: Yup.string()
        .required(RequiredField(stockLabels?.usedQuantity))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(stockLabels?.usedQuantity)
        ),
    }),
    onSubmit: (values) => {
      setLoader(true);
      const payload = {
        ...values,
        used_quantity: parseInt(usageEdit?.used_quantity),
      };
      editStockApi(usageEdit?.stock?.stock_type_id, payload)
        .then((res) => {
          if (
            res?.statusCode === CREATED ||
            res?.statusCode === OK ||
            (res?.statusCode === ACCEPTED && res?.status === SUCCESS)
          ) {
            toast.success(res?.message);
            toggleEditUsageModal();
            fetchStockData();
          } else {
            toast.error(res?.message);
            setEditStock(null);
          }
        })
        .catch((error) => {
          errorHandle(error);
          setEditStock(null);
          handleEditStock(0, null);
        })
        .finally(() => {
          toggleEditUsageModal();
          setLoader(false);
          setEditStock(null);
        });
    },
  });

  const handleEditStock = (id: number, data: any) => {
    if (data?.status === "In") {
      toggleEditModal();
      setInEdit(data);
      setIsEdit(!isEdit);
    } else {
      toggleEditUsageModal();
      setUsageEdit(data);
      setIsEdit(!isEdit);
    }
  };

  const handleDelete = () => {
    setDeleteLoader(true);
    setTimeout(() => {
      setDeleteModal(false);
      setDeleteLoader(false);
    }, 1000);
  };

  const columns = useMemo(
    () => [
      {
        header: stockDetailLabels.dateHeader,
        accessorKey: stockDetailLabels.dateAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockDetailLabels.stockTypeHeader,
        accessorKey: stockDetailLabels.stockTypeAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockDetailLabels.inOutHeader,
        accessorKey: stockDetailLabels.inoutAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockDetailLabels.balanceAccessor,
        accessorKey: stockDetailLabels.balanceAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockDetailLabels.remarks,
        accessorKey: stockDetailLabels.remarksAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockLabels.actionHeader,
        cell: (cell: { row: { original: { id: number } } }) => (
          <div className="hstack gap-2">
            <BaseButton
              type="button"
              id={`editMode-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-secondary edit-list"
              onClick={() =>
                handleEditStock(cell?.row?.original?.id, cell?.row?.original)
              }
            >
              <i className="ri-pencil-line align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="info"
                content="Done"
                anchorId={`done-${cell?.row?.original?.id}`}
              />
            </BaseButton>
          </div>
        ),
      },
    ],
    [isEdit]
  );

  return (
    <StockContext.Provider value={editStock}>
      <div className="page-content">
        <Modal
          isOpen={editUsageStockModal}
          toggle={toggleEditUsageModal}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader
            toggle={toggleEditUsageModal}
            className="p-3 bg-light p-3"
          >
            {stockLabels.editUsedStock}
          </ModalHeader>
          <Form onSubmit={usageValidation.handleSubmit}>
            {/* {modalLoader && <Loader />} */}
            <ModalBody>
              <Row className="mb-2">
                <Col lg={6} className="mb-2">
                  <div>
                    <div>
                      <BaseSelect
                        label={stockLabels.stockType}
                        name="stock_type"
                        className="select-border"
                        options={stockType}
                        placeholder={SelectPlaceHolder(stockLabels.stockType)}
                        handleChange={(selectedOption: any) => {
                          usageValidation.setFieldValue(
                            "stock_type",
                            selectedOption?.label || ""
                          );
                          usageValidation.setFieldValue(
                            "stock_type_id",
                            selectedOption?.value || 0
                          );
                        }}
                        handleBlur={usageValidation.handleBlur}
                        value={dynamicFind(
                          stockType,
                          usageEdit?.stock?.stock_type_id
                        )}
                        touched={usageValidation.touched.stock_type}
                        error={usageValidation.errors.stock_type}
                        isDisabled={true}
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={6} className="mb-2">
                  <div>
                    <BaseInput
                      label={stockLabels.usedQuantity}
                      name="used_quantity"
                      type="number"
                      placeholder={InputPlaceHolder(
                        stockLabels.receivedQuantity
                      )}
                      handleChange={(e: any) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          usageValidation.handleChange(e);
                        }
                      }}
                      handleBlur={usageValidation.handleBlur}
                      value={usageValidation.values.used_quantity}
                      touched={usageValidation.touched.used_quantity}
                      error={usageValidation.errors.used_quantity}
                      passwordToggle={false}
                      min="0"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={6} className="mb-2">
                  <div>
                    <Label className="form-label">{stockLabels.date}</Label>
                    <Flatpickr
                      className="form-control"
                      placeholder={SelectPlaceHolder(stockLabels.date)}
                      value={moment(usageEdit?.date).toDate()}
                      onChange={(date) =>
                        usageValidation.setFieldValue("date", date[0])
                      }
                      disabled={true}
                      options={{
                        dateFormat: "d M, Y",
                        disable: [
                          (date) => {
                            const currentDate = new Date();
                            return (
                              date.getFullYear() !== currentDate.getFullYear()
                            );
                          },
                        ],
                      }}
                    />
                  </div>
                </Col>
                <Col lg={6} className="mb-2">
                  <div>
                    <Label className="form-label" htmlFor="product-title-input">
                      {stockLabels.remarks}
                    </Label>
                    <textarea
                      name="remarks"
                      className="form-control"
                      placeholder={InputPlaceHolder(stockLabels.remarks)}
                      rows={1}
                      value={usageEdit?.remarks}
                      disabled={true}
                    ></textarea>
                    {validation.errors.remarks && validation.touched.remarks ? (
                      <div className="text-danger error-font">
                        {`${validation.errors.remarks}`}
                      </div>
                    ) : null}
                  </div>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <BaseButton
                color="none"
                className="btn btn-ghost-success"
                type="button"
                onClick={toggleEditUsageModal}
              >
                {stockLabels.cancel}
              </BaseButton>
              <BaseButton
                color="primary"
                disabled={loader}
                type="submit"
                loader={loader}
              >
                {stockLabels.submit}
              </BaseButton>
            </ModalFooter>
          </Form>
        </Modal>

        <Modal
          isOpen={editstockModal}
          toggle={toggleEditModal}
          modalClassName="zoomIn"
          centered
        >
          <ModalHeader toggle={toggleEditModal} className="p-3 bg-light p-3">
            {stockLabels.editStockDetail}
          </ModalHeader>
          <Form onSubmit={validation.handleSubmit}>
            <Card>
              {loader && <Loader />}
              <CardBody className="mb-0 pb-0">
                <div className="mb-3">
                  <Row>
                    <Col lg={6} className="mb-2">
                      <BaseSelect
                        label={stockDetailLabels?.stockTypeHeader}
                        name="stock_type"
                        className="select-border"
                        options={stockType}
                        placeholder={SelectPlaceHolder(stockLabels.stockType)}
                        handleChange={(selectedOption: any) => {
                          validation.setFieldValue(
                            "stock_type",
                            selectedOption?.label || ""
                          );
                          validation.setFieldValue(
                            "stock_type_id",
                            selectedOption?.value || 0
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={dynamicFind(
                          stockType,
                          inEdit?.stock?.stock_type_id
                        )}
                        touched={validation.touched.stock_type}
                        error={validation.errors.stock_type}
                        isDisabled={true}
                      />
                    </Col>
                    <Col lg={6} className="mb-2">
                      <BaseInput
                        label={stockLabels?.receivedQuantity}
                        name="received_quantity"
                        type="number"
                        placeholder={InputPlaceHolder(
                          stockLabels.receivedQuantity
                        )}
                        handleChange={(e: any) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            validation.handleChange(e);
                          }
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.received_quantity}
                        touched={validation.touched.received_quantity}
                        error={validation.errors.received_quantity}
                        passwordToggle={false}
                        min="0"
                      />
                      {validation.touched.received_quantity &&
                      validation.errors.received_quantity ? (
                        <div className="text-danger error-font">
                          {`${validation.errors.received_quantity}`}
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} className="mb-2">
                      <BaseInput
                        label={stockLabels?.acceptedQuantity}
                        name="accepted_quantity"
                        type="number"
                        placeholder={InputPlaceHolder(
                          stockLabels.acceptedQuantity
                        )}
                        handleChange={(e: any) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            validation.handleChange(e);
                          }
                        }}
                        handleBlur={validation.handleBlur}
                        value={validation.values.accepted_quantity}
                        touched={validation.touched.accepted_quantity}
                        error={validation.errors.accepted_quantity}
                        passwordToggle={false}
                        min="0"
                      />
                      {validation.touched.accepted_quantity &&
                      validation.errors.accepted_quantity ? (
                        <div className="text-danger error-font">
                          {`${validation.errors.accepted_quantity}`}
                        </div>
                      ) : null}
                    </Col>
                    <Col lg={6} className="mb-2">
                      <Label>{stockLabels?.date}</Label>
                      <Flatpickr
                        className="form-control"
                        placeholder={SelectPlaceHolder(stockLabels.date)}
                        value={moment(inEdit?.date).toDate()}
                        onChange={(date) =>
                          validation.setFieldValue("date", date[0])
                        }
                        disabled={true}
                        options={{
                          dateFormat: "d M, Y",
                          disable: [
                            (date) => {
                              const currentDate = new Date();
                              return (
                                date.getFullYear() !== currentDate.getFullYear()
                              );
                            },
                          ],
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} className="mb-3">
                      <Label>{stockLabels?.remarks}</Label>
                      <textarea
                        name="remarks"
                        className="form-control"
                        value={validation.values.remarks}
                        placeholder={InputPlaceHolder(stockLabels.remarks)}
                        onChange={(e) =>
                          validation.setFieldValue("remarks", e.target.value)
                        }
                        rows={3}
                        disabled={true}
                      ></textarea>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      className="d-flex align-items-end justify-content-end"
                    >
                      <BaseButton
                        disabled={loader}
                        type="submit"
                        loader={loader}
                        className="btn btn-success w-sm"
                      >
                        {stockLabels.submit}
                      </BaseButton>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Form>
        </Modal>

        <DeleteModal
          show={deleteModal}
          onDeleteClick={() => handleDelete()}
          onCloseClick={() => setDeleteModal(false)}
          loader={deleteLoader}
        />
        <Container fluid>
          <BreadCrumb
            title={stockDetailLabels.title}
            pageTitle={projectTitle}
          />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">
                          {stockDetailLabels.title}
                        </h5>
                        <Link to="/stock" className="btn btn-success w-sm">
                          {stockDetailLabels.back}
                        </Link>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                {loader ? (
                  <Loader />
                ) : (
                  <div className="card-body pt-0">
                    <div>
                      {stockDetailsList?.length >= 0 ? (
                        <TableContainer
                          columns={columns}
                          data={stockDetailsList || []}
                          isGlobalFilter={true}
                          customPageSize={5}
                          isCustomerFilter={false}
                          theadClass="table-light text-muted"
                          SearchPlaceholder="Search something..."
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
    </StockContext.Provider>
  );
};

export default StockDetail;
