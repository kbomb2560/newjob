//import axios from "axios";

/*
export default axios.create({
  baseURL: "http://academic.pcru.ac.th/api",
  headers: {
    "Content-type": "application/json",
  },
});

*/
import axios from "axios";

export default axios.create({
  //baseURL: "http://localhost:8080/api",
  baseURL: "http://academic.pcru.ac.th/dev",
  headers: {
    "Content-type": "application/json",
  },
});

/*
export default axios.create({
  //baseURL: "http://localhost:8080/api",
  baseURL: "http://academic.pcru.ac.th/dev",
});
*/
