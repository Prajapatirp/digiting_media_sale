import { BaseSelect } from "Components/Base/BaseSelect";
import {
  Alert,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { CREATED, OK, SUCCESS, getItem } from "Components/emus/emus";
import { listOfProject } from "api/projectApi";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  emailRegex,
  handleResponse,
  roleEnums,
  validationMessages,
} from "Components/constants/common";
import { taskLabels } from "Components/constants/taskAllocation";
import { stockLabels } from "Components/constants/stock";
import { dynamicFind } from "helpers/service";
import moment from "moment";
import { SelectPlaceHolder } from "Components/constants/validation";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { reportApi, sendReportApi } from "api/reportApi";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import {
  ItemsTable,
  ItemsTable2,
  ItemsTable3,
  ItemsTable4,
  ItemsTable5,
} from "./ItemsTable";
import logoImage from "../../assets/image/shivLogo.png";
import { Link } from "react-router-dom";
import Loader from "Components/Base/Loader";
import { contactUsTabel } from "Components/constants/inquiry";
import BaseButton from "Components/Base/BaseButton";
import BaseInput from "Components/Base/BaseInput";
import { jsPDF } from "jspdf";
import Pdf from "./Pdf";
import PdfDocument from "./PdfViewer";

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
    flex: 1,
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

