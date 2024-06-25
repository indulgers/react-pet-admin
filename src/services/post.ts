import http from "@utils/request";
export const getMyPostList = async (userId: string) => {
  return http.request({ url: `/api/post/my/${userId}`, method: "GET" });
};
export const addPost = async (data: any) => {
  return http.request({ url: "/api/post", method: "POST", data });
};
export const deletePost = async (id: string) => {
  return http.request({ url: `/api/post/${id}`, method: "DELETE" });
};
export const updatePost = async (id: string, data: any) => {
  return http.request({ url: `/api/post/${id}`, method: "PATCH", data });
};
