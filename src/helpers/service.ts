import { handleResponse, projectTitle } from "Components/constants/common";
import { NOT_FOUND } from "Components/emus/emus";
import { toast } from "react-toastify";

export const errorHandle = (error: any) => {
  error?.response?.data?.statusCode === NOT_FOUND
    ? toast.error(error?.response?.data?.message)
    : toast.error(handleResponse.somethingWrong);
};

//For select
export const dynamicFind = (array: any, validation: any) => {
  return array?.find((option: any) => option?.value === validation);
};

//For document title
export const documentTitle = (Title: string) => {
  return Title + " | " + projectTitle;
};

//Custom style
export const customStyles = {
  multiValue: (styles: any, { data }: any) => {
    return {
      ...styles,
      backgroundColor: "#3762ea",
    };
  },
  multiValueLabel: (styles: any, { data }: any) => ({
    ...styles,
    backgroundColor: "#405189",
    color: "white",
  }),
  multiValueRemove: (styles: any, { data }: any) => ({
    ...styles,
    color: "white",
    backgroundColor: "#405189",
    ":hover": {
      backgroundColor: "#405189",
      color: "white",
    },
  }),
};
