import BreadCrumb from "Components/Base/BreadCrumb";
import { useMemo, useState, useEffect, useContext } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import TableContainer from "Components/Base/TableContainer";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  handleResponse,
  positiveNumberRegex,
  roleEnums,
} from "../../Components/constants/common";
import Flatpickr from "react-flatpickr";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { stockLabels } from "Components/constants/stock";
import { RequiredField } from "Components/constants/requireMsg";
import {
  InputPlaceHolder,
  SelectPlaceHolder,
  validationMessages,
} from "Components/constants/validation";
import { projectTitle } from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect } from "Components/Base/BaseSelect";
import BaseButton from "Components/Base/BaseButton";
import { addStock, editStockApi, listStockApi } from "../../api/stockApi";
import { ACCEPTED, CREATED, OK, SUCCESS, getItem } from "Components/emus/emus";
import { dynamicFind, errorHandle } from "helpers/service";
import { listOfStockType } from "api/stocktype";
import { listOfProject } from "api/projectApi";

type Payload = {
  project_id: any;
  projectName: any;
  stockId?: number;
  stock_type_id: string;
  stock_type: string;
  remarks: string;
  status: string;
  received_quantity?: number;
  accepted_quantity?: number;
  used_quantity?: number;
  date: any;
};

const Stock = () => {
  document.title = stockLabels.title;
  const [usageStockModal, setUsageStockModal] = useState(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [stock, setStock] = useState<any>();
  const [stockType, setStockType] = useState<any>();
  const [project, setProject] = useState<any>();
  const [usedStock, setUsedStock] = useState<any>();
  const [modalLoader, setModalLoader] = useState<boolean>(false);
  let role:any = getItem('role')

  const fetchStockData = () => {
    setLoader(true);
    const payload = {};
    listStockApi(payload)
      .then((resp) => {
        if (resp?.status === SUCCESS) {
          setStock(resp?.data?.reverse());
          setLoader(false);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => setLoader(false));
  };

  const fetchStockType = async () => {
    setLoader(true);
    const payload = {};

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
    await listOfProject(payload)
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          if (role === roleEnums?.Manager) {
            setProject(
              res?.data?.map((item: any) => ({
                value: item?.project?.id,
                label: item?.project?.project_name,
                id: item?.project?.id,
              }))
            );
          } else {
            setProject(
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
      .catch((err) => {
        return err;
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchStockData();
    fetchStockType();
  }, []);

  const validation: any = useFormik({
    initialValues: {
      projectId: "",
      projectName: "",
      stock_type_id: "",
      stock_type: "",
      quantity_received: undefined,
      accepted_quantity: undefined,
      date: null,
      remarks: "",
    },
    validationSchema: Yup.object({
      projectName: Yup.string().required(
        RequiredField(stockLabels.projectName)
      ),
      stock_type: Yup.string().required(RequiredField(stockLabels.stockHeader)),
      quantity_received: Yup.string()
        .required(RequiredField(stockLabels.quantityReceived))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(stockLabels?.quantityReceived)
        ),
      accepted_quantity: Yup.string()
        .required(RequiredField(stockLabels.acceptedQuantity))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(stockLabels?.acceptedQuantity)
        ),
      date: Yup.string().required(RequiredField(stockLabels.date)),
      remarks: Yup.string().required(RequiredField(stockLabels.remarks)),
    }),
    onSubmit: (values, { resetForm, setFieldValue }) => {
      setLoader(true);
      let payload: Payload;
      payload = {
        project_id: values.projectId,
        projectName: values.projectName,
        stock_type_id: values.stock_type_id,
        stock_type: values?.stock_type,
        remarks: values?.remarks,
        status: "In",
        received_quantity: values.quantity_received,
        accepted_quantity: values.accepted_quantity,
        date: moment(values.date).format("YYYY-MM-DD"),
      };

      addStock(payload)
        .then((res) => {
          if (
            res?.statusCode === CREATED ||
            res?.statusCode === OK ||
            (res?.statusCode === ACCEPTED && res?.status === SUCCESS)
          ) {
            toast.success(res?.message);
            fetchStockData();
            resetData();
            setFieldValue("stock_type_id", "");
            setFieldValue("stock_type", "");
            setFieldValue("projectName", "");
          } else {
            toast.error(res?.message);
          }
        })
        .catch((error) => {
          errorHandle(error);
        })
        .finally(() => {
          setLoader(false);
          validation.resetForm();
        });
    },
  });

  const resetData = () => {
    validation.initialValues.stock_type = null;
    validation.initialValues.stock_type_id = null;
  };

  const usageValidation: any = useFormik({
    initialValues: {
      projectId: "",
      projectName: "",
      stock_type_id: usedStock?.stock_type_id,
      stock_type: usedStock?.stock_type,
      used_quantity: "",
      date: null,
      remarks: "",
    },
    validationSchema: Yup.object({
      projectName: Yup.string().required(
        RequiredField(stockLabels.projectName)
      ),
      used_quantity: Yup.string()
        .required(RequiredField(stockLabels.usedQuantity))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(stockLabels?.usedQuantity)
        ),
      date: Yup.string().required(RequiredField(stockLabels.date)),
      remarks: Yup.string().required(RequiredField(stockLabels.remarks)),
    }),
    onSubmit: (values) => {
      setLoader(true);
      let payload: Payload;
      payload = {
        project_id: values.projectId,
        projectName: values.projectName,
        stockId: usedStock?.id,
        stock_type_id: usedStock?.stock_type_id,
        stock_type: usedStock?.stock_type,
        used_quantity: parseInt(values.used_quantity),
        date: moment(values.date).format("YYYY-MM-DD"),
        remarks: values.remarks,
        status: "Out",
      };
      addStock(payload)
        .then((res) => {
          if (
            res?.statusCode === CREATED ||
            res?.statusCode === OK ||
            (res?.statusCode === ACCEPTED && res?.status === SUCCESS)
          ) {
            toast.success(res?.message);
            fetchStockData();
            toggleUsageModal(null);
            resetData();
          } else {
            toast.error(res?.message);
          }
        })
        .catch((error) => {
          errorHandle(error);
        })
        .finally(() => {
          setLoader(false);
          usageValidation.resetForm();
        });
      usageValidation.resetForm();
    },
  });
  const toggleUsageModal = (data: any) => {
    setUsedStock(data);
    validation.resetForm();
    setUsageStockModal(!usageStockModal);
  };

  const columns = useMemo(
    () => [
      {
        header: stockLabels.stockHeader,
        accessorKey: stockLabels.stockHeaderAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockLabels.totalHeader,
        accessorKey: stockLabels.totalAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockLabels.usedHeader,
        accessorKey: stockLabels.usedAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockLabels.remainingHeader,
        accessorKey: stockLabels.remainingAccessor,
        enableColumnFilter: false,
      },
      {
        header: stockLabels.actionHeader,
        cell: (cell: { row: { original: { id: any } } }) => (
          <div className="hstack gap-2">
            <Link
              to={`/stock-detail/${cell?.row?.original?.id}`}
              id={`view-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-info view-list"
            >
              <i className="ri-eye-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="info"
                content="View"
                anchorId={`view-${cell?.row?.original?.id}`}
              />
            </Link>
            <BaseButton
              id={`usage-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-success usage-list"
              onClick={() => toggleUsageModal(cell?.row?.original)}
            >
              <i className="ri-survey-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="success"
                content="Used Stock"
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
        <Modal
          isOpen={usageStockModal}
          toggle={toggleUsageModal}
          modalClassName="zoomIn"
          centered
        >
          <Form onSubmit={usageValidation.handleSubmit}>
            <ModalHeader toggle={toggleUsageModal} className="p-3 bg-light p-3">
              {stockLabels.addUsedStock}
            </ModalHeader>
            {modalLoader && <Loader />}
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
                        value={dynamicFind(stockType, usedStock?.stock_type_id)}
                        touched={usageValidation.touched.stock_type}
                        error={usageValidation.errors.stock_type}
                        isDisabled={true}
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={6} className="mb-2">
                  <div>
                    <div>
                      <BaseSelect
                        label={stockLabels?.projectName}
                        name="projectName"
                        className="select-border"
                        options={project}
                        handleChange={(selectedOption: any) => {
                          usageValidation.setFieldValue(
                            "projectId",
                            selectedOption?.value || ""
                          );
                          usageValidation.setFieldValue(
                            "projectName",
                            selectedOption?.label || 0
                          );
                        }}
                        placeholder={SelectPlaceHolder(stockLabels.projectName)}
                        handleBlur={usageValidation.handleBlur}
                        value={dynamicFind(
                          project,
                          usageValidation?.values?.projectId
                        )}
                        touched={usageValidation.touched.projectName}
                        error={usageValidation.errors.projectName}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
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
                <Col lg={6} className="mb-2">
                  <div>
                    <Label className="form-label">{stockLabels.date}</Label>
                    <Flatpickr
                      className="form-control"
                      placeholder={SelectPlaceHolder(stockLabels.date)}
                      value={usageValidation.values.date}
                      onChange={(date) =>
                        usageValidation.setFieldValue("date", date[0])
                      }
                      options={{
                        dateFormat: "d M, Y",
                        disable: [
                          (date) => {
                            const currentDate = new Date();
                            return (
                              date.getMonth() !== currentDate.getMonth() ||
                              date.getFullYear() !== currentDate.getFullYear()
                            );
                          },
                        ],
                      }}
                    />
                    {usageValidation.touched.date &&
                    usageValidation.errors.date ? (
                      <div className="text-danger error-font">
                        {usageValidation.errors.date}
                      </div>
                    ) : null}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12} className="mb-2">
                  <div>
                    <Label className="form-label" htmlFor="product-title-input">
                      {stockLabels.remarks}
                    </Label>
                    <textarea
                      name="remarks"
                      className="form-control"
                      placeholder={InputPlaceHolder(stockLabels.remarks)}
                      onChange={usageValidation?.handleChange}
                      value={usageValidation.values.remarks}
                      rows={3}
                    ></textarea>
                    {usageValidation.errors.remarks &&
                    usageValidation.touched.remarks ? (
                      <div className="text-danger error-font">
                        {usageValidation.errors.remarks}
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
                onClick={toggleUsageModal}
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

        <BreadCrumb title={stockLabels.title} pageTitle={projectTitle} />
        <Row>
          <Col lg={12}>
            <Form onSubmit={validation.handleSubmit}>
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    {stockLabels.addStockDetail}
                  </h5>
                </CardHeader>
                {loader && <Loader />}
                <CardBody className="mb-0 pb-0">
                  <div className="mb-3">
                    <Row>
                      <Col lg={3} className="mb-2">
                        <BaseSelect
                          label={stockLabels?.projectName}
                          name="projectName"
                          className="select-border"
                          options={project}
                          placeholder={SelectPlaceHolder(
                            stockLabels.projectName
                          )}
                          handleChange={(selectedOption: any) => {
                            validation.setFieldValue(
                              "projectName",
                              selectedOption?.label
                            );
                            validation.setFieldValue(
                              "projectId",
                              selectedOption?.value
                            );
                          }}
                          handleBlur={validation.handleBlur}
                          value={
                            dynamicFind(
                              project,
                              validation.values.projectId || ""
                            ) || ""
                          }
                          touched={validation.touched.projectName}
                          error={validation.errors.projectName}
                        />
                      </Col>
                      <Col lg={3} className="mb-2">
                        <BaseSelect
                          label={stockLabels?.stockType}
                          name="stock_type"
                          className="select-border"
                          options={stockType}
                          placeholder={SelectPlaceHolder(stockLabels.stockType)}
                          handleChange={(selectedOption: any) => {
                            validation.setFieldValue(
                              "stock_type",
                              selectedOption?.label
                            );
                            validation.setFieldValue(
                              "stock_type_id",
                              selectedOption?.value
                            );
                          }}
                          handleBlur={validation.handleBlur}
                          value={
                            dynamicFind(
                              stockType,
                              validation.values.stock_type_id || ""
                            ) || ""
                          }
                          touched={validation.touched.stock_type}
                          error={validation.errors.stock_type}
                        />
                      </Col>
                      <Col lg={3} className="mb-2">
                        <BaseInput
                          label={stockLabels?.quantityReceived}
                          name="quantity_received"
                          type="number"
                          className="form-control"
                          placeholder={InputPlaceHolder(
                            stockLabels.receivedQuantity
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.quantity_received}
                          touched={validation.touched.quantity_received}
                          error={validation.errors.quantity_received}
                          passwordToggle={false}
                          min="0"
                        />
                      </Col>
                      <Col lg={3} className="mb-2">
                        <BaseInput
                          label={stockLabels?.acceptedQuantity}
                          name="accepted_quantity"
                          type="number"
                          className="form-control"
                          placeholder={InputPlaceHolder(
                            stockLabels.acceptedQuantity
                          )}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.accepted_quantity}
                          touched={validation.touched.accepted_quantity}
                          error={validation.errors.accepted_quantity}
                          passwordToggle={false}
                          min="0"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col lg={4} className="mb-2">
                        <Label>{stockLabels?.date}</Label>
                        <Flatpickr
                          className="form-control"
                          placeholder={SelectPlaceHolder(stockLabels.date)}
                          value={validation.values.date}
                          onChange={(date) =>
                            validation.setFieldValue("date", date[0])
                          }
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
                        {validation.touched.date && validation.errors.date ? (
                          <div className="text-danger error-font">
                            {validation.errors.date}
                          </div>
                        ) : null}
                      </Col>
                      <Col lg={4} className="mb-3">
                        <Label>{stockLabels?.remarks}</Label>
                        <textarea
                          name="remarks"
                          className="form-control"
                          value={validation.values.remarks}
                          placeholder={InputPlaceHolder(stockLabels.remarks)}
                          onChange={(e) =>
                            validation.setFieldValue("remarks", e.target.value)
                          }
                          rows={1}
                        ></textarea>
                        {validation.touched.remarks &&
                        validation.errors.remarks ? (
                          <div className="text-danger error-font">
                            {`${validation.errors.remarks}`}
                          </div>
                        ) : null}
                      </Col>
                      <Col
                        lg={4}
                        className="d-flex align-items-end justify-content-end"
                      >
                        <BaseButton
                          disabled={loader}
                          type="submit"
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
                    {stock?.length > 0 ? (
                      <TableContainer
                        isHeaderTitle="Stock List"
                        columns={columns}
                        data={stock ? stock : []}
                        isGlobalFilter={true}
                        customPageSize={5}
                        theadClass="table-light text-muted"
                        SearchPlaceholder="Search..."
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

export default Stock;
