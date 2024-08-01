import { LOGIN, SEND_OTP, FORGOT_PASSWORD, VERIFY_OTP, REGISTER, LIST_USER, DELETE_USER, UPDATEPROFILE, VIEWPROFILE, CHANGEPASSWORD, FILEUPLOAD } from "./apiRoutes";
import { authInstanceMultipart, authServices } from "./apiServices";

export const login = async (data: object) => {
  const response = await authServices.post(`${LOGIN}`, data);
  return response?.data;
};

export const register = async (data: object) => {
  const response = await authServices.post(`${REGISTER}`, data);
  return response?.data;
};

export const listOfUser = async (data: object) => {
  const response = await authServices.post(`${LIST_USER}`, data);
  return response?.data;
};

export const deleteUser = async (id: number) => {
  const response = await authServices.delete(`${DELETE_USER}/${id}`);
  return response?.data;
};

//Forgot Password
export const sendOtp = async (data: object) => {
  const response = await authServices.post(`${SEND_OTP}`, data);
  return response?.data;
};

export const verifyOtp = async (data: object) => {
  const response = await authServices.post(`${VERIFY_OTP}`, data);
  return response?.data;
};

export const forgotPassword = async (data: object) => {
  const response = await authServices.post(`${FORGOT_PASSWORD}`, data);
  return response?.data;
};

export const updateProfile = async (id?: number, data?: object) => {
  const response = await authServices.put(`${UPDATEPROFILE}/${id}`, data);
  return response?.data;
};

export const viewProfile = async (id?: number, data?: object) => {
  const response = await authServices.get(`${VIEWPROFILE}/${id}`, data);
  return response?.data;
};

export const changePassword = async(id?: number ,data?: object) =>{
  const response = await authServices.post(`${CHANGEPASSWORD}/${id}`, data);
  return response?.data;
};

export const fileUpload = async(data?:FormData)=>{
  const response = await authInstanceMultipart.post(`${FILEUPLOAD}`,data);
  return response?.data;
};