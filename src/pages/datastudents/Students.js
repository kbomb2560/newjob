import React, { useState, useEffect } from "react";
import axios from "axios";

import StudentsListComp from "./StudentsList";

import { TableBody, TableRow, TableCell, Button } from "@material-ui/core";
import { Alert, Badge } from "reactstrap";
import Loading from "../../components/loading";
//import DataServiceStudent from "../../services/ServiceStudents";

import StudentsForm from "./StudentsForm";
import { withRouter } from "react-router-dom";

//import classnames from "classnames";
import Notification from "../../components/Dialogs/Notification";
import ConfirmDialog from "../../components/Dialogs/ConfirmDialog";
//
import InputBase from "@material-ui/core/InputBase";
//import IconButton from "@material-ui/core/IconButton";
import AddCircle from "@material-ui/icons/AddCircle";
import Search from "@material-ui/icons/Search";
//dialogs//

import Popup from "../../components/Dialogs/Popup";
// styles
import * as employeeService from "../../services/employeeService";
//import useStyles from "./styles";
// components
import PageTitle from "../../components/PageTitle/PageTitle";
// context
import { makeStyles } from "@material-ui/core/styles";
import StudentsList from "./StudentsList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

function Students(props) {
  const classes = useStyles();

  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState(employeeService.getAllEmployees());

  const [openPopup, setOpenPopup] = useState(false);
  const [data, setData] = useState([]); //post

  //const userDispatch = useUserDispatch();
  const [isError, setIsError] = useState(false); //fail
  // local
  const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState(null);
  const [nonData, setNonData] = useState(false); //fail

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const onClosePopUp = () => {
    setOpenPopup(false);
  };

  /*
  const addOrEdit = (employee, resetForm) => {
    if (employee.id == 0) {
      employeeService.insertEmployee(employee);
      console.log("xxxx");
    } else {
      employeeService.updateEmployee(employee);
      console.log("eeee");
    }
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    //setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      type: "success",
    });
  };
  */
  ///
  //
  const [searchValue, setsearchValue] = useState("641102064101"); //user search

  ///********/
  ///data im
  //load data to table

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://academic.pcru.ac.th/dev/students-list.php`,
      );
      const data = await res.data; //รับข้อมูลแล้ว
      //   .then((response) => {
      if (data.success === 0) {
        //console.log("data success : ", data.success);
        setIsError(true);
        setNonData(true);
      } else {
        setIsError(false);
        setNonData(false);
      }
      //setSearch(response.data.rules);
      //console.log("xxxx", data.success);
      setData(data.schStudents);
      //console.log(response.data);
      setIsLoading(false);
      //     });
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) loadRecords();
    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
  }, []);

  ///

  let content = <Loading msg="กำลังโหลด" />;

  if (!isLoading) {
    if (isError) {
      //content = "ไม่สามารถโหลดข้อมูลได้";
      //      console.log("eeerrrx");
      if (nonData) {
        content = (
          <Alert color="light dark">
            <p>{"ไม่พบข้อมูลที่ค้นหา!"}</p>
          </Alert>
        );
      } else {
        content = (
          <Alert color="light dark">
            <p>{"ไม่สามารถโหลดข้อมูลได้! กรุณาติดต่อผู้ดูแลระบบ"}</p>
          </Alert>
        );
      }
    } else {
      content = <StudentsListComp data={data} />;
    }
  }

  ///****** */

  return (
    <>
      <PageTitle title="ข้อมูลนักศึกษาทุน" />

      <div className={classes.form}>
        <React.Fragment>
          <InputBase
            variant="filled"
            color="secondary"
            className={classes.input}
            placeholder="ป้อนรหัสนักศึกษา"
            inputProps={{ "aria-label": "ป้อนรหัสนักศึกษา" }}
            onChange={(e) => setsearchValue(e.target.value)}
            value={searchValue}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<Search />}
            type="submit"
            className={classes.button}
            aria-label="search"
            disabled={searchValue.length === 0}
          >
            ค้นหา
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircle />}
            type="submit"
            className={classes.button}
            aria-label="add"
            onClick={() => {
              setOpenPopup(true);
            }}
            disabled={searchValue.length === 0}
          >
            เพิ่มข้อมูล
          </Button>

          <StudentsList data={data} refreshData={loadRecords} />
          <StudentsForm
            dataOpen={openPopup}
            onclose={onClosePopUp}
            StudentCode={searchValue}
            loadRecords={loadRecords}
          />
        </React.Fragment>
      </div>
    </>
  );
}

export default withRouter(Students);
