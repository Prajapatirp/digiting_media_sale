import {DELETEEXPENSE, EXPENSE, EXPENSE_LIST, LISTLASTEXPENSE} from "./apiRoutes";
import { authServices } from "./apiServices";

export const creteExpense = async (data: object) => {
  const response = await authServices.post(`${EXPENSE}`, data);
  return response?.data;
};

export const listOfExpense = async (data?: object) => {
    const response = await authServices.post(`${EXPENSE_LIST}`, data);
    return response?.data;
};

export const deleteExpense = async (id?: number) => {
  const response = await authServices.delete(`${DELETEEXPENSE}/${id}`);
  return response?.data;
};

export const editExpense = async (id?: number, data?: object) => {
  const response = await authServices.put(`${EXPENSE}/${id}`,data);
  return response?.data;
};

export const viewExpense = async(id?:number)=>{
    const response = await authServices.get(`${LISTLASTEXPENSE}/${id}`);
    return response?.data;
};