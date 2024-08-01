import { BaseSelect } from "Components/Base/BaseSelect";
import {
  Button,
  Card,
  CardBody,
  Container,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { OK, SUCCESS } from "Components/emus/emus";
import { useEffect, useMemo, useState } from "react";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  handleResponse,
  searchPlaceHolder,
  validationMessages,
} from "Components/constants/common";
import Loader from "Components/Base/Loader";
import {
  channalPartner,
  contactuslist,
  contactUsTabel,
  siteSelect,
} from "Components/constants/inquiry";
import TableContainer from "Components/Base/TableContainer";
import { SelectPlaceHolder } from "Components/constants/validation";
import { dynamicFind, errorHandle } from "helpers/service";
import { listOfBusinessPartner } from "api/inquiry";
import BaseButton from "Components/Base/BaseButton";
import moment from "moment";
import { configImage } from "config";

interface ContactUsProps {}

interface FormValues {
  site: string;
  startDate: Date;
  endDate: Date;
}

interface ContactUsState {
  loader: boolean;
  data: any;
  selectedRowData: any | null;
  modalOpen: boolean;
}

const PartnerWithUs = () => {
  document.title = contactUsTabel.title1;
  const [loader, setLoader] = useState<ContactUsState["loader"]>(false);
  const [data, setData] = useState<ContactUsState["data"]>("");
  const [selectedRowData, setSelectedRowData] =
    useState<ContactUsState["selectedRowData"]>(null);
  const [modalOpen, setModalOpen] =
    useState<ContactUsState["modalOpen"]>(false);

  function fetchData() {
    setLoader(true);
    listOfBusinessPartner({
      condition: {},
    })
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setData(res?.data);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => setLoader(false));
  }

  useEffect(() => {
    fetchData();
  }, []);

  const validation = useFormik({
    initialValues: {
      site: "",
      startDate: "",
      endDate: "",
    },
    onSubmit: (values, { resetForm }) => {
      setLoader(true);
      const payload = {
        site: values.site || null,
        startDate: values.startDate
          ? moment(values.startDate).format("YYYY-MM-DD")
          : null,
        endDate: values.endDate
          ? moment(values.endDate).format("YYYY-MM-DD")
          : null,
      };
      listOfBusinessPartner(payload)
        .then((res) => {
          if (res?.statusCode === OK && res?.status === SUCCESS) {
            setData(res?.data);
            resetForm();
          } else {
            toast.error(res?.message);
          }
        })
        .catch((error) => {
          setData(null);
        })
        .finally(() => setLoader(false));
    },
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleView = (rowData: any) => {
    setSelectedRowData(rowData);
    toggleModal();
  };

  const columns = useMemo(
    () => [
      {
        header: channalPartner.Id,
        accessorKey: channalPartner.id,
        enableColumnFilter: false,
        cell: (cell: { row: { index: number } }) => cell.row.index + 1,
      },
      {
        header: contactUsTabel.companyName,
        accessorKey: contactUsTabel.companyNameAccessor,
        enableColumnFilter: false,
      },
      {
        header: contactUsTabel.businessTitle,
        accessorKey: contactUsTabel.businessTitleAccessor,
        enableColumnFilter: false,
      },
      {
        header: contactUsTabel.visiteDate,
        accessorKey: contactUsTabel.visiteDateAccessor,
        enableColumnFilter: false,
        cell: (cell: { row: { original: any } }) => (
          <div>
            {moment(
              cell.row.original[contactUsTabel.visiteDateAccessor]
            ).format("YYYY-MM-DD")}
          </div>
        ),
      },
      {
        header: contactUsTabel.contactNo,
        accessorKey: contactUsTabel.contactNoAccessor,
        enableColumnFilter: false,
      },
      {
        header: contactUsTabel.action,
        cell: (cell: { row: { original: any } }) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`usage-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-success usage-list"
              onClick={() => handleView(cell?.row?.original)}
            >
              <i className="ri-eye-fill align-bottom" />
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
        <form onSubmit={validation.handleSubmit}>
          {loader && <Loader />}
          <Card>
            <CardBody>
              <div className="mb-3">
                <Col xl={12}>
                  <Row className="g-3 d-flex justify-content-center">
                    <Col lg={3} className="mb-2">
                      <Label>{contactUsTabel.selcetSiteName}</Label>
                      <BaseSelect
                        name="site_name"
                        className="select-border"
                        options={siteSelect}
                        placeholder={SelectPlaceHolder(
                          contactUsTabel.selcetSite
                        )}
                        handleChange={(selectedOption: any) => {
                          validation.setFieldValue(
                            "site",
                            selectedOption?.value || ""
                          );
                        }}
                        handleBlur={validation.handleBlur}
                        value={
                          dynamicFind(siteSelect, validation?.values?.site) ||
                          ""
                        }
                      />
                    </Col>

                    <Col lg={3}>
                      <div className="">
                        <Label>{contactUsTabel.selcetDate}</Label>
                        <Flatpickr
                          name="startDate"
                          className="form-control"
                          id="datepicker-publish-input"
                          placeholder={SelectPlaceHolder(
                            contactUsTabel.startDate
                          )}
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
                    <Col lg={3} className="mb-2">
                      <Label>{contactUsTabel.end_date}</Label>
                      <Flatpickr
                        name="endDate"
                        className="form-control"
                        placeholder={SelectPlaceHolder(contactUsTabel.endDate)}
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
                    </Col>
                    <Col sm={3}>
                      <div className="mt-4">
                        <Row>
                          <Col sm={12}>
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              {contactUsTabel.filter}
                            </button>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </div>
            </CardBody>
          </Card>
        </form>
        <Row>
          <Col lg={12}>
            <Card id="expanseList">
              {loader ? (
                <Loader />
              ) : (
                <div className="card-body pt-0">
                  <div>
                    {data?.length > 0 ? (
                      <TableContainer
                        isHeaderTitle={contactUsTabel.PartnerWith}
                        columns={columns}
                        data={data || []}
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
        <Modal
          isOpen={modalOpen}
          toggle={toggleModal}
          className="p-3 chhanalPartner"
        >
          <ModalHeader toggle={toggleModal}>
            {contactUsTabel.MoreRecords}
          </ModalHeader>
          {loader && <Loader />}
          <ModalBody>
            {selectedRowData && (
              <div>
                <Row className="mb-2">
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {contactUsTabel.companyName}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.company_name}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {contactUsTabel.authorizedPeroson}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.authorized_person_name}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {contactUsTabel.businessDetails}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.business_details}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {contactUsTabel.businessTitle}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.business_title}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {contactUsTabel.contactNo}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.contact_no}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">{contactUsTabel.email}</Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.email || "--"}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {contactUsTabel.visiteDate}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.visit_date
                      ? moment(selectedRowData.visit_date).format("YYYY-MM-DD")
                      : ""}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {contactUsTabel.visiteLocation}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.visit_location}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {contactUsTabel.visteImage}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    <a
                      href={`${configImage?.api?.API_URL}/${selectedRowData.visiting_card_image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${configImage?.api?.API_URL}/${selectedRowData.visiting_card_image}`}
                        className="avatar-xl img-thumbnail"
                        alt="user-profile"
                      />
                    </a>
                  </Col>
                </Row>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              {contactUsTabel.close}
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default PartnerWithUs;
