export const setToken = (token: string) => {
  sessionStorage.setItem("token", token);
};

export const getToken = () => {
  const authToken = sessionStorage.getItem("authUser");
  return authToken;
};

export const getRole = () => {
  const role = sessionStorage.getItem("role");
  return role;
};