const Report = () => {
  document.title = contactUsTabel.title6;
  const [loader, setLoader] = useState<boolean>(false);
  const [mailModal, setMailModal] = useState(false);
  const [project, setProject] = useState(null);
  const [pdfData, setPdfData] = useState<any>([]);
  const [alertShow, setAlertShow] = useState<boolean>(false);
  const [mailDisable, setMailDisable] = useState<boolean>(true);
  const [date, setDate] = useState<any>();
  let role: any = getItem("role");

  const toggleMail = () => {
    setMailModal(!mailModal);
  };

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
                value: item?.id,
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

  useEffect(() => {
    fetchData();
  }, []);
  const validation = useFormik({
    initialValues: {
      project_name: "",
      date: "",
    },
    validationSchema: Yup.object({
      project_name: Yup.string().required(
        validationMessages.required(taskLabels?.projectName)
      ),
      date: Yup.string().required(
        validationMessages.required(stockLabels?.date)
      ),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = {
        project_id: values.project_name,
        searchDate: moment(values.date).format("YYYY-MM-DD"),
      };
      reportApi(payload)
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
        .finally(resetForm);
    },
  });

  const mailForm = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setLoader(true);
      try {
        // Call reportApi to fetch the report data
        const reportPayload = {
          project_id: validation.values.project_name,
          searchDate: moment(validation.values.date).format("YYYY-MM-DD"),
        };
        const reportResponse = await reportApi(reportPayload);

        if (
          reportResponse.statusCode === CREATED ||
          reportResponse.status === SUCCESS
        ) {
          const pdfData = reportResponse?.data;

          // Generate PDF using pdfData
          const blob = await generatePDF(pdfData);

          // Prepare FormData
          const formData = new FormData();
          formData.append("file", blob, "report.pdf");
          formData.append("email", values.email);

          // Call sendReportApi to send email with PDF attachment
          const sendEmailResponse = await sendReportApi(formData);
          if (sendEmailResponse.status === SUCCESS) {
            toast.success(sendEmailResponse.message);
            setMailModal(false);
            resetForm();
            validation.resetForm();
          } else {
            toast.error(sendEmailResponse.message);
          }
        } else {
          toast.error(reportResponse.message);
        }
      } catch (error: any) {
        toast.error(error?.message);
      } finally {
        setLoader(false);
      }
    },
  });

  const generatePDF = async (pdfData: any) => {
    // Generate PDF using pdfData
    const blob = await pdf(
      <PdfDocument pdfData={pdfData} date={date} />
    ).toBlob();
    return blob;
  };

  const handleDateChange = (date: any) => {
    setDate(moment(date[0]).format());
    validation.setFieldValue("date", moment(date[0]).toDate());
  };

  useEffect(() => {
    const hasAnyValue = Object.values(validation.values).every(
      (value) => value
    );
    setMailDisable(!hasAnyValue);
  }, [validation.values]);

  return (
    <div className="page-content">
      {loader && <Loader />}
      <Modal
        isOpen={mailModal}
        toggle={toggleMail}
        modalClassName="zoomIn"
        centered
      >
        <ModalHeader toggle={toggleMail} className="p-3 bg-light p-3">
          Get Mail
        </ModalHeader>
        <form onSubmit={mailForm.handleSubmit}>
          <ModalBody>
            <Row className="mb-2">
              <Col lg={12} className="mb-2">
                <BaseInput
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter email"
                  handleChange={mailForm.handleChange}
                  handleBlur={mailForm.handleBlur}
                  value={mailForm.values.email}
                  touched={mailForm.touched.email}
                  error={mailForm.errors.email}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <BaseButton
              color="none"
              className="btn btn-ghost-success"
              type="button"
              onClick={toggleMail}
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
        </form>
      </Modal>
      <div
        className={
          pdfData?.length !== 0 ? "d-flex justify-content-end m-2" : "d-none"
        }
      >
        <Link
          to="/report"
          className="px-4 py-2 bg-dark text-white rounded"
          onClick={() => setPdfData([])}
        >
          Back
        </Link>
      </div>
      <Col xl={12} className={pdfData?.length !== 0 ? "d-none" : ""}>
        <Row className="g-3 d-flex justify-content-center px-5 mx-5">
          <Col sm={3}>
            <div className="">
              <Label>Date</Label>
              <Flatpickr
                name="date"
                className="form-control"
                id="datepicker-publish-input"
                placeholder="Select a date"
                value={validation.values.date}
                onChange={handleDateChange}
                options={{
                  altInput: true,
                  altFormat: "F j, Y",
                  mode: "single",
                  dateFormat: "d.m.y",
                }}
              />
              {validation.touched.date && validation.errors.date ? (
                <div className="text-danger error-font">
                  {`${validation.errors.date}`}
                </div>
              ) : null}
            </div>
          </Col>

          <Col sm={3}>
            <div>
              <Label>Project Name</Label>
              <BaseSelect
                name="project_name"
                className="select-border"
                options={project}
                placeholder={SelectPlaceHolder(taskLabels?.projectName)}
                handleChange={(selectedOption: any) => {
                  validation.setFieldValue(
                    "project_name",
                    selectedOption?.value
                  );
                }}
                handleBlur={validation.handleBlur}
                value={
                  dynamicFind(project, validation?.values?.project_name) || ""
                }
                touched={validation.touched.project_name}
                error={validation.errors.project_name}
              />
            </div>
          </Col>
          <Col sm={3}>
            <div className="mt-4">
              <Row>
                <Col sm={12}>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={() => {
                      validation.handleSubmit();
                    }}
                  >
                    <i className="ri-printer-line me-2 align-bottom"></i>
                    View PDF
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
          <Col sm={3}>
            <div className="mt-4">
              <Row>
                <Col sm={12}>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    onClick={() => toggleMail()}
                    disabled={mailDisable}
                  >
                    <i className="ri-mail-line me-2 align-bottom"></i>
                    Get Mail
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Col>
      {alertShow ? (
        <Row className="d-flex justify-content-center mt-3">
          <Col sm="5">
            <Alert color="danger" className="text-center">
              {handleResponse?.dataNotFound}
            </Alert>
          </Col>
        </Row>
      ) : null}
      {pdfData?.length !== 0 ? (
        <>
          <PDFViewer style={{ width: "100%", height: "100vh" }} className="pdf">
            <Document>
              <Page size="A4" style={styles.page} orientation="landscape">
                <View style={styles.header} wrap={false}>
                  <Image src={logoImage} style={styles.logo} />
                  <Text style={styles.cell}>Aranath Enterprise</Text>
                  <Text style={styles.cell}>Daily Report</Text>
                  <View style={styles.headerRow}>
                    <Text style={styles.cell}>Project Name</Text>
                    <Text style={styles.cell}>Project Manager</Text>
                    <Text style={styles.cell}>Date</Text>
                    <Text style={styles.cell}>Day</Text>
                    <Text style={styles.cell}>Time</Text>
                  </View>
                  <View style={styles.headerRow}>
                    <Text style={styles.cell}>
                      {pdfData?.taskDetails[0]?.projectName}
                    </Text>
                    <Text style={styles.cell}>
                      {pdfData?.taskDetails[0]?.managerName}
                    </Text>
                    <Text style={styles.cell}>{moment(date).format("L")}</Text>
                    <Text style={styles.cell}>
                      {moment(date).format("dddd") || "-"}
                    </Text>
                    <Text style={styles.cell}>
                      {pdfData?.taskDetails[0]?.descriptionOfWork?.start_time}{" "}
                      to {pdfData?.taskDetails[0]?.descriptionOfWork?.end_time}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.cell1}>Vendor Details</Text>
                  <ItemsTable data={pdfData?.taskDetails[0]} />
                  <Text style={styles.cell1}>Description of work</Text>
                  <ItemsTable2 data={pdfData?.taskDetails[0]} />
                </View>

                <View break>
                  <Text style={styles.cell1}>Material Procurement</Text>
                  <ItemsTable3 data={pdfData?.stockDetails} />
                  <Text style={styles.cell1}>Inventory</Text>
                  <ItemsTable4 data={pdfData} />
                </View>

                <View break>
                  <Text style={styles.cell1}>Transaction</Text>
                  <ItemsTable5 data={pdfData?.taskDetails[0]} />
                </View>

                <Text style={styles.footer}>Aranath Enterprise</Text>
              </Page>
            </Document>
          </PDFViewer>
        </>
      ) : null}
    </div>
  );
};

export default Report;
