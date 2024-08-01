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
import { handleResponse, searchPlaceHolder } from "Components/constants/common";
import Loader from "Components/Base/Loader";
import {
  channalPartner,
  contactuslist,
  contactUsTabel,
} from "Components/constants/inquiry";
import TableContainer from "Components/Base/TableContainer";
import { listOfChannelPartner } from "api/inquiry";
import BaseButton from "Components/Base/BaseButton";
import moment from "moment";
import { errorHandle } from "helpers/service";

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

const ChannelPartner = () => {
  document.title = contactUsTabel.title3;
  const [loader, setLoader] = useState<ContactUsState["loader"]>(false);
  const [data, setData] = useState<ContactUsState["data"]>("");
  const [selectedRowData, setSelectedRowData] =
    useState<ContactUsState["selectedRowData"]>(null);
  const [modalOpen, setModalOpen] =
    useState<ContactUsState["modalOpen"]>(false);
  function fetchData() {
    setLoader(true);
    listOfChannelPartner({
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
        header: channalPartner.PartnerName,
        accessorKey: channalPartner.PartnerAccessor,
        enableColumnFilter: false,
      },
      {
        header: channalPartner.MobileNo,
        accessorKey: channalPartner.MobileNoAccessor,
        enableColumnFilter: false,
      },
      {
        header: channalPartner.GSTIN,
        accessorKey: channalPartner.GSTINAccessor,
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
        {loader && <Loader />}
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
                        isHeaderTitle={contactuslist.channalPartner}
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

        <Modal isOpen={modalOpen} toggle={toggleModal} className="p-3">
          <ModalHeader toggle={toggleModal}>
            {contactUsTabel.MoreRecords}
          </ModalHeader>
          {loader && <Loader />}
          <ModalBody>
            {selectedRowData && (
              <div>
                <Row className="mb-2 chhanalPartner">
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
                      {channalPartner.PartnerName}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.channel_partner_name}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">{channalPartner.GSTIN}</Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.GSTIN || "--"}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {channalPartner.MobileNo}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.mobile_no || "--"}
                  </Col>

                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">{contactUsTabel.email}</Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.email_id || "--"}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {channalPartner.CommisonCharge || "--"}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.commission_charge}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {channalPartner.TypeOfPropertiesDetails}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {(selectedRowData.type_of_properties_dealt &&
                      selectedRowData?.type_of_properties_dealt?.map(
                        (property: any, index: any) => (
                          <div key={index}>{property}</div>
                        )
                      )) ||
                      "--"}
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

export default ChannelPartner;
