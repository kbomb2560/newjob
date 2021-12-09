import React, { useState, useEffect } from "react";
import axios from "axios";

//import StudentsListComp from "./StudentsList";

import { TableBody, TableRow, TableCell, Button } from "@material-ui/core";
import { Alert, Badge } from "reactstrap";
import Loading from "../../components/loading";
//import DataServiceStudent from "../../services/ServiceStudents";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import Controls from "../../components/Dialogs/controls/Controls";
import EmployeeForm from "./StudentsForm";
import Chip from "@material-ui/core/Chip";

//import classnames from "classnames";
import useTable from "../../components/Dialogs/useTable";
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
import { useUserDispatch } from "../../context/UserContext";
import { makeStyles } from "@material-ui/core/styles";

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
  table: {
    fontSize: "200pt",
  },
  tableRow: {
    "&$hover:hover": {
      backgroundColor: "blue",
    },
    fontSize: "40pt",
    minWidth: 650,
  },
  tableCell: {
    "$hover:hover &": {
      color: "pink",
      fontSize: "40pt",
    },

    hover: {},
  },
}));

const headCells = [
  { id: "users_id", label: "รหัสนักศึกษา", disableSorting: true },
  { id: "fullname", label: "ชื่อ-สกุล", disableSorting: true },
  { id: "fac_name", label: "คณะ", disableSorting: true },
  { id: "program_name", label: "สาขาวิชา", disableSorting: true },
  { id: "sch_name", label: "ประเภททุน", disableSorting: true },
  { id: "std_status", label: "สถานะทุน", disableSorting: true },
  { id: "actions", label: "Actions", disableSorting: true },
];

const StudentsList = (props) => {
  const classes = useStyles();

  //const [data, setData] = useState([]); //post
  /*
  const [record, setRecord] = useState([]);
*/
  //const [isLoading, setIsLoading] = useState(false); //load data
  //const [isError, setIsError] = useState(false); //fail

  /*
  var initialTutorialState = {
    id: null,
    title: "",
    published: false,
  };
  */
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

  const { TblContainer, TblHead } = useTable(records, headCells, filterFn);

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

  //const [searchValue, setsearchValue] = useState(""); //user search

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
  //
  /*


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

*/

  //old data
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
      <TblContainer>
        <TblHead />
        <TableBody>
          {props.data.map((item) => (
            <TableRow
              key={item.id}
              classes={{ hover: classes.hover }}
              className={classes.tableRow}
              hover
            >
              <TableCell>{item.std_code}</TableCell>
              <TableCell>
                {item.prefix + "" + item.firstname + " " + item.lastname}
              </TableCell>
              <TableCell>{item.fac_name}</TableCell>
              <TableCell>{item.program_name}</TableCell>
              <TableCell>{item.sch_name}</TableCell>
              <TableCell>
                <Chip
                  color={badgeStyle(item.std_status)}
                  label="ได้รับทุน"
                  icon={<DoneIcon />}
                  variant="outlined"
                />
              </TableCell>
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
                      title: `"ลบแท้ติ?${item.id}"`,
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

      <Popup
        title="ข้อมูลนักศึกษาทุน"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <EmployeeForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </Paper>
  );
};
export default StudentsList;
