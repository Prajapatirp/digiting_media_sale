import { PROJECT, LIST_PROJECT, LIST_USER_PROJECT } from "./apiRoutes";
import { authServices } from "./apiServices";
import { getItem } from "Components/emus/emus";
import { roleEnums } from "Components/constants/common";


export const creteProject = async (data: object) => {
  const response = await authServices.post(`${PROJECT}`, data);
  return response?.data;
};

export const listOfProject = async (data?: object) => {
  let role = getItem('role')
  const response = await authServices.post(role === roleEnums?.Manager ? `${LIST_USER_PROJECT}` :`${LIST_PROJECT}`, data);
  return response?.data;
};

export const deleteProject = async (id?: number) => {
  const response = await authServices.delete(`${PROJECT}/${id}`);
  return response?.data;
};

export const editProject = async (id?: number, data?: object) => {
  const response = await authServices.put(`${PROJECT}/${id}`,data);
  return response?.data;
};