import http from "@utils/request";

export const getDoctorList = async () => {
    return http.request({ url: "/api/doctor/", method: "GET" });
    }
export const createDoctor = async (data: any) => {
    return http.request({ url: "/api/doctor/", method: "POST", data });
}
export const updateDoctor = async (id: string, data: any) => {
    return http.request({ url: `/api/doctor/${id}`, method: "PATCH", data });
}
export const deleteDoctor = async (userId: string,id: string) => {
    return http.request({ url: `/api/doctor/${id}?userId=${userId}`, method: "DELETE" ,userId });
}