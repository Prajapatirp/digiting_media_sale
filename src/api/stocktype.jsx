import {  STOCKTYPEADD, STOCKTYPEDELETE, STOCKTYPEEDIT, STOCKTYPELIST } from "./apiRoutes";
import { authServices } from "./apiServices";

export const createStockType = async (data?: object) => {
  const response = await authServices.post(`${STOCKTYPEADD}`, data);
  return response?.data;
};

export const listOfStockType = async (data?: object) => {
    const response = await authServices.post(`${STOCKTYPELIST}`, data);
    return response?.data;
};

export const deleteStockType = async (id?: number) => {
    const response = await authServices.delete(`${STOCKTYPEDELETE}/${id}`);
    return response?.data;
};

export const updateStockType = async (data:object, id?: number | undefined) => {
    const response = await authServices.put(`${STOCKTYPEEDIT}/${id}`, data);
    return response?.data;
};