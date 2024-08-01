import { BaseSelect } from "Components/Base/BaseSelect";
import { Alert, Card, Container, Label, Table } from "reactstrap";
import { CREATED, OK, SUCCESS, getItem } from "Components/emus/emus";
import { listOfProject } from "api/projectApi";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import { useFormik } from "formik";
import { handleResponse, roleEnums } from "Components/constants/common";
import { taskLabels } from "Components/constants/taskAllocation";
import { stockLabels } from "Components/constants/stock";
import { dynamicFind } from "helpers/service";
import moment from "moment";
import { SelectPlaceHolder } from "Components/constants/validation";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { stockReportApi } from "api/reportApi";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import logoImage from "../../assets/image/shivLogo.png";
import { Link } from "react-router-dom";
import Loader from "Components/Base/Loader";
import { listOfStockType } from "api/stocktype";
import { contactUsTabel } from "Components/constants/inquiry";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    padding: "2%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ddd",
    borderRadius: 4,
  },
  headerRow: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    padding: 8,
    backgroundColor: "white",
    border: "1px solid #ddd",
  },
  cell1: {
    padding: 8,
    fontSize: "15px",
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 50,
    color: "rgba(0, 0, 0, 0.1)",
  },
});

const StockReport = () => {
  document.title = contactUsTabel.title5;
  const [loader, setLoader] = useState<boolean>(false);
  const [project, setProject] = useState(null);
  const [pdfData, setPdfData] = useState<any>([]);
  const [alertShow, setAlertShow] = useState<boolean>(false);
  const [stockType, setStockType] = useState<any>();
  let role: any = getItem("role");

  function fetchData() {
    setLoader(true);
    listOfProject()
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          if (role === roleEnums?.Manager) {
            setProject(
              res?.data?.map((item: any) => ({
                value: item?.project_id,
                label: item?.project?.project_name,
                id: item?.project_id,
              }))
            );
          } else {
            setProject(
              res?.data?.map((item: any) => ({
                value: item?.project_name,
                label: item?.project_name,
                id: item?.id,
              }))
            );
          }
          setLoader(false);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => setLoader(false));
  }

  const fetchStockTypes = () => {
    const payload = {};
    setLoader(true);
    listOfStockType(payload)
      .then((resp) => {
        setStockType(
          resp?.data?.map((item: any) => ({
            value: item?.stock_type_name,
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
  useEffect(() => {
    fetchData();
    fetchStockTypes();
  }, []);
  const validation = useFormik({
    initialValues: {
      project_name: "",
      stock_type: "",
      startDate: "",
      endDate: "",
    },
    onSubmit: (values, { resetForm }) => {
      setLoader(true);
      const payload = {
        project_name: values.project_name,
        stock_type: values.stock_type,
        startDate: values.startDate
          ? moment(values.startDate).format("YYYY-MM-DD")
          : "",
        endDate: values.endDate
          ? moment(values.endDate).format("YYYY-MM-DD")
          : "",
      };

      stockReportApi(payload)
        .then((resp) => {
          if (resp?.statusCode === CREATED || resp?.status === SUCCESS) {
            setPdfData(resp?.data);
            if (resp?.data?.length !== 0) {
              setAlertShow(false);
            } else {
              setAlertShow(true);
            }
          } else {
            setAlertShow(true);
          }
        })
        .catch(() => setAlertShow(true))
        .finally(() => {
          setLoader(false);
          resetForm();
        });
      resetForm();
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
      {loader && <Loader />}
      <div
        className={
          pdfData?.length !== 0 ? "d-flex justify-content-end m-2" : "d-none"
        }
      >
        <Link
          to="/stockReport"
          className="px-4 py-2 bg-dark text-white rounded"
          onClick={() => setPdfData([])}
        >
          {stockLabels.back}
        </Link>
      </div>
      <div>
        <h5 className="card-title mb-2 px-1">{stockLabels.stockTypeReports}</h5>
      </div>
      <Card className="p-3">
        <Col xl={12} className={pdfData?.length !== 0 ? "d-none" : ""}>
          <Row className="g-3 d-flex justify-content-center">
            <Col lg={3}>
              <div className="">
                <Label>{contactUsTabel.selcetDate}</Label>
                <Flatpickr
                  name="startDate"
                  className="form-control"
                  id="datepicker-start-input"
                  placeholder="Select a start date"
                  value={validation.values.startDate}
                  onChange={(date) =>
                    validation.setFieldValue("startDate", date[0])
                  }
                  options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    mode: "single",
                    dateFormat: "d.m.y",
                  }}
                />
              </div>
            </Col>

            <Col lg={3}>
              <div className="">
                <Label>{contactUsTabel.selcetEndDate}</Label>
                <Flatpickr
                  name="endDate"
                  className="form-control"
                  id="datepicker-end-input"
                  placeholder="Select an end date"
                  value={validation.values.endDate}
                  onChange={(date) =>
                    validation.setFieldValue("endDate", date[0])
                  }
                  options={{
                    altInput: true,
                    altFormat: "F j, Y",
                    mode: "single",
                    dateFormat: "d.m.y",
                  }}
                />
              </div>
            </Col>
            <Col lg={3}>
              <div>
                <BaseSelect
                  label={stockLabels.projectName}
                  name="project_name"
                  className="select-border"
                  options={project}
                  placeholder={SelectPlaceHolder(taskLabels?.projectName)}
                  handleChange={(selectedOption: any) => {
                    validation.setFieldValue(
                      "project_name",
                      selectedOption?.label
                    );
                  }}
                  handleBlur={validation.handleBlur}
                  value={
                    dynamicFind(project, validation?.values?.project_name) || ""
                  }
                />
              </div>
            </Col>
            <Col lg={3}>
              <div>
                <BaseSelect
                  label={stockLabels.stockType}
                  name="stock_type"
                  className="select-border"
                  options={stockType}
                  placeholder={SelectPlaceHolder(stockLabels.title)}
                  handleChange={(selectedOption: any) => {
                    validation.setFieldValue(
                      "stock_type",
                      selectedOption?.value
                    );
                  }}
                  handleBlur={validation.handleBlur}
                  value={
                    dynamicFind(stockType, validation?.values?.stock_type) || ""
                  }
                />
              </div>
            </Col>
            <Col>
              <div className="mt-4 d-flex justify-content-end">
                <Row>
                  <Col sm={12}>
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={() => validation.handleSubmit()}
                    >
                      <i className="ri-printer-line me-2 align-bottom"></i>
                      {stockLabels.viewPdf}
                    </button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
        {pdfData?.length !== 0 ? (
          <PDFViewer style={{ width: "100%", height: "100vh" }} className="pdf">
            <Document>
              <Page size="A4" style={styles.page} orientation="landscape">
                <View style={styles.header} wrap={false}>
                  <Image src={logoImage} style={styles.logo} />
                  <Text style={styles.cell}>Aranath Enterprise</Text>
                  <Text style={styles.cell}>Daily Report</Text>
                  <View style={styles.headerRow}>
                    <Text style={styles.cell}>Project Name</Text>
                  </View>
                  <View style={styles.headerRow}>
                    <Text style={styles.cell}>
                      {pdfData[0]?.project?.project_name || "---"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cell1}>Stock Details</Text>
                <View style={[styles.row, styles.headerRow]}>
                  <Text style={styles.cell}>ID</Text>
                  <Text style={styles.cell}>Project Name</Text>
                  <Text style={styles.cell}>Material Procurement</Text>
                  <Text style={styles.cell}>Total Quantity</Text>
                  <Text style={styles.cell}>Total Use Quantity</Text>
                </View>
                {/* Table body */}

                {pdfData?.map((item: any, index: any) => (
                  <View key={index} style={styles.row}>
                    <Text style={styles.cell}>{index + 1}</Text>
                    <Text style={styles.cell}>{item.project.project_name}</Text>
                    <Text style={styles.cell}>{item.stock_type}</Text>
                    <Text style={styles.cell}>{item.total_quantity}</Text>
                    <Text style={styles.cell}>{item.used_quantity}</Text>
                  </View>
                ))}
              </Page>
            </Document>
          </PDFViewer>
        ) : null}
      </Card>
      {alertShow ? (
        <Row className="d-flex justify-content-center mt-3">
          <Col sm="5">
            <Alert color="danger" className="text-center">
              {handleResponse?.dataNotFound}
            </Alert>
          </Col>
        </Row>
      ) : null}
      </Container>
    </div>
  );
};

export default StockReport;
