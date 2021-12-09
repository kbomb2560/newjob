import React, { useState, useEffect } from "react";

//import StudentsListComp from "./StudentsList";

//import DataServiceStudent from "../../services/ServiceStudents";
import CloseIcon from "@material-ui/icons/Close";

//import classnames from "classnames";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

import Notification from "../../components/Dialogs/Notification";
import ConfirmDialog from "../../components/Dialogs/ConfirmDialog";
//
//dialogs//

import Popup from "../../components/Dialogs/Popup";
//import PopupAdd from "../../components/Dialogs/PopupAdd";
// styles
import * as employeeService from "../../services/employeeService";
//import useStyles from "./styles";
// context

import TutorialDataService from "../../services/studentsService";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },

  table: {
    //background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    //boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    //color: "white",
    //height: 38,
    padding: "5px 5px 5px 5px",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    //backgroundColor: theme.palette.common.black,
    backgroundColor: "#D40693",
    color: theme.palette.common.white,
    fontFamily: "Prompt",
    padding: "7px 5px 7px 5px",
  },
  body: {
    fontSize: 14,
    fontFamily: "Prompt",
    /*lineHeight: 0.5,*/
    padding: "3px 5px 3px 5px",
  },
}))(TableCell); //กำหนด Style => TableCell
const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow); //กำหนด Style => TableRow

const StudentsList = (props) => {
  const classes = useStyles();

  // global

  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState(employeeService.getAllEmployees());
  //console.log("oxooo-> " + employeeService.getAllStudent());
  //const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  /*
  const handleClose = () => {
    //setOpen(false);
    setOpenPopup(false);
  };
  */

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  //const { TblContainer, TblHead } = useTable(records, headCells, filterFn);

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
  //const [searchValue, setsearchValue] = useState(""); //user search

  //const classes = useStyles();
  const [schStudents, setTutorials] = useState([]);
  //const [searchTitle, setSearchTitle] = useState("");
  //const tutorialsRef = useRef();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  //const [pageSize, setPageSize] = useState(3);
  //tutorialsRef.current = schStudents;

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [over, setOver] = useState(false);
  ///

  const retrieveTutorials = () => {
    // const params = getRequestParams(searchTitle, page, pageSize);

    TutorialDataService.getAll() //services.ฟังชั่น(ตัวแปร)
      .then((response) => {
        const { schStudents } = response.data;

        setTutorials(schStudents);
        //setCount(totalPages);

        console.log(response.data);
        //console.log("count :", count);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveTutorials, []);

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = async (id) => {
    try {
      //const params = getRequestParams(id);
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false,
      });
      //console.log(id);
      const result = await TutorialDataService.remove(id);
      if (result) {
        props.refreshData();
        setNotify({
          isOpen: true,
          message: "Deleted Successfully",
          type: "error",
        });
        //refresh data
      }
      //props.loadRecords();
      //retrieveTutorials();
    } catch (error) {
      setNotify({
        isOpen: true,
        message: "ลบข้อมูลไม่สำเร็จ",
        type: "error",
      });
      console.log(error);
    }
  };
  //
  /****/

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  /**/
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.data.length - page * rowsPerPage);

  //const allNews = data.length;
  //const data = await search; //รับข้อมูลแล้ว
  /**/
  const badgeStyle = (typeRules) => {
    switch (typeRules) {
      case "1":
        return "primary";
      case "2":
        return "info";
      case "3":
        return "secondary";
      case "4":
        return "success";
      case "5":
        return "danger";
      case "6":
        return "warning";
      case "7":
        return "pink";
      default:
        return "light";
    }
  };

  return (
    <Paper className={classes.root}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>ภาค/ปีการศึกษา</StyledTableCell>
              <StyledTableCell>รหัสนักศึกษา</StyledTableCell>
              <StyledTableCell align="left">ชื่อ-สกุล</StyledTableCell>
              <StyledTableCell>คณะ</StyledTableCell>
              <StyledTableCell>สาขาวิชา</StyledTableCell>
              <StyledTableCell>ประเภททุน</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {props.data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {row.termYear}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.std_code}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {row.prefix + "" + row.firstname + " " + row.lastname}
                  </StyledTableCell>
                  <StyledTableCell>{row.fac_name}</StyledTableCell>
                  <StyledTableCell>{row.program_name}</StyledTableCell>
                  <StyledTableCell>{row.sch_name}</StyledTableCell>
                  <StyledTableCell align="right">
                    <div>
                      <span
                        style={{ cursor: "pointer", color: "#9A68ED" }}
                        color="primary"
                        onClick={() => {
                          openInPopup(row.id);
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </span>

                      <span
                        style={{ cursor: "pointer", color: "#F05B42" }}
                        color="secondary"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: `"ลบแท้ติ?${row.id}"`,
                            subTitle: "You can't undo this operation",
                            onConfirm: () => {
                              onDelete(row.id);
                            },
                          });
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </span>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Popup
        title="ข้อมูลนักศึกษาทุน"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      ></Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </Paper>
  );
};
export default StudentsList;
