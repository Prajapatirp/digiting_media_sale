import { LIST_SERVICE, SERVICE } from "./apiRoutes";
import { authServices } from "./apiServices";

export const createService = async (data: object) => {
  const response = await authServices.post(`${SERVICE}`, data);
  return response?.data;
};

export const listOfService = async (data?: object) => {
    const response = await authServices.post(`${LIST_SERVICE}`, data);
    return response?.data;
};

export const deleteService = async (id?: number) => {
    const response = await authServices.delete(`${SERVICE}/${id}`);
    return response?.data;
};

export const updateService = async (data:object, id?: number | undefined) => {
    const response = await authServices.put(`${SERVICE}/${id}`, data);
    return response?.data;
};
