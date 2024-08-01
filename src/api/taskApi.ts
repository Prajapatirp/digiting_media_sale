import { DELETETASK, LISTOFUNIT, TASK, TASKADD } from "./apiRoutes";
import { authServices } from "./apiServices";

export const taskListApi = async (data: object) => {
  const response = await authServices.post(`${TASK}`, data);
  return response?.data;
};

export const addTaskApi = async (data: object) => {
  const response = await authServices.post(`${TASKADD}`, data);
  return response?.data;
};

export const editTaskApi = async (id: number, data: object) => {
  const response = await authServices.put(`${DELETETASK}${id}`, data);
  return response?.data;
};
export const deleteTaskApi = async (id: number) => {
  const response = await authServices.delete(`${DELETETASK}${id}`);
  return response?.data;
};
export const listOfUnit = async (data: any) => {
  const response = await authServices.post(LISTOFUNIT, data);
  return response?.data;
};
