import { authInstanceMultipart, authServices } from "./apiServices";
import { EXPENSEREPORT, REPORT, SENDREPORT, STOCKREPORT } from "./apiRoutes";

export const reportApi = async (data: object) => {
    const response = await authServices.post(`${REPORT}`, data);
    return response?.data;
};
export const sendReportApi = async (data: object) => {
    const response = await authInstanceMultipart.post(SENDREPORT, data);
    return response?.data;
};
export const stockReportApi = async (data: object) => {
    const response = await authServices.post(`${STOCKREPORT}`, data);
    return response?.data;
};
export const expanseReportApi = async (data: object) => {
    const response = await authServices.post(`${EXPENSEREPORT}`, data);
    return response?.data;
};