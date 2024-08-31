import { useState, useEffect, useMemo } from "react";
import { Card, Col, Row, Container } from "reactstrap";
import { searchPlaceHolder } from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseButton from "Components/Base/BaseButton";
import { employeeLabel } from "Components/constants/employee";
import { OK, SUCCESS } from "Components/emus/emus";
import { toast } from "react-toastify";
import TableContainer from "Components/Base/TableContainer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { dealKey, dealLabel } from "Components/constants/deal";
import BreadCrumb from "Components/Base/BreadCrumb";
import { Link } from "react-router-dom";
import { listOfDeal } from "api/deal";
import { errorHandle } from "helpers/service";
import moment from "moment";

const DealFrom = () => {
  const [loader, setLoader] = useState<boolean>(true);
  const [dealList, setDealList] = useState<any>([]);

  useEffect(() => {
    listOfDeal()
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setDealList(res?.data);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  const columns = useMemo(
    () => [
      {
        header: dealLabel.Customer_name,
        accessorKey: dealKey.Customer_name,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Company_name,
        accessorKey: dealKey.Company_name,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Package,
        accessorKey: dealKey.Package,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Listing,
        accessorKey: dealKey.Listing,
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Contract_start_date,
        accessorKey: dealKey.Contract_start_date,
        cell: (cell: any) => {
          const date = cell?.row?.original?.contract_date;
          return date ? moment(date).format("LL") : "---";
        },
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Contract_end_date,
        accessorKey: dealKey.Contract_end_date,
        cell: (cell: any) => {
          const date = cell?.row?.original?.contract_end_date;
          return date ? moment(date).format("LL") : "---";
        },
        enableColumnFilter: false,
      },
      {
        header: dealLabel.Email,
        accessorKey: dealKey.Email,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.Action,
        cell: (cell: { row: { original: { id: number } } }) => (
          <div className="hstack gap-2">
            <BaseButton
              id={`editMode-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-secondary edit-list"
              // onClick={() => setGetInitialValues(cell?.row?.original)}
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
              // onClick={() => {
              //   onClickDelete(cell?.row?.original?.id);
              // }}
            >
              <i className="ri-delete-bin-5-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="error"
                content="Delete"
                anchorId={`delete-${cell?.row?.original?.id}`}
              />
            </BaseButton>
            <BaseButton
              id={`usage-${cell?.row?.original?.id}`}
              className="btn btn-sm btn-soft-success usage-list"
              // onClick={() => {
              //   toggleEmployeeModal(cell?.row?.original?.id);
              // }}
            >
              <i className="ri-eye-fill align-bottom" />
              <ReactTooltip
                place="bottom"
                variant="success"
                content="View"
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
      <Container>
        <Row className="mb-3">
          <div className="shepherd-button-right d-flex justify-content-between align-items-center">
            <BreadCrumb title={dealLabel.Title} pageTitle="Forms" />
            <Link to="/deal-form">
              <BaseButton color="success" className="btn-label">
                <i className="ri-add-line label-icon align-middle fs-16 me-2"></i>
                Add Deal
              </BaseButton>
            </Link>
          </div>
        </Row>
        <Row>
          <Col lg={12}>
            <Card id="customerList">
              <div className="card-body pt-0">
                {loader && <Loader />}
                <div>
                  {dealList.length ? (
                    <TableContainer
                      isHeaderTitle={`${dealLabel.Title} List`}
                      columns={columns}
                      data={dealList || []}
                      isGlobalFilter={true}
                      customPageSize={5}
                      theadClass="table-light text-muted"
                      SearchPlaceholder={searchPlaceHolder}
                    />
                  ) : (
                    <div className="py-4 text-center"></div>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DealFrom;
