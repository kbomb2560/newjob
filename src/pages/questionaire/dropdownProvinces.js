import React, { useState, useEffect } from "react";

import { listProvince } from "../../services/listPrivince";

//import axios from "axios";
//const BASE_URL = "http://academic.pcru.ac.th/job-api/provinces-end.php";
const DropDownProvinces = () => {
  const [province, setProvince] = useState([]);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = () => {
    listProvince()
      .then((res) => {
        //setProvince(res.data);
        setProvince(res.data.provinceSTD);
        //console.log(res.data.provinceSTD);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log("xxx=> ", province);
  return (
    <>
      <select>
        {province.map((item, index) => (
          <option key={index} value={item.id}>
            {item.name_th}
          </option>
        ))}
      </select>
    </>
  );
  //useEffect(loadData, []);
};

export default DropDownProvinces;
