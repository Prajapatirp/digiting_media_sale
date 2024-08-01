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
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import { handleResponse, searchPlaceHolder } from "Components/constants/common";
import Loader from "Components/Base/Loader";
import {
  channalPartner,
  contactuslist,
  contactUsTabel,
} from "Components/constants/inquiry";
import TableContainer from "Components/Base/TableContainer";
import { listOfRedevelopmentInquiry } from "api/inquiry";
import BaseButton from "Components/Base/BaseButton";
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

const Redevelopment = () => {
  document.title = contactUsTabel.title2;
  const [loader, setLoader] = useState<ContactUsState["loader"]>(false);
  const [data, setData] = useState<ContactUsState["data"]>("");
  const [selectedRowData, setSelectedRowData] =
    useState<ContactUsState["selectedRowData"]>(null);
  const [modalOpen, setModalOpen] =
    useState<ContactUsState["modalOpen"]>(false);
  function fetchData() {
    setLoader(true);
    listOfRedevelopmentInquiry({
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
        header: channalPartner.googlelocationpin,
        accessorKey: channalPartner.googlelocationpinAccessor,
        enableColumnFilter: false,
      },
      {
        header: channalPartner.MobileNo,
        accessorKey: channalPartner.MobileNoAccessor,
        enableColumnFilter: false,
      },
      {
        header: channalPartner.nameofSociety,
        accessorKey: channalPartner.nameofSocietyAccessor,
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
                        isHeaderTitle={contactuslist.Redevelopmentt}
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
                      {channalPartner.googlelocationpin}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.google_location_pin}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {channalPartner.Address}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.address}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {channalPartner.societytype}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.society_type}
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
                    <Label className="label-Font">
                      {channalPartner.stageofredevelopment}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.stage_of_redevelopment || "--"}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {channalPartner.ResidentialUnits || "--"}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.no_of_ResidentialUnits || "--"}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {channalPartner.noofCommercialUnits || "--"}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.no_of_CommercialUnits || "--"}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {channalPartner.membersagree}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.members_agree}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">
                      {channalPartner.contactperson}
                    </Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.contact_person}
                  </Col>
                  <Col lg={4} md={4} sm={4}>
                    <Label className="label-Font">{channalPartner.city}</Label>
                  </Col>
                  <Col lg={8} md={8} sm={8}>
                    {selectedRowData.city.city_name}
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

export default Redevelopment;
