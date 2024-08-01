import { Form, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseInput from "Components/Base/BaseInput";
import { BaseSelect } from "Components/Base/BaseSelect";
import { RequiredField } from "Components/constants/requireMsg";
import { employeeList, projectType, seniorList, serviceType, taskLabels } from "Components/constants/taskAllocation";
import { InputPlaceHolder, SelectPlaceHolder } from "Components/constants/validation";
import Flatpickr from "react-flatpickr";
import BaseButton from "Components/Base/BaseButton";
import { stockLabels } from "Components/constants/stock";

const TaskAllocationForm = ({ onSubmit }: { onSubmit: (values: any) => void }) => {

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            project_name: "",
            service_name: "",
            senior: "",
            employee: "",
            start_end_date: "",
            start_time: "",
            end_time: "",
            main_activity: '',
            sub_activity: ''
        },
        validationSchema: Yup.object({
            project_name: Yup.string().required(RequiredField(taskLabels.projectName)),
            service_name: Yup.string().required(RequiredField(taskLabels.serviceName)),
            senior: Yup.string().required(RequiredField(taskLabels.senior)),
            employee: Yup.string().required(RequiredField(taskLabels.employee)),
            start_end_date: Yup.string().required(RequiredField(taskLabels.startDateEndDate)),
            start_time: Yup.string().required(RequiredField(taskLabels.startTime)),
            end_time: Yup.string().required(RequiredField(taskLabels.endTime)),
            main_activity: Yup.string().required(RequiredField(taskLabels.mainActivity)),
            sub_activity: Yup.string().required(RequiredField(taskLabels.subActivity)),
        }),
        onSubmit: onSubmit
    });

    return (
        <Form onSubmit={validation.handleSubmit}>
            <Card>
                <CardHeader>
                    <h5 className="card-title mb-0">{taskLabels?.addTaskAllocationDetail}</h5>
                </CardHeader>
                <CardBody className="mb-0 pb-0">
                    <div className="mb-3">
                        <Row>
                            <Col lg={3} className="mb-2">
                                <BaseSelect
                                    name="project_name"
                                    className="select-border"
                                    options={projectType}
                                    placeholder={SelectPlaceHolder(taskLabels?.projectName)}
                                    handleChange={(selectedOption: any) => {
                                        validation.setFieldValue("project_name", selectedOption?.value || "");
                                    }}
                                    handleBlur={validation.handleBlur}
                                    value={projectType?.find((option: any) => option?.value === validation?.values?.project_name)}
                                    touched={validation.touched.project_name}
                                    error={validation.errors.project_name}
                                />
                            </Col>
                            <Col lg={3} className="mb-2">
                                <BaseSelect
                                    name="service_name"
                                    className="select-border"
                                    options={serviceType}
                                    placeholder={SelectPlaceHolder(taskLabels.serviceName)}
                                    handleChange={(selectedOption: any) => {
                                        validation.setFieldValue("service_name", selectedOption?.value || "");
                                    }}
                                    handleBlur={validation.handleBlur}
                                    value={serviceType?.find((option: any) => option.value === validation.values.service_name)}
                                    touched={validation.touched.service_name}
                                    error={validation.errors.service_name}
                                />
                            </Col>
                            <Col lg={3} className="mb-2">
                                <BaseSelect
                                    name="senior"
                                    className="select-border"
                                    options={seniorList}
                                    placeholder={SelectPlaceHolder(taskLabels.senior)}
                                    handleChange={(selectedOption: any) => {
                                        validation.setFieldValue("senior", selectedOption?.value || "");
                                    }}
                                    handleBlur={validation.handleBlur}
                                    value={seniorList?.find((option: any) => option.value === validation.values.senior)}
                                    touched={validation.touched.senior}
                                    error={validation.errors.senior}
                                />
                            </Col>
                            <Col lg={3} className="mb-2">
                                <BaseSelect
                                    name="employee"
                                    className="select-border"
                                    options={employeeList}
                                    placeholder={SelectPlaceHolder(taskLabels.employee)}
                                    handleChange={(selectedOption: any) => {
                                        validation.setFieldValue("employee", selectedOption?.value || "");
                                    }}
                                    handleBlur={validation.handleBlur}
                                    value={employeeList?.find((option: any) => option.value === validation.values.employee)}
                                    touched={validation.touched.employee}
                                    error={validation.errors.employee}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={3} className="mb-2">
                                <Flatpickr
                                    className="form-control"
                                    placeholder={SelectPlaceHolder(taskLabels.startDateEndDate)}
                                    options={{
                                        mode: "range",
                                        dateFormat: "d M, Y"
                                    }}
                                    onChange={dates => {
                                        const formattedDate = dates?.map(date => date.toISOString());
                                        validation.setFieldValue('start_end_date', formattedDate.join(','));
                                        validation.validateField('start_end_date');
                                    }}
                                />
                                {validation.touched.start_end_date && validation.errors.start_end_date ? (
                                    <div className="text-danger error-font">{validation.errors.start_end_date}</div>
                                ) : null}
                            </Col>
                            <Col lg={3} className="mb-2">
                                <Row>
                                    <Col lg={6} className="mb-2">
                                        <Flatpickr
                                            className="form-control"
                                            placeholder={taskLabels.startTime}
                                            options={{
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                                time_24hr: true
                                            }}
                                            value={validation.values.start_time}
                                            onChange={date => validation.setFieldValue('start_time', date[0])}
                                        />
                                        {validation.touched.start_time && validation.errors.start_time ? (
                                            <div className="text-danger error-font">{validation.errors.start_time}</div>
                                        ) : null}
                                    </Col>
                                    <Col lg={6}>
                                        <Flatpickr
                                            className="form-control"
                                            placeholder={taskLabels.endTime}
                                            options={{
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                                time_24hr: true
                                            }}
                                            value={validation.values.end_time}
                                            onChange={date => validation.setFieldValue('end_time', date[0])}
                                        />
                                        {validation.touched.end_time && validation.errors.end_time ? (
                                            <div className="text-danger error-font">{validation.errors.end_time}</div>
                                        ) : null}
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={3} className="mb-2">
                                <BaseInput
                                    name="main_activity"
                                    type="text"
                                    placeholder={InputPlaceHolder(taskLabels.mainActivity)}
                                    handleChange={validation.handleChange}
                                    handleBlur={validation.handleBlur}
                                    value={validation.values.main_activity}
                                    touched={validation.touched.main_activity}
                                    error={validation.errors.main_activity}
                                    passwordToggle={false}
                                />
                            </Col>
                            <Col lg={3} className="mb-2">
                                <BaseInput
                                    name="sub_activity"
                                    type="text"
                                    placeholder={InputPlaceHolder(taskLabels.subActivity)}
                                    handleChange={validation.handleChange}
                                    handleBlur={validation.handleBlur}
                                    value={validation.values.sub_activity}
                                    touched={validation.touched.sub_activity}
                                    error={validation.errors.sub_activity}
                                    passwordToggle={false}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} className="d-flex align-items-end justify-content-end">
                                <BaseButton type="submit" className="btn btn-success w-sm">
                                    {stockLabels.submit}
                                </BaseButton>
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
        </Form>
    );
};

export default TaskAllocationForm;
