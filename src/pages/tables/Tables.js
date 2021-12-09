import React from "react";
import { Grid, Button } from "@material-ui/core";
//import { makeStyles } from "@material-ui/styles";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle";
//import Widget from "../../components/Widget";
//import Table from "../dashboard/components/Table/Table";

// data
//import mock from "../dashboard/mock";

const datatableData = [
  ["641102064101", "Joe James", "Example Inc.", "Yonkers", "NY"],
  ["641202064102", "John Walsh", "Example Inc.", "Hartford", "CT"],
];

/*
const rememberMe = localStorage.getItem("dataStudent");
//const user = rememberMe ? localStorage.getItem("dataStudent") : "";
var studentsData = JSON.parse(rememberMe);

console.log(studentsData.STD_CODE);
*/
//this.setState({ user, rememberMe });
/*
const useStyles = makeStyles((theme) => ({
  tableOverflow: {
    overflow: "auto",
  },
}));
*/
export default function Tables() {
  //const classes = useStyles();
  const columns = [
    "รหัสนักศึกษา",
    "ชื่อ-สกุล",
    "คณะ",
    "สาขาวิชา",
    "ทุนที่ได้รับ",
    "ปีที่ได้รับทุน",
    "สถานะ",
    {
      name: "จัดการข้อมูล",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                window.alert(
                  `Clicked "Edit" for row ${rowIndex} with dataIndex of ${dataIndex}`,
                )
              }
            >
              แก้ไข
            </Button>
          );
        },
      },
    },
  ];
  return (
    <>
      <PageTitle
        title="ข้อมูลนักศึกษาทุน"
        button={
          <Button variant="contained" size="medium" color="secondary">
            เพิ่มข้อมูล
          </Button>
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="รายชื่อนักศึกษาทุน"
            data={datatableData}
            columns={columns}
            options={{
              selectableRows: "none", // <===== will turn off checkboxes in rows  use selectableRows: multiple | single | none
              print: false,
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
