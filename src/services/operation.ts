import http from "@utils/request";
export const getOperationList = async () => {
    return http.request({ url: "/api/operation/", method: "GET" });
    }