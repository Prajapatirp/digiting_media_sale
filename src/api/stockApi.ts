import { STOCK, EDITSTOCK, LISTSTOCK, VIEWSTOCK } from "./apiRoutes";
import { authServices } from "./apiServices";

export const addStock = async (data: object) => {
  const response = await authServices.post(`${STOCK}`, data);
  return response?.data;
};

export const editStockApi = async (id: number, data?: object) => {
  const response = await authServices.put(`${EDITSTOCK}${id}`, data);
  return response?.data;
};

export const listStockApi = async (data?: object) => {
  const response = await authServices.post(`${LISTSTOCK}`, data);
  return response?.data;
};

export const viewStockApi = async (id: any) => {
  const response = await authServices.get(`${VIEWSTOCK}${id}`);
  return response?.data;
};
