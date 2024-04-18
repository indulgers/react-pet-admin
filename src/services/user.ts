import http from "@utils/request";
export const login = async (data: any) => {
  return http.request({ url: "/api/user/account", method: "POST", data });
};
export const captchaLogin = async (data: any) => {  
    return http.request({ url: "/api/user/login", method: "POST", data });
    }
export const getUserInfo = async (id: string) => {
  return http.request({ url: `/api/user/info/${id}`, method: "GET" });
};
export const getVerifyCode = async (data: any) => {
  return http.request({ url: "/api/user/verify", method: "POST", data });
};
export const getUserList = async () => {
  return http.request({ url: "/api/user/", method: "GET" });
};
export const createUser = async (data: any) => {
  return http.request({ url: "/api/user/create", method: "POST", data });
};
export const updateUser = async (id: string, data: any) => {
  return http.request({ url: `/api/user/update/${id}`, method: "PUT", data });
};
export const deleteUser = async (id: string, userId: string) => {
  return http.request({
    url: `/api/user/${id}?userId=${userId}`,
    method: "DELETE",
  });
};
