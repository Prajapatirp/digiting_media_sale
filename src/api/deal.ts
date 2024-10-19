import { CREATE_DEAL, LIST_OF_DEAL } from "./apiRoutes";
import { authServices } from "./apiServices";

export const listOfDeal = async (data?: object) => {
  const response = await authServices.post(`${LIST_OF_DEAL}`, data);
  return response?.data;
};

export const createDeal = async (data?: object) => {
  const response = await authServices.post(`${CREATE_DEAL}`, data);
  return response?.data;
};

export const updateDeal = async (data: object, id: any) => {
  const response = await authServices.put(`${CREATE_DEAL}/${id}`, data);
  return response?.data;
};
