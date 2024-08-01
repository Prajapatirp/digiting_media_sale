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
import { listOfChannelPartner, listOfContactus } from "api/inquiry";

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

const ContactUs = () => {
  document.title = contactUsTabel.title;
  const [loader, setLoader] = useState<ContactUsState["loader"]>(false);
  const [data, setData] = useState<ContactUsState["data"]>("");

  function fetchData() {
    setLoader(true);
    listOfContactus({})
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

  const columns = useMemo(
    () => [
      {
        header: channalPartner.Id,
        accessorKey: channalPartner.id,
        enableColumnFilter: false,
        cell: (cell: { row: { index: number } }) => cell.row.index + 1,
      },
      {
        header: channalPartner.email,
        accessorKey: channalPartner.emailAccessor,
        enableColumnFilter: false,
      },
      {
        header: channalPartner.messages,
        accessorKey: channalPartner.messagesAccessor,
        enableColumnFilter: false,
      },
      {
        header: channalPartner.MobileNo,
        accessorKey: channalPartner.MobileNoAccessor,
        enableColumnFilter: false,
      },
      {
        header: channalPartner.subject,
        accessorKey: channalPartner.subjectAccessor,
        enableColumnFilter: false,
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
                        isHeaderTitle={contactuslist.ContactList}
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
      </Container>
    </div>
  );
};

export default ContactUs;
