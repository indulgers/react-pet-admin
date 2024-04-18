import http from "@utils/request";
export const getAdminList = async () => {
  return http.request({ url: "/api/user/admin", method: "GET" });
};
