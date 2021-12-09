import React, { useState, useEffect } from "react";
import axios from "axios";

const KEYS = {
  employees: "employees",
  employeeId: "employeeId",
};

export const getDepartmentCollection = () => [
  { id: "1", title: "Development" },
  { id: "2", title: "Marketing" },
  { id: "3", title: "Accounting" },
  { id: "4", title: "HR" },
];

export function insertEmployee(data) {
  let employees = getAllEmployees();
  data["id"] = generateEmployeeId();
  employees.push(data);
  localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}
/// same top
/*
export const insertEmployee = async (data) => {
  setLoading(true);
  const result = await axios.post("create-employee", data);
  setData(result);
  setLoading(false);
};
*/
export function updateEmployee(data) {
  let employees = getAllEmployees();
  let recordIndex = employees.findIndex((x) => x.id == data.id);
  employees[recordIndex] = { ...data };
  localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function deleteEmployee(id) {
  let employees = getAllEmployees();
  employees = employees.filter((x) => x.id != id);
  localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function generateEmployeeId() {
  if (localStorage.getItem(KEYS.employeeId) == null)
    localStorage.setItem(KEYS.employeeId, "0");
  var id = parseInt(localStorage.getItem(KEYS.employeeId));
  localStorage.setItem(KEYS.employeeId, (++id).toString());
  return id;
}

export function getAllEmployees() {
  if (localStorage.getItem(KEYS.employees) == null)
    localStorage.setItem(KEYS.employees, JSON.stringify([]));
  let employees = JSON.parse(localStorage.getItem(KEYS.employees));
  //map departmentID to department title
  let departments = getDepartmentCollection();
  //console.log("data-> " + employees);
  return employees.map((x) => ({
    ...x,
    department: departments[x.departmentId - 1].title,
  }));
}

export const getAllStudent = async () => {
  //setLoading(true);
  let result = await axios.get("http://academic.pcru.ac.th/api/all-rule.php");
  let data = await result.data;
  let dataStudents = JSON.parse(data.rules);
  //console.log("xxx -> " + JSON.stringify(dataStudents));
  //setData(result);
  //console.log("data success : ", data.rules);
  //setLoading(false);
  /* */
  return dataStudents.map((x) => ({
    ...x,
  }));
};

/*/
export function getAllStudent() {
  const config = {
    //BASE_URL: "http://172.16.23.23/php-api",
    BASE_URL: "http://academic.pcru.ac.th/api",
    http://academic.pcru.ac.th/api/all-news.php?tp=1
  };
}
*/
/*
const getAllStudents = () => {
  //const [post, setPost] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
};
*/
/*
export default class getAllStudents extends React.Component {
  state = {
    data: [],
  };

  componentDidMount() {
    axios
      .get(`http://academic.pcru.ac.th/api/all-news.php?tp=1`)
      .then((res) => {
        const data = res.data;
        this.setState({ data });
      });
  }

  render() {
    return this.state.data.map((x) => ({
      ...x,
    }));
  }
}
*/
/*
export function getAllStudents() {
 
  axios("http://academic.pcru.ac.th/api/all-news.php?tp=1")
    .then(function (axiosResponse) {
      let data = JSON.parse(axiosResponse.data.response);
      console.log("actionUser: ", data);
      //dispatcher.dispatch({type: "GET_USER", user: data[0].username});
    })
    .catch(function (error) {
      console.log("error from getUser in todoactions: ", error);
    });
}   
 */
