import http from "./http-common";
/*
const getAll = () => {
  return http.get("/all-news.php?tp=1");
};
*/

const getAll = () => {
  //return http.get("/tutorials", { params });
  return http.get("/students-list.php");
};

/*
const getAll = (params) => {
  //return http.get("/tutorials", { params });
  return http.get("/students-list-limit.php", { params });
};
*/
const get = (id) => {
  return http.get(`/tutorials/${id}`);
};

const remove = async (id) => {
  const result = await http.post(`/student-del.php`, { id });
  return result;
};

const create = (data) => {
  return http.post("/tutorials", data);
};

const update = (id, data) => {
  return http.put(`/tutorials/${id}`, data);
};
/*
const remove = (id) => {
  return http.delete(`/student-del.php/${id}`);
};
*/
const removeAll = () => {
  return http.delete(`/tutorials`);
};

const findByTitle = (title) => {
  return http.get(`/tutorials?title=${title}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
};
