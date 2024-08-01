//List APis
import { LIST_CITY, LIST_DESIGNATION, LIST_OF_VENDOR_SERVICE, LIST_SERVICE, LIST_STATE, LIST_USER } from "./apiRoutes";
import { authServices } from "./apiServices";

export const listOfCity = async (data: object) => {
  const response = await authServices.post(`${LIST_CITY}`, data);
  return response?.data;
};

export const listOfState = async (data: object) => {
  const response = await authServices.post(`${LIST_STATE}`, data);
  return response?.data;
};

export const listOfUser = async (data?: object) => {
  const response = await authServices.post(`${LIST_USER}`, data);
  return response?.data;
};

export const listOfDesignation = async (data: object) => {
  const response = await authServices.post(`${LIST_DESIGNATION}`, data);
  return response?.data;
};

export const listOfService = async (data: object) => {
  const response = await authServices.post(`${LIST_SERVICE}`, data);
  return response?.data;
};

export const listOfServiceType = async (data: object) => {
  const response = await authServices.post(`${LIST_OF_VENDOR_SERVICE}`, data);
  return response?.data;
};
