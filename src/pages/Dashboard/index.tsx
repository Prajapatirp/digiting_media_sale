import { useEffect, useMemo, useState } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import Section from "./Section";
import Widgets from "./Widgets";
import { countDeal } from "api/deal";
import { OK, SUCCESS, getItem } from "Components/emus/emus";
import { errorHandle } from "helpers/service";
import { listOfUser } from "api/listApi";
import { employeeKey, employeeLabel } from "Components/constants/employee";
import TableContainer from "Components/Base/TableContainer";
import { searchPlaceHolder } from "Components/constants/common";

const Dashboard = () => {
  document.title =
    "Dashboard | DigitingMedia - React Admin & Dashboard Template";

  const [rightColumn, setRightColumn] = useState<boolean>(true);
  const [countData, setCountData] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(true);
  const [listOfUsers, setListOfUsers] = useState([]);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };
  const role = getItem("role");

  function fetchData() {
    let condition: any = {
      is_deleted: false,
      is_active: false,
    };

    listOfUser({ condition })
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setListOfUsers(res?.data);
        } else {
          setListOfUsers([]);
        }
      })
      .catch((error) => {
        errorHandle(error);
      });
  }

  function dealLists() {
    countDeal()
      .then((res) => {
        if (res?.statusCode === OK && res?.status === SUCCESS) {
          setCountData(res?.data);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }

  useEffect(() => {
    dealLists();
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: employeeLabel.name,
        accessorKey: employeeKey.Name,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.Email,
        accessorKey: employeeKey.Email,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.ContactNo,
        accessorKey: employeeKey.ContactNo,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.Role,
        accessorKey: employeeKey.Role,
        enableColumnFilter: false,
      },
      {
        header: employeeLabel.Date,
        accessorKey: employeeKey.Date,
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col>
            <div className="h-100">
              <Row>
                <Section rightClickBtn={toggleRightColumn} />
              </Row>
              <Row>
                <Widgets countDetails={countData} />
              </Row>
              {role === "Admin" && (
                <Row>
                  <Col lg={12}>
                    <Card id="customerList">
                      <div className="card-body pt-0">
                        <div>
                          {listOfUsers.length ? (
                            <TableContainer
                              isHeaderTitle={`${employeeLabel.Title} List`}
                              columns={columns}
                              data={listOfUsers || []}
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
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
