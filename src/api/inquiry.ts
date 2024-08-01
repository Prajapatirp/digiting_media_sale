import { CONTACTUS, LISTOfCHANNEL, LISTOFCONTACTUS, LISTOFREDEVELOP } from "./apiRoutes";
import { authServices } from "./apiServices";

export const listOfBusinessPartner = async (data: object) => {
    const response = await authServices.post(`${CONTACTUS}`, data);
    return response?.data;
};
export const listOfChannelPartner = async (data: object) => {
    const response = await authServices.post(`${LISTOfCHANNEL}`, data);
    return response?.data;
};
export const listOfRedevelopmentInquiry = async (data: object) => {
    const response = await authServices.post(`${LISTOFREDEVELOP}`, data);
    return response?.data;
};
export const listOfContactus = async (data: object) => {
    const response = await authServices.post(`${LISTOFCONTACTUS}`, data);
    return response?.data;
};