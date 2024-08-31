import { LIST_OF_DEAL } from "./apiRoutes";
import { authServices } from "./apiServices";

export const listOfDeal = async (data?: object) => {
  const response = await authServices.post(`${LIST_OF_DEAL}`, data);
  return response?.data;
};
