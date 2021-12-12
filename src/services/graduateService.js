import http from "./http-common";
/*
const getAll = () => {
  return http.get("/all-news.php?tp=1");
};
*/
/*
const getAll = () => {
  //return http.get("/tutorials", { params });
  return http.get("/students-list.php");
};
*/
const GraduateGet = (id) => {
  //return http.get("/tutorials", { params });
  return http.get(`/job-detail-end.php`, { id });
};

/*
const GraduateGet = async (id) => {
  const result = await http.post(`/job-detail-end.php`, { id });
  return result;
};
*/

const GraduateGetByID = async (id) => {
  const result = await http.post(`/job-detail-end.php`, { id });
  return result;
};

/*
const getAll = (params) => {
  //return http.get("/tutorials", { params });
  return http.get("/students-list-limit.php", { params });
};
*/
const remove = async (id) => {
  const result = await http.post(`/student-del.php`, { id });
  return result;
};

export default {
  GraduateGet,
  remove,
};
