import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Fade,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Controls from "../../components/Dialogs/controls/Controls";
import EmployeeForm from "./StudentsForm";
import BasicTable from "./stdTable";
import { withRouter } from "react-router-dom";
//import classnames from "classnames";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import useTable from "../../components/Dialogs/useTable";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

import Notification from "../../components/Dialogs/Notification";
import ConfirmDialog from "../../components/Dialogs/ConfirmDialog";
//
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AddCircle from "@material-ui/icons/AddCircle";
//dialogs//
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

import Popup from "../../components/Dialogs/Popup";
// styles
import * as employeeService from "../../services/employeeService";
import useStyles from "./styles";
// components
import PageTitle from "../../components/PageTitle/PageTitle";
// context
import { useUserDispatch, creatStudents } from "../../context/UserContext";

const headCells = [
  { id: "stdcode", label: "รหัสนักศึกษา" },
  { id: "fullname", label: "ชื่อ-สกุล" },
  { id: "facalties", label: "คณะ" },
  { id: "department", label: "สาขาวิชา" },
  { id: "scholarname", label: "ทุนที่ได้รับ" },
  { id: "scholaryear", label: "ปีที่ได้รับทุน" },
  { id: "scholarstatus", label: "สถานะ" },
  { id: "actions", label: "Actions", disableSorting: true },
];
function Students(props) {
  var classes = useStyles();

  var initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false,
  };
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState(employeeService.getAllStudent());
  //const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const handleClose = () => {
    //setOpen(false);
    setOpenPopup(false);
  };
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTable(records, headCells, filterFn);

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
  const addOrEdit = (employee, resetForm) => {
    if (employee.id == 0) employeeService.insertEmployee(employee);
    else employeeService.updateEmployee(employee);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Submitted Successfully",
      type: "success",
    });
  };

  const [tutorial, setTutorial] = useState(initialTutorialState);
  const [submitted, setSubmitted] = useState(false);

  // global
  var userDispatch = useUserDispatch();
  const [isError, setIsError] = useState(false); //fail
  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  //var [activeTabId, setActiveTabId] = useState(0);
  //var [nameValue, setNameValue] = useState("");
  //var [loginValue, setLoginValue] = useState("admin@flatlogic.com"); //user email
  //var [passwordValue, setPasswordValue] = useState("password"); //password

  var [loginValue, setLoginValue] = useState(""); //user email
  var [passwordValue, setPasswordValue] = useState(""); //password

  var [searchValue, setsearchValue] = useState(""); //user search

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    employeeService.deleteEmployee(id);
    setRecords(employeeService.getAllEmployees());
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };
  //พ่นข้อมูล
  const [data, setData] = useState([]); //post

  const fecthData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://academic.pcru.ac.th/api/all-news.php?tp=1`,
      );
      const data = await res.data;
      setData(data.news); //รับค่า result
      //console.log(data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    let isMounted = true;
    if (isMounted) fecthData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageTitle title="ข้อมูลนักศึกษาทุน" />

      <div className={classes.form}>
        <React.Fragment>
          <InputBase
            className={classes.input}
            placeholder="ป้อนรหัสนักศึกษา"
            inputProps={{ "aria-label": "ป้อนรหัสนักศึกษา" }}
            onChange={(e) => setsearchValue(e.target.value)}
            value={searchValue}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            color="secondary"
            onClick={() => setOpenPopup(true)}
            disabled={searchValue.length === 0}
          >
            <AddCircle />
          </IconButton>

          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPagingAndSorting().map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.stdcode}</TableCell>
                  <TableCell>{item.fullname}</TableCell>
                  <TableCell>{item.facalties}</TableCell>
                  <TableCell>{item.scholarname}</TableCell>
                  <TableCell>{item.scholaryear}</TableCell>
                  <TableCell>{item.scholarstatus}</TableCell>
                  <TableCell>
                    <Controls.ActionButton
                      color="primary"
                      onClick={() => {
                        openInPopup(item);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </Controls.ActionButton>
                    <Controls.ActionButton
                      color="secondary"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: "ลบแท้ติ?",
                          subTitle: "You can't undo this operation",
                          onConfirm: () => {
                            onDelete(item.id);
                          },
                        });
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TblContainer>
          <TblPagination />

          <Popup
            title="ข้อมูลนักศึกษาทุน"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          >
            <EmployeeForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />

            <div className={classes.formButtons}>
              {isLoading ? (
                <CircularProgress size={26} className={classes.loginLoader} />
              ) : (
                <Button
                  disabled={
                    loginValue.length === 0 || passwordValue.length === 0
                  }
                  onClick={() =>
                    creatStudents(
                      userDispatch,
                      loginValue,
                      passwordValue,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  บันทึกข้อมูล
                </Button>
              )}
            </div>
          </Popup>
          <Notification notify={notify} setNotify={setNotify} />
          <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        </React.Fragment>
      </div>
    </>
  );
}

export default withRouter(Students);
