import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Form, Row } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RequiredField } from "Components/constants/requireMsg";
import { InputPlaceHolder } from "Components/constants/validation";
import { validationMessages } from "Components/constants/common";
import Loader from "Components/Base/Loader";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect } from "Components/Base/BaseSelect";
import BaseButton from "Components/Base/BaseButton";
import { projectLabel } from "Components/constants/project";
import { ButtonEnums, CREATED, SUCCESS } from "Components/emus/emus";
import { dynamicFind, errorHandle } from "helpers/service";
import { creteProject, editProject } from "api/projectApi";
import { toast } from "react-toastify";
import { listOfCity, listOfState } from "api/listApi";

const ProjectForm = ({ sendDataToParent, initialValues }: any) => {
  const [loader, setLoader] = useState<boolean>(true);
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);

  useEffect(() => {
    listAPi();
  }, []);

  function listAPi() {
    listOfState({})
      .then((res) => {
        setStateData(
          res?.data?.map((item: { state_name: string; id: number }) => ({
            value: item?.state_name,
            label: item?.state_name,
            id: item?.id,
          }))
        );
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }

  const fetchData = (id: number) => {
    setLoader(true);
    listOfCity({
      condition: {
        state_id: id,
      },
    })
      .then((res) => {
        setCityData(
          res?.data?.map((item: { city_name?: string }) => ({
            value: item?.city_name,
            label: item?.city_name,
          }))
        );
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  useEffect(() => {
    const state = dynamicFind(stateData, initialValues?.state)
    fetchData(state?.id)
  }, [initialValues]);


  const projectInitialValues = {
    projectName: initialValues?.project_name || '',
    address: initialValues?.address || '',
    zipCode: initialValues?.zip_code || '',
    city: initialValues?.city || '',
    state: initialValues?.state || '',
  };
  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: projectInitialValues,
    validationSchema: Yup.object({
      projectName: Yup.string().required(
        RequiredField(projectLabel.projectName)
      ),
      state: Yup.string().required(RequiredField(projectLabel.State)),
      city: Yup.string().required(RequiredField(projectLabel.City)),
      address: Yup.string().required(RequiredField(projectLabel.Address)),
      zipCode: Yup.string()
        .matches(/^\d{6}$/, projectLabel.ZipCodeValidationMessage)
        .required(RequiredField(projectLabel.ZipCode)),
    }),

    onSubmit: (values) => {
      let payload = {
        ...values,
        zipCode: String(values.zipCode)
      }
      const resetData = () => {
        initialValues.project_name = ''
        initialValues.city = ''
        initialValues.state = ''
        initialValues.zip_code = ''
        initialValues.address = ''
      }
      setLoader(true);
      if (initialValues && initialValues.id) {
        editProject(initialValues.id, payload)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
              validation.resetForm();
              sendDataToParent();
              resetData();
            } else {
              toast.error(res?.message);
            }
          })
          .catch((error) => {
            toast.error(error?.message);
          })
          .finally(() => {
            setLoader(false);
            validation.resetForm();
            initialValues.id = null
          });
      } else {
        creteProject(payload)
          .then((res) => {
            if (res?.statusCode === CREATED && res?.status === SUCCESS) {
              toast.success(res?.message);
              validation.resetForm();
              sendDataToParent();
              resetData();
            } else {
              toast.error(res?.message);
            }
          })
          .catch((error) => {
            return error;
          })
          .finally(() => setLoader(false));
      }
      validation.resetForm();
    },
  });

  return (
    <Row>
      <Col lg={12}>
        <Form
          onSubmit={(e) => {
            validation.handleSubmit();
            e.preventDefault();
            return false;
          }}
        >
          <Card>
            <CardHeader>
              <h5 className="card-title mb-0">{projectLabel.projectName}</h5>
            </CardHeader>
            {loader && <Loader />}
            <CardBody className="mb-0 pb-0">
              <div className="mb-3">
                <Row className="mb-2">
                  <Col lg={3} className="mb-2">
                    <BaseInput
                      name="projectName"
                      label={projectLabel.projectName}
                      type="text"
                      placeholder={InputPlaceHolder(projectLabel.projectName)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.projectName}
                      touched={validation.touched.projectName}
                      error={validation.errors.projectName}
                      passwordToggle={false}
                    />
                  </Col>
                  <Col lg={3} className="mb-2">
                    <BaseSelect
                      name="state"
                      label={projectLabel.State}
                      className="select-border"
                      options={stateData}
                      placeholder={InputPlaceHolder(projectLabel.State)}
                      handleChange={(selectedOption: any) => {
                        validation.setFieldValue(
                          "state",
                          selectedOption?.value || ""
                        );
                        fetchData(selectedOption?.id)
                      }}
                      handleBlur={validation.handleBlur}
                      value={dynamicFind(stateData, validation.values.state) || ''}
                      touched={validation.touched.state}
                      error={validation.errors.state}
                    />
                  </Col>
                  <Col lg={3} className="mb-2">
                    <BaseSelect
                      name="city"
                      className="select-border"
                      label={projectLabel.City}
                      placeholder={InputPlaceHolder(projectLabel.City)}
                      options={cityData}
                      handleChange={(selectedOption: any) => {
                        validation.setFieldValue(
                          "city",
                          selectedOption?.value || ""
                        );
                      }}
                      handleBlur={validation.handleBlur}
                      value={dynamicFind(cityData, validation.values.city) || ''}
                      touched={validation.touched.city}
                      error={validation.errors.city}
                    />
                  </Col>
                  <Col lg={3} className="mb-2">
                    <BaseInput
                      name="zipCode"
                      label={projectLabel.ZipCode}
                      type="number"
                      placeholder={InputPlaceHolder(projectLabel.ZipCode)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.zipCode}
                      touched={validation.touched.zipCode}
                      error={validation.errors.zipCode}
                      passwordToggle={false}
                    />
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg={6} className="mb-2">
                    <BaseInput
                      name="address"
                      label={projectLabel.Address}
                      type="textarea"
                      placeholder={InputPlaceHolder(projectLabel.Address)}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.address}
                      touched={validation.touched.address}
                      error={validation.errors.address}
                      passwordToggle={false}
                    ></BaseInput>
                  </Col>
                  <Col
                    lg={6}
                    className="d-flex align-items-end justify-content-end"
                  >
                    <BaseButton
                      disabled={loader}
                      type="submit"
                      className="btn btn-success w-sm"
                    >
                      {ButtonEnums.Submit}
                    </BaseButton>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Form>
      </Col>
    </Row>
  );
};

export default ProjectForm;
