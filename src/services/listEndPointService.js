import axios from 'axios';

export const listProvince = async () =>
  await axios.get('http://academic.pcru.ac.th/job-api/provinces-end.php');

/*
  export const listAmphure = async () =>
  await axios.get("http://academic.pcru.ac.th/job-api/provinces-end.php");
*/

//การเกณฑ์ทหาร

export const listMilitary = async () =>
  await axios.get('http://academic.pcru.ac.th/job-api/military-status-end.php');

//นักบวช
export const listOrdinate = async () =>
  await axios.get('http://academic.pcru.ac.th/job-api/ordinate-status-end.php');

//สถานภาพการทำงานปัจจุบัน
export const listWorkstatus = async () =>
  await axios.get('http://academic.pcru.ac.th/job-api/work-status-end.php');

//ประเภทงานที่ทำ
export const listOccupType = async () =>
  await axios.get('http://academic.pcru.ac.th/job-api/occup-type-end.php');

//ความสามารถพิเศษ
export const listTalent = async () =>
  await axios.get('http://academic.pcru.ac.th/job-api/qn-talent-end.php');
